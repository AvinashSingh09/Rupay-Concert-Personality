import rupayLogo from '../assets/rupay-on.png';

const DEFAULT_MODEL = import.meta.env.VITE_OPENAI_IMAGE_MODEL || 'gpt-image-2.6-sunburst';
const SELFIE_EXTENSIONS = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };
const AVATAR_FORMAT = 'webp';

/**
 * Converts a base64 selfie into a file for the edit request.
 */
function dataUrlToSelfieFile(dataUrl) {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/^data:(image\/\w+);base64$/)?.[1];
  const extension = SELFIE_EXTENSIONS[mime];
  if (!extension || !base64) {
    throw new Error('Choose a JPG, PNG, or WebP selfie.');
  }
  const binary = atob(base64);
  if (binary.length >= 50_000_000) {
    throw new Error('Choose a selfie smaller than 50 MB.');
  }
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new File([bytes], `selfie.${extension}`, { type: mime });
}

/**
 * Extracts a usable image src (data URL or HTTPS URL) from the image generation response
 */
function extractImageFromResponse(result) {
  const item = result?.data?.[0];
  if (!item) {
    throw new Error('Empty image response received.');
  }
  if (item.b64_json) {
    return `data:image/${AVATAR_FORMAT};base64,${item.b64_json}`;
  }
  if (item.url) {
    return item.url;
  }
  throw new Error('No image data found in response.');
}

/**
 * Edits the guest's selfie into a concert personality avatar.
 *
 * @param {Object} params
 * @param {string} params.selfieDataUrl - Base64 data URL of the user's captured selfie
 * @param {Object} params.personality - Selected personality object { id, name, subtitle, prompt }
 * @returns {Promise<{ imageUrl: string }>}
 */
export async function generateConcertAvatar({ selfieDataUrl, personality }) {
  if (!selfieDataUrl) {
    throw new Error('Take or upload a selfie first.');
  }

  const apiKey = (import.meta.env.VITE_OPENAI_API_KEY || '').trim();
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    throw new Error('Avatar generation is unavailable. The photobooth API key needs to be configured.');
  }

  const formData = new FormData();
  formData.append('model', DEFAULT_MODEL);
  formData.append('prompt', personality.prompt);
  formData.append('image', dataUrlToSelfieFile(selfieDataUrl));
  formData.append('size', '1024x1024');
  formData.append('quality', 'high');
  formData.append('output_format', AVATAR_FORMAT);
  formData.append('output_compression', '90');
  if (/^gpt-image-2\.[56]-(flare|sunburst)(-|$)/.test(DEFAULT_MODEL)) {
    formData.append('complexity', 'medium');
  }
  if (DEFAULT_MODEL === 'gpt-image-1.5') {
    formData.append('input_fidelity', 'high');
  }

  const response = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Could not edit your selfie (HTTP ${response.status}). Please try again.`);
  }

  return { imageUrl: extractImageFromResponse(await response.json()) };
}

/**
 * Composites the RuPay & "Own the edge" branding onto the avatar image on an HTML5 canvas
 * so the downloaded PNG matches Screen 4 of the photobooth.
 */
export async function createBrandedDownloadDataUrl(imageSrc) {
  const avatar = new Image();
  avatar.crossOrigin = 'anonymous';
  avatar.src = imageSrc;
  const logo = new Image();
  logo.src = rupayLogo;

  try {
    await Promise.all([avatar.decode(), logo.decode()]);
  } catch {
    return imageSrc;
  }

  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 960;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const targetRatio = width / height;
  const cropWidth = Math.min(avatar.naturalWidth, avatar.naturalHeight * targetRatio);
  const cropHeight = Math.min(avatar.naturalHeight, avatar.naturalWidth / targetRatio);
  const cropX = (avatar.naturalWidth - cropWidth) / 2;
  const cropY = (avatar.naturalHeight - cropHeight) / 2;
  ctx.drawImage(avatar, cropX, cropY, cropWidth, cropHeight, 0, 0, width, height);

  const topGrad = ctx.createLinearGradient(0, 0, 0, 240);
  topGrad.addColorStop(0, 'rgba(10, 4, 28, 0.65)');
  topGrad.addColorStop(1, 'rgba(10, 4, 28, 0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, width, 240);

  const logoWidth = 270;
  const logoHeight = logoWidth * logo.naturalHeight / logo.naturalWidth;
  const inset = 38;
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 8;
  ctx.drawImage(logo, width - logoWidth - inset, inset, logoWidth, logoHeight);
  ctx.restore();

  ctx.strokeStyle = 'rgba(196, 122, 255, 0.85)';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, width - 8, height - 8);

  return canvas.toDataURL('image/png');
}
