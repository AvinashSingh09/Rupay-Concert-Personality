const DEFAULT_MODEL = import.meta.env.VITE_OPENAI_IMAGE_MODEL || 'gpt-image-2.6-sunburst';

/**
 * Converts a base64 Data URL into a Blob for multipart/form-data upload
 */
function dataUrlToBlob(dataUrl) {
  const [header, base64] = dataUrl.split(',');
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type: mime });
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
 * Generates or edits a concert personality avatar using the configured image model.
 *
 * @param {Object} params
 * @param {string} params.selfieDataUrl - Base64 data URL of the user's captured selfie
 * @param {Object} params.personality - Selected personality object { id, name, subtitle, prompt }
 * @returns {Promise<{ imageUrl: string }>}
 */
export async function generateConcertAvatar({ selfieDataUrl, personality }) {
  const apiKey = (import.meta.env.VITE_OPENAI_API_KEY || '').trim();
  const model = DEFAULT_MODEL;

  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    // Graceful fallback to sample concert avatar if environment key is not set
    await new Promise((r) => setTimeout(r, 1800));
    return { imageUrl: '/assets/sample-foodie.jpg' };
  }

  const prompt =
    personality?.prompt ||
    'Transform this person into a vibrant live concert avatar with neon stage lasers.';

  // 1. If we have a captured selfie, use /v1/images/edits
  if (selfieDataUrl) {
    try {
      const jsonEditRes = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          prompt,
          images: [{ image_url: selfieDataUrl }],
          quality: 'high',
          complexity: 'high',
          output_format: 'png',
        }),
      });

      if (jsonEditRes.ok) {
        const data = await jsonEditRes.json();
        return {
          imageUrl: extractImageFromResponse(data),
        };
      }

      // Fallback to multipart/form-data upload to /v1/images/edits
      const imageBlob = dataUrlToBlob(selfieDataUrl);
      const formData = new FormData();
      formData.append('model', model);
      formData.append('prompt', prompt);
      formData.append('image', imageBlob, 'selfie.png');
      formData.append('size', '1024x1024');
      formData.append('quality', 'high');
      formData.append('complexity', 'high');

      const formEditRes = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (formEditRes.ok) {
        const data = await formEditRes.json();
        return {
          imageUrl: extractImageFromResponse(data),
        };
      }
    } catch (editErr) {
      console.warn('Edit endpoint fallback:', editErr);
    }
  }

  // 2. Direct generation via POST /v1/images/generations
  const genRes = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'high',
      complexity: 'high',
      output_format: 'png',
    }),
  });

  if (!genRes.ok) {
    throw new Error('Could not generate your concert avatar right now. Please try again.');
  }

  const genData = await genRes.json();
  return {
    imageUrl: extractImageFromResponse(genData),
  };
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
