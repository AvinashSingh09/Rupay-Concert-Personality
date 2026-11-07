const PRESERVE_SELFIE = `Edit the supplied selfie into a photorealistic concert portrait. Use the photographed person as the foreground subject. Preserve their facial structure, eye spacing, nose and lip shape, skin tone and texture, distinctive marks, hair, facial hair, and glasses. Keep the original head angle, gaze, and face placement. Change the expression with small, natural movements around the eyes, cheeks, and mouth while keeping the features recognizable.
Put the concert lighting on the background and outfit. Keep the guest's face sharp, evenly lit, and clear of props.`;

export const PERSONALITIES = [
  {
    id: 'fashionista',
    name: 'FASHIONISTA',
    subtitle: 'The Glamorous • The Style Icon',
    prompt: `${PRESERVE_SELFIE}
Fashionista scene: A VIP concert crowd with cyan and orange lasers and glowing LED screens. Give the guest a relaxed, confident smile. Style them in a metallic sequin jacket and statement accessories below the face.`,
  },
  {
    id: 'clicker',
    name: 'PICTURE / VIDEO CLICKER',
    subtitle: 'The Reel Machine • The Memory Maker',
    prompt: `${PRESERVE_SELFIE}
Picture / video clicker scene: A packed night concert with cyan and red-orange lasers cutting through haze. Give the guest an excited grin, as if they just caught their favorite moment. Add a festival jacket, colorful wristbands, and a smartphone held at chest height to record the show.`,
  },
  {
    id: 'unbothered',
    name: 'THE UNBOTHERED GUEST',
    subtitle: 'The Wrong-Place Legend •\nThe Reluctant Rockstar',
    prompt: `${PRESERVE_SELFIE}
Unbothered guest scene: A lively festival crowd cheering under cyan and magenta stage lasers. Give the guest a faint, amused smile and relaxed eyes. Add an iced drink and headphones resting around their neck.`,
  },
  {
    id: 'dancer',
    name: 'DANCER',
    subtitle: 'The Dance Icon • The Beat Breaker',
    prompt: `${PRESERVE_SELFIE}
Dancer scene: A smoky night festival stage with cyan and orange-pink laser beams. Give the guest a joyful, spontaneous smile. Style them in reflective streetwear and glowing wristbands, with their arms in a dance gesture below the face.`,
  },
  {
    id: 'foodie',
    name: 'FOODIE',
    subtitle: 'The Food Fanatic • The Snack Attack',
    prompt: `${PRESERVE_SELFIE}
Foodie scene: A cheering concert crowd with cyan and warm orange lasers. Give the guest a warm, delighted smile. Style them in a sparkly festival jacket and wristbands, holding a slice of pizza and an open pizza box below their face.`,
  },
  {
    id: 'lyric-legend',
    name: 'THE LYRIC LEGEND',
    subtitle: 'The Walking Jukebox • The Lyrics Pro',
    prompt: `${PRESERVE_SELFIE}
Lyric legend scene: The front row of a music festival surrounded by cheering fans and cyan and magenta lasers. Give the guest an animated sing-along expression with their mouth slightly open mid-lyric. Style them in a rock-inspired jacket and wristbands, holding a glowing concert lightstick to the side.`,
  },
];
