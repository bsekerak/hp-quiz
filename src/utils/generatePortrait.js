async function resizeImageToBase64(dataUrl, maxPx = 1024, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(maxPx / img.width, maxPx / img.height, 1);
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export async function generateWizardingPortrait(userPhotoBase64, character) {
  try {
    // Resize photo to ≤1024px JPEG — keeps body well under Vercel's 4.5MB limit
    const resized = await resizeImageToBase64(userPhotoBase64);
    console.log('[portrait] Resized photo size (chars):', resized.length);

    const res = await fetch('/api/generate-portrait', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoBase64: resized, character }),
    });

    console.log('[portrait] API response status:', res.status);

    const data = await res.json().catch(() => null);
    console.log('[portrait] API response data:', data);

    if (!res.ok) {
      console.error('[portrait] API error:', res.status, data?.error);
      return null;
    }

    return data?.url || null;

  } catch (err) {
    console.error('[portrait] fetch failed:', err?.message);
    return null;
  }
}
