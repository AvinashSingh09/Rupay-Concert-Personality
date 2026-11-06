const STRICT_FACE_LOCK_AND_PRESENCE = `STRICT 1:1 FACIAL IDENTITY LOCK (HIGHEST PRIORITY):
The person in the generated image MUST be the exact same individual from the input photo with 95%+ facial likeness.
- Strictly preserve their exact facial bone structure, eye shape, eye spacing, eyebrows, nose bridge and tip, mouth/lip shape, jawline, cheekbones, exact skin tone, hairline, hairstyle, facial hair/beard (if present), and eyeglasses (if present).
- Do NOT replace their face with a generic lookalike, do NOT alter their ethnicity or age, and do NOT drastically rotate their head away from the camera, as that degrades facial likeness.
- Keep their real facial geometry intact while applying only a subtle, natural expression adjustment (softly Engaged eyes and a natural, believable smile/expression using their own exact mouth and facial features) so they look genuinely alive and in the moment.
- To make them look truly present at the concert rather than pasted in: seamlessly integrate their neck, shoulders, and body posture into the scene, and relight their actual face and hair with realistic ambient concert lighting (soft cyan-blue and warm magenta-orange stage rim light, matching contrast and natural depth of field).`;

export const PERSONALITIES = [
  {
    id: 'fashionista',
    name: 'FASHIONISTA',
    subtitle: 'The Glamorous • The Style Icon',
    prompt: `${STRICT_FACE_LOCK_AND_PRESENCE}
Concert Scene (FASHIONISTA): Place this exact person in the VIP crowd of a massive night music concert. Keep their exact face and recognizable features clearly facing the camera with a natural, confident, effortless smile. Dress them in a glamorous metallic sequin festival jacket and statement concert accessories. Behind them is an electric night concert crowd illuminated by dramatic cyan-blue and fiery orange-magenta laser beams and glowing LED stage screens. Photorealistic concert photography, 1:1 facial identity preservation.`,
  },
  {
    id: 'clicker',
    name: 'PICTURE / VIDEO CLICKER',
    subtitle: 'The Reel Machine • The Memory Maker',
    prompt: `${STRICT_FACE_LOCK_AND_PRESENCE}
Concert Scene (PICTURE / VIDEO CLICKER): Place this exact person in the middle of a packed live music concert at night. Keep their exact face and recognizable features clearly visible facing the camera with a genuine, happy, excited grin while they hold up a smartphone recording the concert moment. Dress them in a stylish festival jacket with colorful concert wristbands. Behind them is a cheering festival crowd with dramatic cyan-blue and red-orange laser beams cutting through concert haze. Photorealistic concert photography, 1:1 facial identity preservation.`,
  },
  {
    id: 'unbothered',
    name: 'THE UNBOTHERED GUEST',
    subtitle: 'The Wrong-Place Legend •\nThe Reluctant Rockstar',
    prompt: `${STRICT_FACE_LOCK_AND_PRESENCE}
Concert Scene (THE UNBOTHERED GUEST): Place this exact person in the middle of an ultra-hyped, wild night music festival crowd. Keep their exact face and recognizable features clearly visible facing the camera with a cool, relaxed, subtly amused unbothered expression while casually holding an iced drink with headphones resting around their neck. Around them, the concert crowd has hands in the air cheering under intense cyan-blue and fiery orange-magenta stage lasers. Photorealistic concert photography, 1:1 facial identity preservation.`,
  },
  {
    id: 'dancer',
    name: 'DANCER',
    subtitle: 'The Dance Icon • The Beat Breaker',
    prompt: `${STRICT_FACE_LOCK_AND_PRESENCE}
Concert Scene (DANCER): Place this exact person in the heart of a massive night music festival. Keep their exact face and recognizable features clearly visible facing the camera with a warm, radiant, joyful smile as their upper body and arms are posed in a natural, energetic concert dance groove. Dress them in stylish reflective festival streetwear with glowing wristbands while cyan-blue and vibrant orange-pink laser beams shine from the smoky concert stage behind them. Photorealistic concert photography, 1:1 facial identity preservation.`,
  },
  {
    id: 'foodie',
    name: 'FOODIE',
    subtitle: 'The Food Fanatic • The Snack Attack',
    prompt: `${STRICT_FACE_LOCK_AND_PRESENCE}
Concert Scene (FOODIE): Place this exact person in the middle of a lively night music concert crowd. Keep their exact face and recognizable features clearly visible facing the camera with a warm, happy, natural smile while holding up a delicious cheesy slice of pizza in one hand and an open pizza box in the other hand, wearing a sparkly festival jacket and concert wristbands. Behind them is a cheering concert crowd lit by dramatic cyan-blue and warm orange-red stage laser beams and atmospheric stage smoke. Photorealistic concert photography, 1:1 facial identity preservation.`,
  },
  {
    id: 'lyric-legend',
    name: 'THE LYRIC LEGEND',
    subtitle: 'The Walking Jukebox • The Lyrics Pro',
    prompt: `${STRICT_FACE_LOCK_AND_PRESENCE}
Concert Scene (THE LYRIC LEGEND): Place this exact person in the front row of a massive night music festival. Keep their exact face and recognizable features clearly visible facing the camera with an expressive, joyful, smiling singing expression—without distorting their facial structure—with one hand raised in the air and the other holding a glowing festival mic/lightstick. Dress them in a rock-inspired festival jacket and wristbands, surrounded by cheering fans with glowing cyan-blue and magenta-orange stage laser beams behind them. Photorealistic concert photography, 1:1 facial identity preservation.`,
  },
];
