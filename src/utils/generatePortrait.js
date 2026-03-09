async function resizeImageToBase64(dataUrl, maxPx = 1024, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(maxPx / img.width, maxPx / img.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export async function generateWizardingPortrait(userPhotoBase64, character) {
  try {
    const resized = await resizeImageToBase64(userPhotoBase64);

    const res = await fetch('/api/generate-portrait', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoBase64: resized, character }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error('[portrait] API error:', res.status, data?.error);
      return null;
    }

    return data?.url || null;

  } catch (err) {
    console.error('[portrait] failed:', err?.message);
    return null;
  }
}
