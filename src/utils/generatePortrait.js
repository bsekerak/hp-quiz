import OpenAI from 'openai';

const houseRobes = {
  Gryffindor: 'scarlet and gold Gryffindor school robes',
  Slytherin: 'emerald green and silver Slytherin school robes',
  Ravenclaw: 'navy blue and bronze Ravenclaw school robes',
  Hufflepuff: 'yellow and black Hufflepuff school robes'
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
  'Sirius Black': 'wild hair, leather jacket under robes, rebellious grin'
};

export async function generateWizardingPortrait(userPhotoBase64, character) {
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  try {
    console.log('Step 1: Analyzing photo with GPT-4o Vision...');

    const visionRes = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Describe this person\'s physical appearance in 3 sentences. Be specific about: hair color/style/length, eye color, face shape, skin tone, approximate age, any facial hair, distinctive features. For use by a portrait illustrator.'
          },
          {
            type: 'image_url',
            image_url: { url: userPhotoBase64, detail: 'high' }
          }
        ]
      }],
      max_tokens: 200
    });

    const appearance = visionRes.choices[0].message.content;
    console.log('Appearance:', appearance);

    const robes = houseRobes[character.house] || 'dark wizard robes';
    const extras = characterDetails[character.name] || '';

    const prompt = `Stylized digital portrait in the artistic style of Harry Potter book cover illustrations by Mary GrandPré. Warm magical lighting, dark Hogwarts stone background.

Subject appearance: ${appearance}

Wearing: ${robes}
Character details: ${extras}

Style: painterly storybook illustration, semi-realistic, magical warm glow, NOT photographic. No text, no borders.`;

    console.log('Step 2: Generating DALL-E portrait...');

    const imgRes = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: '1024x1024',
      quality: 'standard',
      n: 1
    });

    const url = imgRes.data[0].url;
    console.log('Portrait URL:', url);
    return url;

  } catch (err) {
    console.error('Portrait failed:', err?.message);
    return null;
  }
}
