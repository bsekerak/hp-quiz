import OpenAI from 'openai';

const houseRobes = {
  Gryffindor: 'scarlet and gold Gryffindor school robes',
  Slytherin: 'emerald green and silver Slytherin school robes',
  Ravenclaw: 'navy blue and bronze Ravenclaw school robes',
  Hufflepuff: 'yellow and black Hufflepuff school robes',
};

const characterDetails = {
  'Harry Potter': 'round glasses, lightning bolt scar on forehead',
  'Hermione Granger': 'holding a large open book, wand in other hand',
  'Ron Weasley': 'friendly warm smile, chess piece in pocket',
  'Luna Lovegood': 'radish earrings, Spectrespecs pushed up on head',
  'Neville Longbottom': 'holding a small potted plant, kind gentle eyes',
  'Albus Dumbledore': 'long silver beard, half-moon spectacles, purple robes',
  'Severus Snape': 'black robes, arms crossed, intense dark eyes',
  'Draco Malfoy': 'slicked back blonde hair, Slytherin badge, smirking',
  'Ginny Weasley': 'wand raised, fierce determined expression',
  'Sirius Black': 'wild hair, leather jacket under robes, rebellious grin',
};

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
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    console.error('[portrait] VITE_OPENAI_API_KEY is not set');
    return null;
  }

  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  try {
    // Resize photo before sending to GPT-4o
    const resized = await resizeImageToBase64(userPhotoBase64);

    // Step 1: Describe appearance with GPT-4o Vision
    console.log('[portrait] Step 1: GPT-4o vision...');
    const visionRes = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: "Describe this person's physical appearance in 3 sentences. Be specific about: hair color/style/length, eye color, face shape, skin tone, approximate age, any facial hair, distinctive features. For use by a portrait illustrator.",
          },
          {
            type: 'image_url',
            image_url: { url: resized, detail: 'low' },
          },
        ],
      }],
      max_tokens: 200,
    });

    const appearance = visionRes.choices[0].message.content;
    console.log('[portrait] Appearance:', appearance);

    const robes = houseRobes[character.house] || 'dark wizard robes';
    const extras = characterDetails[character.name] || '';

    const prompt = `Stylized digital portrait in the artistic style of Harry Potter book cover illustrations by Mary GrandPré. Warm magical lighting, dark Hogwarts stone background.

Subject appearance: ${appearance}

Wearing: ${robes}
Character details: ${extras}

Style: painterly storybook illustration, semi-realistic, magical warm glow, NOT photographic. No text, no borders.`;

    // Step 2: Generate portrait with DALL-E 3, return base64 so it never expires
    console.log('[portrait] Step 2: DALL-E 3...');
    const imgRes = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'b64_json',
      n: 1,
    });

    const b64 = imgRes.data[0].b64_json;
    if (!b64) throw new Error('No image data returned');

    console.log('[portrait] Done.');
    return `data:image/png;base64,${b64}`;

  } catch (err) {
    console.error('[portrait] Failed:', err?.message);
    return null;
  }
}
