const DEFAULT_MODEL = import.meta.env.VITE_OPENAI_IMAGE_MODEL || 'gpt-image-2.6-sunburst';
const SELFIE_EXTENSIONS = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };

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
    return `data:image/png;base64,${item.b64_json}`;
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
  formData.append('output_format', 'png');
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
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const width = 1200;
      const height = 960;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      const imgRatio = img.width / img.height;
      const targetRatio = width / height;
      let sx = 0,
        sy = 0,
        sw = img.width,
        sh = img.height;

      if (imgRatio > targetRatio) {
        sw = img.height * targetRatio;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / targetRatio;
        sy = (img.height - sh) / 2;
      }

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);

      const topGrad = ctx.createLinearGradient(0, 0, 0, 150);
      topGrad.addColorStop(0, 'rgba(10, 4, 28, 0.65)');
      topGrad.addColorStop(1, 'rgba(10, 4, 28, 0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, width, 150);

      // Top-left: "Own the edge"
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 8;
      ctx.font = 'italic 800 26px Montserrat, sans-serif';
      ctx.fillText('Own the ', 36, 56);
      const ownWidth = ctx.measureText('Own the ').width;
      ctx.font = 'italic 400 34px "Kaushan Script", cursive';
      ctx.fillText('edge', 36 + ownWidth - 2, 58);
      ctx.restore();

      // Top-right: "RuPay" + orange/green chevron
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 8;
      ctx.font = 'italic 900 32px Montserrat, sans-serif';
      const rupayText = 'RuPay';
      const rupayWidth = ctx.measureText(rupayText).width;
      const rightX = width - 64 - rupayWidth;
      ctx.fillText(rupayText, rightX, 58);

      const triX = width - 56;
      const triY = 32;
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(triX, triY);
      ctx.lineTo(triX + 14, triY + 14);
      ctx.lineTo(triX - 3, triY + 26);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.moveTo(triX + 7, triY + 6);
      ctx.lineTo(triX + 20, triY + 18);
      ctx.lineTo(triX + 4, triY + 28);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = 'rgba(196, 122, 255, 0.85)';
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, width - 8, height - 8);

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
  });
}
