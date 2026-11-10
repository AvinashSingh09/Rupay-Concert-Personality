const DEFAULT_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dmine8ovl';
const DEFAULT_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'RupayConcertPersonality';
const DEFAULT_FOLDER =
  import.meta.env.VITE_CLOUDINARY_FOLDER || 'RupayConcertPersonality';

/**
 * Uploads a Data URL or Blob image to Cloudinary using an unsigned Upload Preset.
 *
 * @param {string} imageDataUrl - Base64 Data URL of the branded concert avatar
 * @returns {Promise<{ secureUrl: string, publicId: string }>}
 */
export async function uploadAvatarToCloudinary(imageDataUrl) {
  const cloudName = DEFAULT_CLOUD_NAME.trim();
  const uploadPreset = DEFAULT_UPLOAD_PRESET.trim();
  const folder = DEFAULT_FOLDER.trim();

  if (!cloudName || !uploadPreset) {
    throw new Error('CLOUDINARY_NOT_CONFIGURED');
  }

  const formData = new FormData();
  formData.append('file', imageDataUrl);
  formData.append('upload_preset', uploadPreset);
  if (folder) {
    formData.append('folder', folder);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(
      errData?.error?.message || `Cloudinary upload failed (HTTP ${response.status}).`
    );
  }

  const data = await response.json();
  return {
    secureUrl: data.secure_url,
    publicId: data.public_id,
  };
}

/**
 * Triggers a direct file download of a remote Cloudinary (or local data) image URL.
 *
 * @param {string} imageUrl - The image URL to download
 * @param {string} filename - Desired download file name
 */
export async function downloadPhotoToDevice(imageUrl, filename = 'RuPay-Concert-Avatar.png') {
  try {
    const response = await fetch(imageUrl, { mode: 'cors' });
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
  } catch {
    // Fallback using Cloudinary's fl_attachment flag to force browser download
    const attachmentUrl = imageUrl.includes('/upload/')
      ? imageUrl.replace('/upload/', '/upload/fl_attachment/')
      : imageUrl;
    const link = document.createElement('a');
    link.href = attachmentUrl;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
