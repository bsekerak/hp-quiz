export async function generateWizardingPortrait(userPhotoBase64, character) {
  try {
    const res = await fetch('/api/generate-portrait', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoBase64: userPhotoBase64, character }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Portrait API error:', err.error);
      return null;
    }

    const { url } = await res.json();
    return url || null;

  } catch (err) {
    console.error('Portrait failed:', err?.message);
    return null;
  }
}
