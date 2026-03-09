import OpenAI from 'openai';

export const maxDuration = 60;

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { photoBase64, character } = req.body;

  if (!photoBase64 || !character) {
    return res.status(400).json({ error: 'Missing photoBase64 or character' });
  }

  const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  const openai = new OpenAI({ apiKey });

  try {
    // Step 1: Describe appearance with GPT-4o Vision
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
            image_url: { url: photoBase64, detail: 'high' },
          },
        ],
      }],
      max_tokens: 200,
    });

    const appearance = visionRes.choices[0].message.content;
    console.log('[generate-portrait] Appearance:', appearance);

    const robes = houseRobes[character.house] || 'dark wizard robes';
    const extras = characterDetails[character.name] || '';

    const prompt = `Stylized digital portrait in the artistic style of Harry Potter book cover illustrations by Mary GrandPré. Warm magical lighting, dark Hogwarts stone background.

Subject appearance: ${appearance}

Wearing: ${robes}
Character details: ${extras}

Style: painterly storybook illustration, semi-realistic, magical warm glow, NOT photographic. No text, no borders.`;

    // Step 2: Generate portrait with DALL-E 3, return base64 so it never expires
    const imgRes = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'b64_json',
      n: 1,
    });

    const b64 = imgRes.data[0].b64_json;
    if (!b64) throw new Error('No image data returned from OpenAI');

    const url = `data:image/png;base64,${b64}`;
    return res.status(200).json({ url });

  } catch (err) {
    console.error('[generate-portrait] error:', err?.message);
    return res.status(500).json({ error: err?.message || 'Portrait generation failed' });
  }
}
