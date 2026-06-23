const Room = require("../models/Room");
const User = require("../models/User");

// Image + answer pairs for Kids mode (visual recognition quiz)
const KIDS_QUIZ_BANK = {
  common: [
    { image: "/kids-quiz/Cat-head.jpg", answer: "cat" },
    { image: "/kids-quiz/Dog-head.jpg", answer: "dog" },
    { image: "/kids-quiz/horse-head.jpg", answer: "horse" },
    { image: "/kids-quiz/cow-head.jpg", answer: "cow" },
    { image: "/kids-quiz/Chicken-head.jpg", answer: "chicken" },
    { image: "/kids-quiz/donkey-head.jpg", answer: "donkey" },
    { image: "/kids-quiz/giraffe-head.jpg", answer: "giraffe" },
  ],
  mixed: [
    { image: "/kids-quiz/Cat-head.jpg", answer: "cat" },
    { image: "/kids-quiz/Dog-head.jpg", answer: "dog" },
    { image: "/kids-quiz/horse-head.jpg", answer: "horse" },
    { image: "/kids-quiz/cow-head.jpg", answer: "cow" },
    { image: "/kids-quiz/Chicken-head.jpg", answer: "chicken" },
    { image: "/kids-quiz/donkey-head.jpg", answer: "donkey" },
    { image: "/kids-quiz/giraffe-head.jpg", answer: "giraffe" },
    { image: "/kids-quiz/Lamma-head.jpg", answer: "llama" },
    { image: "/kids-quiz/Ostrich-head.jpg", answer: "ostrich" },
    { image: "/kids-quiz/peacock-head.jpg", answer: "peacock" },
    { image: "/kids-quiz/racoon-head.jpg", answer: "raccoon" },
    { image: "/kids-quiz/snake-head.jpg", answer: "snake" },
    { image: "/kids-quiz/turtle-head.jpg", answer: "turtle" },
    { image: "/kids-quiz/Koala.jpg", answer: "koala" },
    { image: "/kids-quiz/kangaroo.jpg", answer: "kangaroo" },
    { image: "/kids-quiz/panda.jpg", answer: "panda" },
    { image: "/kids-quiz/penguin.jpg", answer: "penguin" },
    { image: "/kids-quiz/seal.jpg", answer: "seal" },
  ],
  expert: [
    { image: "/kids-quiz/crocodile-legs.jpg", answer: "crocodile" },
    { image: "/kids-quiz/zebra-legs.jpg", answer: "zebra" },
    { image: "/kids-quiz/giraffe-legs.jpg", answer: "giraffe" },
    { image: "/kids-quiz/Clownfish.jpg", answer: "clownfish" },
    { image: "/kids-quiz/axolotl.jpg", answer: "axolotl" },
    { image: "/kids-quiz/chameleon.jpg", answer: "chameleon" },
    { image: "/kids-quiz/cheetah.jpg", answer: "cheetah" },
    { image: "/kids-quiz/meerkat.jpg", answer: "meerkat" },
    { image: "/kids-quiz/okapi.jpg", answer: "okapi" },
    { image: "/kids-quiz/platypus.jpg", answer: "platypus" },
    { image: "/kids-quiz/porcupine.jpg", answer: "porcupine" },
    { image: "/kids-quiz/red-panda.jpg", answer: "red panda" },
  ]
};

// Lyric-snippet + multiple-choice pairs for Music Quiz mode
const MUSIC_BANK = [
  // --- Bollywood ---
  {
    clue: "\"Re kabira maan jaa, aaja tujhko pukaarein teri parchhaaiyaan...\"",
    answer: "Kabira",
    artist: "Tochi Raina, Rekha Bhardwaj",
    fakeOptions: ["Tere Liye", "Teri Deewani", "Aankhon Mein Teri"],
    audio: "/music-quiz/audio/kabira.mp3",
    cover: "/music-quiz/covers/kabira.png",
    genre: "bollywood",
    revealDuration: 20
  },
  {
    clue: "\"Tere liye khud ko badal de, tere liye kuch bhi kar de...\"",
    answer: "Tere Liye",
    artist: "Atif Aslam, Shreya Ghoshal",
    fakeOptions: ["Jo Tu Na Mila", "Bin Tere", "Kabira"],
    audio: "/music-quiz/audio/tere-liye.mp3",
    cover: "/music-quiz/covers/tere-liye.png",
    genre: "bollywood",
    revealDuration: 20
  },
  {
    clue: "\"Tera rastaa chhodoon na, tera rastaa chhodoon na...\"",
    answer: "Tera Rastaa Chhodoon Na",
    artist: "Amitabh Bhattacharya",
    fakeOptions: ["Pehli Baar", "Rakhlo Tum Chupake", "Mere Nishan"],
    audio: "/music-quiz/audio/tera-rastaa-chhodoon-na.mp3",
    cover: "/music-quiz/covers/tera-rastaa-chhodo.png",
    genre: "bollywood",
    revealDuration: 20
  },
  {
    clue: "\"Ishq ke rang mein rang jaayein, teri deewani, teri deewani...\"",
    answer: "Teri Deewani",
    artist: "Kailash Kher",
    fakeOptions: ["Mere Nishan", "Bin Tere", "Woh Lamhe Woh Baatein"],
    audio: "/music-quiz/audio/teri-deewani.mp3",
    cover: "/music-quiz/covers/teri-deewani.png",
    genre: "bollywood",
    revealDuration: 20
  },
  {
    clue: "\"Pehli baar tumko maine dekha, toh kuch aise hua...\"",
    answer: "Pehli Baar",
    artist: "Sunidhi Chauhan",
    fakeOptions: ["Aankhon Mein Teri", "Jo Tu Na Mila", "Tere Liye"],
    audio: "/music-quiz/audio/pehli-baar.mp3",
    cover: "/music-quiz/covers/pehli-baar.jpg",
    genre: "bollywood",
    revealDuration: 20
  },
  {
    clue: "\"Jo tu na mila toh hum mar jaayenge, kisi aur ke ho na paayenge...\"",
    answer: "Jo Tu Na Mila",
    artist: "Asim Azhar",
    fakeOptions: ["Bin Tere", "Woh Lamhe Woh Baatein", "Kabira"],
    audio: "/music-quiz/audio/jo-tu-na-mila.mp3",
    cover: "/music-quiz/covers/jo-tu-na-mila.jpg",
    genre: "bollywood",
    revealDuration: 20
  },
  {
    clue: "\"Tujhe kitna chahne lage hum, tere saath hi guzar jaayein...\"",
    answer: "Tujhe Kitna Chahne Lage",
    artist: "Arijit Singh",
    fakeOptions: ["Tere Liye", "Teri Deewani", "Aankhon Mein Teri"],
    audio: "/music-quiz/audio/tujhe-kitna-chahne-lage.mp3",
    cover: "/music-quiz/covers/tujhe-kitna-chahne-lage.jpg",
    genre: "bollywood",
    revealDuration: 20
  },
  {
    clue: "\"Rakhlo tum chupake mujhe, apne dil ke aashiyane mein...\"",
    answer: "Rakhlo Tum Chupake",
    artist: "Amit Trivedi",
    fakeOptions: ["Tera Rastaa Chhodoon Na", "Bin Tere", "Mere Nishan"],
    audio: "/music-quiz/audio/rakhlo-tum-chupake.mp3",
    cover: "/music-quiz/covers/rakhlo-tum-chupake.png",
    genre: "bollywood",
    revealDuration: 20
  },
  {
    clue: "\"Mere nishan mit chuke hain, tere dil ke dharatal se...\"",
    answer: "Mere Nishan",
    artist: "Kailash Kher",
    fakeOptions: ["Teri Deewani", "Woh Lamhe Woh Baatein", "Tere Liye"],
    audio: "/music-quiz/audio/mere-nishan.mp3",
    cover: "/music-quiz/covers/mere-nishan.jpg",
    genre: "bollywood",
    revealDuration: 20
  },
  {
    clue: "\"Bin tere kya yaar mera, bin tere kya guzaara...\"",
    answer: "Bin Tere",
    artist: "Shafqat Amanat Ali",
    fakeOptions: ["Jo Tu Na Mila", "Aankhon Mein Teri", "Rakhlo Tum Chupake"],
    audio: "/music-quiz/audio/bin-tere.mp3",
    cover: "/music-quiz/covers/bin-tere.png",
    genre: "bollywood",
    revealDuration: 20
  },
  {
    clue: "\"Aankhon mein teri ajab si ajab si adayein hain...\"",
    answer: "Aankhon Mein Teri",
    artist: "KK",
    fakeOptions: ["Bin Tere", "Woh Lamhe Woh Baatein", "Pehli Baar"],
    audio: "/music-quiz/audio/aankhon-mein-teri-ajab-si.mp3",
    cover: "/music-quiz/covers/aankhon-mein-teri-ajab-si.png",
    genre: "bollywood",
    revealDuration: 20
  },
  {
    clue: "\"Woh lamhe woh baatein koi na jaane, kaise din raat beete...\"",
    answer: "Woh Lamhe Woh Baatein",
    artist: "Atif Aslam",
    fakeOptions: ["Mere Nishan", "Teri Deewani", "Kabira"],
    audio: "/music-quiz/audio/woh-lamhe-woh-baatein-.mp3",
    cover: "/music-quiz/covers/woh-lamhe-woh-baatein-.png",
    genre: "bollywood",
    revealDuration: 20
  },
  {
    clue: "\"...meri jaan keh rahi, gaata hoon main yahaan, tu sun rahi...\"",
    answer: "Aaoge Tum Kabhi",
    artist: "The Local Train",
    fakeOptions: ["Kabira", "Aankhon Mein Teri", "Bin Tere"],
    audio: "/music-quiz/audio/aaoge-tum-kabhi.mp3",
    cover: "/music-quiz/covers/aaoge-tum-kabi.jpg",
    genre: "bollywood",
    revealDuration: 15
  },

  // --- Rock ---
  {
    clue: "\"Ah-ah-ah-ah, we come from the land of the ice and snow...\"",
    answer: "Immigrant Song",
    artist: "Led Zeppelin",
    fakeOptions: ["Stairway To Heaven", "November Rain", "Iris"],
    audio: "/music-quiz/audio/immigrant.mp3",
    cover: "/music-quiz/covers/immigrant.jpg",
    genre: "rock",
    revealDuration: 20
  },
  {
    clue: "\"There's a lady who's sure all that glitters is gold...\"",
    answer: "Stairway To Heaven",
    artist: "Led Zeppelin",
    fakeOptions: ["Immigrant Song", "November Rain", "The Great Gig In The Sky"],
    audio: "/music-quiz/audio/stairway-to-heaven.mp3",
    cover: "/music-quiz/covers/stairway-to-heaven.png",
    genre: "rock",
    revealDuration: 20
  },
  {
    clue: "\"Nothing lasts forever, even cold November rain...\"",
    answer: "November Rain",
    artist: "Guns N' Roses",
    fakeOptions: ["Stairway To Heaven", "The Great Gig In The Sky", "Hard To Explain"],
    audio: "/music-quiz/audio/november-rain.mp3",
    cover: "/music-quiz/covers/november-rain.jpg",
    genre: "rock",
    revealDuration: 20
  },
  {
    clue: "\"And I am not frightened of dying, any time will do...\"",
    answer: "The Great Gig In The Sky",
    artist: "Pink Floyd",
    fakeOptions: ["November Rain", "The Night We Met", "Hard To Explain"],
    audio: "/music-quiz/audio/great-gig-in-the-sky.mp3",
    cover: "/music-quiz/covers/great-gig-in-the-sky.png",
    genre: "rock",
    revealDuration: 20
  },
  {
    clue: "\"And I don't want the world to see me, 'cause I don't think they'd understand...\"",
    answer: "Iris",
    artist: "Goo Goo Dolls",
    fakeOptions: ["The Night We Met", "Hard To Explain", "Sweater Weather"],
    audio: "/music-quiz/audio/iris.mp3",
    cover: "/music-quiz/covers/iris.jpg",
    genre: "rock",
    revealDuration: 20
  },
  {
    clue: "\"I don't know what I'm supposed to do, haunted by the ghost of you...\"",
    answer: "The Night We Met",
    artist: "Lord Huron",
    fakeOptions: ["Iris", "Keep On Loving You", "The Scientist"],
    audio: "/music-quiz/audio/the-night-we-met.mp3",
    cover: "/music-quiz/covers/the-night-we-met.jpg",
    genre: "rock",
    revealDuration: 20
  },
  {
    clue: "\"Was an honest man, asked me for the phone, tried to take control...\"",
    answer: "Hard To Explain",
    artist: "The Strokes",
    fakeOptions: ["505", "No Surprises", "The Night We Met"],
    audio: "/music-quiz/audio/hard-to-explain.mp3",
    cover: "/music-quiz/covers/hard-to-explain.png",
    genre: "rock",
    revealDuration: 20
  },
  {
    clue: "\"I don't wanna sleep, I just wanna keep on loving you...\"",
    answer: "Keep On Loving You",
    artist: "Cigarettes After Sex",
    fakeOptions: ["505", "No Surprises", "Sweater Weather"],
    audio: "/music-quiz/audio/keep-on-loving-you.mp3",
    cover: "/music-quiz/covers/keep-on-loving-you.jpg",
    genre: "rock",
    revealDuration: 15
  },
  {
    clue: "\"I'm going back to 505, if it's a seven hour flight...\"",
    answer: "505",
    artist: "Arctic Monkeys",
    fakeOptions: ["Keep On Loving You", "No Surprises", "Hard To Explain"],
    audio: "/music-quiz/audio/505.mp3",
    cover: "/music-quiz/covers/505.jpg",
    genre: "rock",
    revealDuration: 15
  },
  {
    clue: "\"A heart that's full up like a landfill, a job that slowly kills you...\"",
    answer: "No Surprises",
    artist: "Radiohead",
    fakeOptions: ["The Scientist", "Sweater Weather", "505"],
    audio: "/music-quiz/audio/no-surprises.mp3",
    cover: "/music-quiz/covers/no-suprises.jpg",
    genre: "rock",
    revealDuration: 15
  },
  {
    clue: "\"Come up to meet you, tell you I'm sorry, you don't know how lovely you are...\"",
    answer: "The Scientist",
    artist: "Coldplay",
    fakeOptions: ["No Surprises", "Sweater Weather", "The Night We Met"],
    audio: "/music-quiz/audio/the-scientist.mp3",
    cover: "/music-quiz/covers/the-scientist.png",
    genre: "rock",
    revealDuration: 20
  },
  {
    clue: "\"Cause it's too cold for you here and now, so let me hold both your hands...\"",
    answer: "Sweater Weather",
    artist: "The Neighbourhood",
    fakeOptions: ["Keep On Loving You", "The Scientist", "Iris"],
    audio: "/music-quiz/audio/sweater-weather.mp3",
    cover: "/music-quiz/covers/sweater-weather.jpg",
    genre: "rock",
    revealDuration: 15
  },

  // --- Pop ---
  {
    clue: "\"In this world, it's just us, you know it's not the same as it was...\"",
    answer: "As It Was",
    artist: "Harry Styles",
    fakeOptions: ["Here With Me", "I Love You So", "Blinding Lights"],
    audio: "/music-quiz/audio/as-it-was.mp3",
    cover: "/music-quiz/covers/as-it-was.png",
    genre: "pop",
    revealDuration: 20
  },
  {
    clue: "\"I follow you, deep sea baby, I follow you...\"",
    answer: "Here With Me",
    artist: "d4vd",
    fakeOptions: ["As It Was", "I Love You So", "Be More"],
    audio: "/music-quiz/audio/here-with-me.mp3",
    cover: "/music-quiz/covers/here-with-me.png",
    genre: "pop",
    revealDuration: 20
  },
  {
    clue: "\"I'm madly in love with you, and you're madly in love with me...\"",
    answer: "I Love You So",
    artist: "The Walters",
    fakeOptions: ["Here With Me", "Beat It", "Glimpse Of Us"],
    audio: "/music-quiz/audio/i-love-you-so.mp3",
    cover: "/music-quiz/covers/i-love-you-so.jpg",
    genre: "pop",
    revealDuration: 20
  },
  {
    clue: "\"They're out to get you, there's demons closing in on every side...\"",
    answer: "Beat It",
    artist: "Michael Jackson",
    fakeOptions: ["Smooth Operator", "From The Start", "Blinding Lights"],
    audio: "/music-quiz/audio/beat-it.mp3",
    cover: "/music-quiz/covers/beat-it.jpg",
    genre: "pop",
    revealDuration: 15
  },
  {
    clue: "\"Diamond life, lover boy, we move in space with minimum waste...\"",
    answer: "Smooth Operator",
    artist: "Sade",
    fakeOptions: ["Beat It", "From The Start", "Escapism"],
    audio: "/music-quiz/audio/smooth-operator.mp3",
    cover: "/music-quiz/covers/smooth-operator.jpg",
    genre: "pop",
    revealDuration: 15
  },
  {
    clue: "\"But when you look at me, the only memory, is us holding hands...\"",
    answer: "From The Start",
    artist: "Laufey",
    fakeOptions: ["Escapism", "Be More", "Glimpse Of Us"],
    audio: "/music-quiz/audio/from-the-start.mp3",
    cover: "/music-quiz/covers/from-the-start.jpg",
    genre: "pop",
    revealDuration: 15
  },
  {
    clue: "\"I don't wanna feel how my heart is rippin', in fact, I don't wanna feel...\"",
    answer: "Escapism",
    artist: "RAYE",
    fakeOptions: ["From The Start", "Be More", "Smooth Operator"],
    audio: "/music-quiz/audio/escapism.mp3",
    cover: "/music-quiz/covers/escapism.jpg",
    genre: "pop",
    revealDuration: 15
  },
  {
    clue: "\"I could be more, I could be more, more than what you bargained for...\"",
    answer: "Be More",
    artist: "Stephen Sanchez",
    fakeOptions: ["From The Start", "Escapism", "Glimpse Of Us"],
    audio: "/music-quiz/audio/be-more.mp3",
    cover: "/music-quiz/covers/be-more.jpg",
    genre: "pop",
    revealDuration: 15
  },
  {
    clue: "\"Cause sometimes I look in her eyes, and that's where I find a glimpse of us...\"",
    answer: "Glimpse Of Us",
    artist: "Joji",
    fakeOptions: ["I Love You So", "Be More", "Blinding Lights"],
    audio: "/music-quiz/audio/glimpse-of-us.mp3",
    cover: "/music-quiz/covers/glimpse-of-us.jpg",
    genre: "pop",
    revealDuration: 15
  },
  {
    clue: "\"I said, ooh, I'm blinded by the lights, no, I can't sleep...\"",
    answer: "Blinding Lights",
    artist: "The Weeknd",
    fakeOptions: ["As It Was", "Beat It", "Glimpse Of Us"],
    audio: "/music-quiz/audio/blinding-lights.mp3",
    cover: "/music-quiz/covers/blinding-lights.jpg",
    genre: "pop",
    revealDuration: 15
  }
];

// Questions for Couples mode — "Guess My Answer" (multi-select with partial credit)
const COUPLES_BANK = [
  // 💛 Sweet / Emotional
  {
    genre: "sweet",
    question: "Which of these make you feel most loved? (pick all that apply)",
    options: ["Good morning texts", "Random hugs", "Cooking for you", "Listening when you vent"],
  },
  {
    genre: "sweet",
    question: "Which of these make you feel closest to me? (pick all that apply)",
    options: ["Late night talks", "Holding hands", "Doing nothing together", "Surprise gifts"],
  },
  {
    genre: "sweet",
    question: "Which of these would make your whole day better? (pick all that apply)",
    options: ["A handwritten note", "A long hug", "Your favorite snack waiting for you", "Just hearing 'I'm proud of you'"],
  },
  {
    genre: "sweet",
    question: "Which of these comfort you most when you're upset? (pick all that apply)",
    options: ["Being hugged in silence", "Talking it out", "Being distracted with something fun", "Being left alone for a bit"],
  },
  {
    genre: "sweet",
    question: "Which of these do you wish happened more often? (pick all that apply)",
    options: ["Date nights", "Compliments", "Physical affection", "Deep conversations"],
  },
  {
    genre: "sweet",
    question: "What is your favorite memory of us together? (pick all that apply)",
    options: ["Our first date", "A trip we took", "A random lazy day", "Celebrating a milestone"],
  },
  {
    genre: "sweet",
    question: "Which of these traits do you appreciate most in me? (pick all that apply)",
    options: ["Kindness", "Sense of humor", "Intelligence", "Patience"],
  },
  {
    genre: "sweet",
    question: "How do you prefer to spend quality time together? (pick all that apply)",
    options: ["Exploring new places", "Cooking together", "Quiet time at home", "Long deep talks"],
  },
  {
    genre: "sweet",
    question: "What small gesture makes you smile the most? (pick all that apply)",
    options: ["Making my coffee/tea", "Leaving a sweet note", "Holding my hand in public", "Bringing home a treat"],
  },
  {
    genre: "sweet",
    question: "Which of these do you think is our biggest strength as a couple? (pick all that apply)",
    options: ["Our communication", "We have so much fun", "Our trust in each other", "How we support each other"],
  },
  {
    genre: "sweet",
    question: "What is your favorite way to wake up on a weekend? (pick all that apply)",
    options: ["Sleeping in late", "Breakfast in bed", "Morning cuddles", "Waking up early to watch the sunrise"],
  },
  {
    genre: "sweet",
    question: "Which of these makes you feel most safe and secure? (pick all that apply)",
    options: ["Hearing 'I love you'", "Being held tightly", "Knowing we can talk about anything", "Planning our future together"],
  },

  // 🌶️ Spicy / Romantic
  {
    genre: "spicy",
    question: "Which of these would you want right now? (pick all that apply)",
    options: ["A slow dance", "A surprise kiss", "Cuddling on the couch", "A late night drive together"],
  },
  {
    genre: "spicy",
    question: "Which of these do you find most attractive? (pick all that apply)",
    options: ["Confidence", "A good sense of humor", "Physical touch", "How they look at you"],
  },
  {
    genre: "spicy",
    question: "Which of these would be your ideal romantic evening? (pick all that apply)",
    options: ["Candlelit dinner at home", "A spontaneous adventure", "A cozy movie night", "Dressing up and going out"],
  },
  {
    genre: "spicy",
    question: "Which of these gives you butterflies? (pick all that apply)",
    options: ["Forehead kisses", "Being called a cute nickname", "A lingering hug", "Being told you're missed"],
  },
  {
    genre: "spicy",
    question: "Which of these would you want to try together someday? (pick all that apply)",
    options: ["A couples dance class", "A weekend getaway", "Cooking a fancy meal together", "A photoshoot together"],
  },
  {
    genre: "spicy",
    question: "Where is the most romantic place you want to go together? (pick all that apply)",
    options: ["A secluded cabin", "A tropical beach resort", "A historic European city", "A luxury glamping site"],
  },
  {
    genre: "spicy",
    question: "What is the key to keeping the romance alive? (pick all that apply)",
    options: ["Spontaneous dates", "Physical intimacy", "Flirting throughout the day", "Trying new things together"],
  },
  {
    genre: "spicy",
    question: "Which of these is your favorite physical touch? (pick all that apply)",
    options: ["Playing with my hair", "A back rub/massage", "Holding hands", "Wrapping arms around the waist"],
  },
  {
    genre: "spicy",
    question: "What is the most attractive outfit I wear? (pick all that apply)",
    options: ["Formal dress/suit", "Cozy loungewear", "Athletic wear", "Something stylish & casual"],
  },
  {
    genre: "spicy",
    question: "Which setting sounds most romantic for a date? (pick all that apply)",
    options: ["Under a starry sky", "A warm bath with music", "A sunset picnic", "A private rooftop bar"],
  },
  {
    genre: "spicy",
    question: "What kind of flirting makes you blush the most? (pick all that apply)",
    options: ["Winking/eye contact from across a room", "Whispering in my ear", "A tease text message", "An unexpected gentle touch"],
  },
  {
    genre: "spicy",
    question: "What's a romantic milestone you are looking forward to? (pick all that apply)",
    options: ["A dream vacation together", "Moving in/getting a home", "An anniversary celebration", "Adopting a pet together"],
  },

  // 💬 Harsh-but-real
  {
    genre: "harsh",
    question: "Which of these honestly annoy you sometimes? (pick all that apply)",
    options: ["How I handle stress", "My texting habits", "My time management", "How I argue"],
  },
  {
    genre: "harsh",
    question: "Which of these do you wish I did less? (pick all that apply)",
    options: ["Cancelling plans", "Being on my phone", "Overthinking things", "Avoiding tough conversations"],
  },
  {
    genre: "harsh",
    question: "Which of these have caused arguments between us before? (pick all that apply)",
    options: ["Miscommunication", "Not enough quality time", "Different love languages", "Stress from outside life"],
  },
  {
    genre: "harsh",
    question: "Which of these do you think I could improve on? (pick all that apply)",
    options: ["Listening without interrupting", "Showing appreciation more", "Being more patient", "Following through on plans"],
  },
  {
    genre: "harsh",
    question: "Which of these worry you sometimes about us? (pick all that apply)",
    options: ["Distance", "Busy schedules", "Not enough communication", "Taking each other for granted"],
  },
  {
    genre: "harsh",
    question: "What is the hardest topic for us to talk about? (pick all that apply)",
    options: ["Future plans", "Money/finances", "Past relationships", "Our annoying habits"],
  },
  {
    genre: "harsh",
    question: "What's your typical reaction during a disagreement? (pick all that apply)",
    options: ["Shutting down/quietness", "Trying to resolve it immediately", "Getting emotional", "Needing space to cool off"],
  },
  {
    genre: "harsh",
    question: "Where do we sometimes struggle with compatibility? (pick all that apply)",
    options: ["Socializing vs staying home", "Cleanliness habits", "Handling stress", "How we spend money"],
  },
  {
    genre: "harsh",
    question: "Which of these habits do I have that test your patience? (pick all that apply)",
    options: ["Being indecisive", "Interrupting", "Losing things", "Procrastinating"],
  },
  {
    genre: "harsh",
    question: "What is the main thing we need to work on as a pair? (pick all that apply)",
    options: ["Being more active together", "Better listening skills", "Giving each other more space", "Expressing appreciation more"],
  },
  {
    genre: "harsh",
    question: "When we are busy, what gets neglected first? (pick all that apply)",
    options: ["Quality time", "Physical intimacy", "House chores", "Clear communication"],
  },
  {
    genre: "harsh",
    question: "What's a fear you have about long-term relationships? (pick all that apply)",
    options: ["Losing the spark", "Growing apart", "Routine getting boring", "Losing independence"],
  },

  // 😄 Fun / Random
  {
    genre: "fun",
    question: "If we got stranded on an island, which of these would you complain about? (pick all that apply)",
    options: ["No wifi", "No food", "Bugs", "Being bored"],
  },
  {
    genre: "fun",
    question: "Which of these would you want at our dream wedding? (pick all that apply)",
    options: ["A live band", "A destination location", "A huge cake", "A small intimate gathering"],
  },
  {
    genre: "fun",
    question: "Which of these pets would you actually want? (pick all that apply)",
    options: ["A dog", "A cat", "A bird", "Something exotic (reptile, etc.)"],
  },
  {
    genre: "fun",
    question: "Which of these would you pick for a lazy Sunday? (pick all that apply)",
    options: ["Sleeping in late", "Ordering food", "Watching a series together", "Going for a walk"],
  },
  {
    genre: "fun",
    question: "Which of these superpowers would you want? (pick all that apply)",
    options: ["Reading minds", "Teleportation", "Flying", "Time travel"],
  },
  {
    genre: "fun",
    question: "If we won the lottery, what's the first thing we'd buy? (pick all that apply)",
    options: ["A mansion", "A round-the-world trip", "Invest/Save it", "Pay off all debts"],
  },
  {
    genre: "fun",
    question: "Who is the better driver between us? (pick all that apply)",
    options: ["Definitely me", "Definitely you", "Both are good", "Neither is safe!"],
  },
  {
    genre: "fun",
    question: "What's our go-to comfort food to order? (pick all that apply)",
    options: ["Pizza", "Sushi", "Burgers/fries", "Chinese takeout"],
  },
  {
    genre: "fun",
    question: "If we were in a horror movie, who survives? (pick all that apply)",
    options: ["I do, easily", "You do, easily", "We both survive together", "We both get taken out first"],
  },
  {
    genre: "fun",
    question: "Which chore do you absolutely hate doing the most? (pick all that apply)",
    options: ["Washing dishes", "Doing laundry", "Taking out trash", "Vacuuming/dusting"],
  },
  {
    genre: "fun",
    question: "What kind of movie do we agree on most? (pick all that apply)",
    options: ["Comedy", "Thriller/Mystery", "Action/Sci-Fi", "Rom-Com"],
  },
  {
    genre: "fun",
    question: "If we were to play a board game, what happens? (pick all that apply)",
    options: ["It gets way too competitive", "We end up working together", "Someone gives up halfway", "We just laugh the whole time"],
  },
];

// Word banks for drawing-based categories (general)
const WORD_BANKS = {
  general: {
    easy: [
      "cat", "dog", "apple", "sun", "tree", "house", "car", "ball", "book", "fish", "hat", "cup",
      "door", "star", "moon", "milk", "cake", "shoe", "boat", "duck", "frog", "bird", "rain",
      "snow", "chair", "table", "key", "bell", "ring", "nose", "hand", "foot", "baby", "farm"
    ],
    medium: [
      "mountain", "ocean", "city", "forest", "desert", "volcano", "island", "bridge", "castle",
      "lighthouse", "submarine", "spaceship", "robot", "scientist", "chef", "astronaut", "pirate",
      "ninja", "superhero", "guitar", "bicycle", "octopus", "dinosaur", "sandwich", "spider",
      "umbrella", "balloon", "butterfly", "computer", "keyboard", "microscope", "telescope"
    ],
    hard: [
      "whisper", "gravity", "labyrinth", "nostalgia", "aurora", "hologram", "evolution", "symphony",
      "electricity", "magnetism", "reflection", "silhouette", "illusion", "paradox", "constellation",
      "architecture", "chemistry", "archeology", "kaleidoscope", "metamorphosis", "dimension",
      "centaur", "phoenix", "gargoyle", "pyramid", "colosseum", "gladiator", "cryptid"
    ]
  }
};

// Active game state (in-memory, reset per room)
const activeGames = {};
const emptyRoomTimers = {};

const ROUND_DURATION = 80; // seconds per drawing round
const QUIZ_ROUND_DURATION = 25; // seconds per kids quiz image (current 20 + 5)
const MUSIC_ROUND_DURATION = 25; // seconds to pick an answer (current 15 + 10)
const MUSIC_REVEAL_DURATION = 10; // seconds for album art + audio reveal
const COUPLES_ANSWER_DURATION = 20; // seconds for the "answerer" to pick
const COUPLES_GUESS_DURATION = 20; // seconds for the "guesser" to pick
const COUPLES_REVEAL_DURATION = 6; // seconds to show the comparison


module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // ─── JOIN ROOM ───────────────────────────────────────────────
    socket.on("join_room", async ({ roomCode, userId, username, avatar }) => {
      try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) {
          socket.emit("error", { message: "Room not found" });
          return;
        }

        // Cancel the empty room dissolve timer if anyone joins back
        if (emptyRoomTimers[roomCode]) {
          clearTimeout(emptyRoomTimers[roomCode]);
          delete emptyRoomTimers[roomCode];
          console.log(`⏱️ Player joined empty room ${roomCode}. Cancelled scheduled deletion.`);
        }

        if (room.status === "playing") {
          if (!room.allowLateJoin) {
            socket.emit("error", { message: "Game already in progress" });
            return;
          }
          // Join as spectator
          socket.join(roomCode);
          socket.data.roomCode = roomCode;
          socket.data.userId = userId;
          socket.data.username = username;

          const existingIndex = room.players.findIndex(
            (p) => p.userId?.toString() === userId
          );

          if (existingIndex !== -1) {
            room.players[existingIndex].socketId = socket.id;
          } else {
            room.players.push({
              userId,
              username,
              avatar,
              points: 0,
              socketId: socket.id,
              isSpectator: true,
            });
          }

          await room.save();

          if (activeGames[roomCode]) {
            activeGames[roomCode].scores[userId] = 0;
            activeGames[roomCode].guessStreaks[userId] = 0;
          }

          socket.emit("room_joined", { room });
          socket.to(roomCode).emit("player_joined", {
            player: { userId, username, avatar, points: 0, isSpectator: true },
            players: room.players,
          });
          io.to(roomCode).emit("players_updated", { players: room.players });
          return;
        }

        if (room.players.length >= room.maxPlayers) {
          socket.emit("error", { message: "Room is full" });
          return;
        }

        // Join the socket room
        socket.join(roomCode);
        socket.data.roomCode = roomCode;
        socket.data.userId = userId;
        socket.data.username = username;

        // Check if player already in room (reconnect case)
        const existingIndex = room.players.findIndex(
          (p) => p.userId?.toString() === userId
        );

        if (existingIndex !== -1) {
          room.players[existingIndex].socketId = socket.id;
        } else {
          room.players.push({ userId, username, avatar, points: 0, socketId: socket.id });
        }

        await room.save();

        // Send current room state to the joining player
        socket.emit("room_joined", { room });

        // Tell everyone else someone new joined
        socket.to(roomCode).emit("player_joined", {
          player: { userId, username, avatar, points: 0 },
          players: room.players,
        });

        // Broadcast updated player list to ALL in room
        io.to(roomCode).emit("players_updated", { players: room.players });

        // Auto start when full check
        if (room.autoStartWhenFull && room.players.length >= room.maxPlayers) {
          setTimeout(async () => {
            // Re-fetch room to ensure players are still here
            const r = await Room.findOne({ code: roomCode });
            if (r && r.status === "waiting" && r.players.length >= r.maxPlayers) {
              await startGameHelper(io, roomCode);
            }
          }, 1500);
        }
      } catch (err) {
        console.error("join_room error:", err);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    // Helper: start game logic
    async function startGameHelper(io, roomCode) {
      try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) return { error: "Room not found" };

        if (room.category === "couples") {
          if (room.players.length !== 2) {
            return { error: "Couples mode needs exactly 2 players! 💕" };
          }
        } else if (room.players.length < 2) {
          return { error: "Need at least 2 players to start!" };
        }

        room.status = "playing";
        room.currentRound = 1;
        await room.save();

        // Start 5-minute auto-dissolve timer if autoDissolve is enabled
        let dissolveTimer = null;
        if (room.autoDissolve) {
          dissolveTimer = setTimeout(async () => {
            try {
              const currentRoom = await Room.findOne({ code: roomCode });
              if (currentRoom && currentRoom.status !== "finished") {
                await Room.deleteOne({ _id: currentRoom._id });
                io.to(roomCode).emit("room_dissolved", {
                  message: "Game exceeded 5 minutes and was automatically dissolved. ⏱️"
                });
                delete activeGames[roomCode];
                console.log(`⏱️ Room ${roomCode} dissolved automatically after 5 minutes.`);
              }
            } catch (err) {
              console.error("Auto dissolve error:", err);
            }
          }, 5 * 60 * 1000); // 5 minutes
        }

        // Initialize in-memory game state
        activeGames[roomCode] = {
          playerOrder: room.players.map((p) => p.userId?.toString()),
          currentDrawerIndex: 0,
          currentDrawerId: null,
          round: 1,
          totalRounds: room.totalRounds,
          roundDuration: room.roundDuration || 80,
          wordDifficulty: room.wordDifficulty || "mixed",
          enableHints: room.enableHints !== undefined ? room.enableHints : true,
          quizAnswerTime: room.quizAnswerTime || 20,
          quizDifficulty: room.quizDifficulty || "mixed",
          couplesIntensity: room.couplesIntensity || "mixed",
          musicAnswerTime: room.musicAnswerTime || 15,
          musicGenre: room.musicGenre || "mixed",
          scores: {},
          guessStreaks: {},
          guessedThisRound: new Set(),
          category: room.category,
          timer: null,
          dissolveTimer,
        };

        if (room.category === "music") {
          let filteredBank = MUSIC_BANK;
          const genre = room.musicGenre || "mixed";
          if (genre !== "mixed") {
            filteredBank = MUSIC_BANK.filter((song) => song.genre === genre);
          }
          if (filteredBank.length === 0) {
            filteredBank = MUSIC_BANK;
          }
          activeGames[roomCode].musicBank = filteredBank;
        }

        // Give everyone in room their initial 0 points and reset guess streak
        room.players.forEach((p) => {
          activeGames[roomCode].scores[p.userId?.toString()] = 0;
          activeGames[roomCode].guessStreaks[p.userId?.toString()] = 0;
        });

        io.to(roomCode).emit("game_started", {
          players: room.players,
          totalRounds: room.totalRounds,
          category: room.category,
        });

        // Start first round after a short delay
        if (room.category === "kids") {
          setTimeout(() => startQuizRound(io, roomCode), 2000);
        } else if (room.category === "music") {
          setTimeout(() => startMusicRound(io, roomCode), 2000);
        } else if (room.category === "couples") {
          setTimeout(() => startCouplesGame(io, roomCode), 2000);
        } else {
          setTimeout(() => startNewRound(io, roomCode), 2000);
        }
        return { success: true };
      } catch (err) {
        console.error("startGameHelper error:", err);
        return { error: "Internal server error" };
      }
    }

    // ─── START GAME ──────────────────────────────────────────────
    socket.on("start_game", async ({ roomCode }) => {
      const res = await startGameHelper(io, roomCode);
      if (res && res.error) {
        socket.emit("error", { message: res.error });
      }
    });

    // ─── KICK PLAYER ──────────────────────────────────────────────
    socket.on("kick_player", async ({ roomCode, targetUserId }) => {
      try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) return;

        if (room.host.toString() !== socket.data.userId) {
          socket.emit("error", { message: "Only the host can kick players" });
          return;
        }

        if (room.status !== "waiting") {
          socket.emit("error", { message: "Cannot kick players after the game has started" });
          return;
        }

        if (room.allowKick === false) {
          socket.emit("error", { message: "Kicking is disabled in this room" });
          return;
        }

        const targetPlayer = room.players.find(p => p.userId?.toString() === targetUserId);
        if (!targetPlayer) return;

        const targetSocketId = targetPlayer.socketId;
        room.players = room.players.filter(p => p.userId?.toString() !== targetUserId);
        await room.save();

        if (targetSocketId) {
          const targetSocket = io.sockets.sockets.get(targetSocketId);
          if (targetSocket) {
            targetSocket.emit("kicked_from_room", { message: "You have been kicked by the host." });
            targetSocket.leave(roomCode);
            targetSocket.data.roomCode = null;
          }
        }

        io.to(roomCode).emit("players_updated", { players: room.players });
        io.to(roomCode).emit("player_left", {
          userId: targetUserId,
          username: targetPlayer.username,
          players: room.players
        });
      } catch (err) {
        console.error("kick_player error:", err);
      }
    });

    // ─── UPDATE ROOM SETTINGS ──────────────────────────────────────
    socket.on("update_room_settings", async ({ roomCode, allowKick, allowLateJoin }) => {
      try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) return;

        if (room.host.toString() !== socket.data.userId) {
          socket.emit("error", { message: "Only the host can modify settings" });
          return;
        }

        if (allowKick !== undefined) room.allowKick = allowKick;
        if (allowLateJoin !== undefined) room.allowLateJoin = allowLateJoin;
        await room.save();

        io.to(roomCode).emit("room_settings_updated", {
          allowKick: room.allowKick,
          allowLateJoin: room.allowLateJoin,
        });
      } catch (err) {
        console.error("update_room_settings error:", err);
      }
    });

    // ─── DRAWING EVENTS ──────────────────────────────────────────
    socket.on("draw", ({ roomCode, drawData }) => {
      // Broadcast drawing to everyone EXCEPT the sender
      socket.to(roomCode).emit("draw_update", { drawData });
    });

    socket.on("clear_canvas", ({ roomCode }) => {
      socket.to(roomCode).emit("canvas_cleared");
    });

    // ─── CHAT / GUESSING ─────────────────────────────────────────
    socket.on("send_chat", async ({ roomCode, userId, username, message }) => {
      const game = activeGames[roomCode];

      if (!game) {
        // Not in a game, just a lobby chat
        io.to(roomCode).emit("chat_message", { username, message, type: "chat" });
        return;
      }

      // Check if user is spectator
      const room = await Room.findOne({ code: roomCode });
      const isSpectator = room?.players?.find(p => p.userId?.toString() === userId)?.isSpectator;

      if (isSpectator) {
        // Spectator chat message — just broadcast and return
        io.to(roomCode).emit("chat_message", { username, message, type: "chat" });
        return;
      }

      // ── KIDS QUIZ MODE: everyone can guess, no drawer ──
      if (game.category === "kids") {
        handleQuizGuess(io, roomCode, game, { userId, username, message });
        return;
      }

      const currentDrawerId = game.currentDrawerId;
      const isDrawer = userId === currentDrawerId;

      // Drawer can't guess
      if (isDrawer) return;

      // Check if it's a correct guess
      const guess = message.trim().toLowerCase();
      const correctWord = game.currentWord?.toLowerCase();

      if (
        correctWord &&
        guess === correctWord &&
        !game.guessedThisRound.has(userId)
      ) {
        game.guessedThisRound.add(userId);

        // Points: more points for guessing faster
        const timeLeft = game.roundEndTime
          ? Math.max(0, Math.floor((game.roundEndTime - Date.now()) / 1000))
          : 0;
        const pointsEarned = 100 + timeLeft * 2;

        game.scores[userId] = (game.scores[userId] || 0) + pointsEarned;

        // Drawer gets points too when someone guesses correctly
        game.scores[currentDrawerId] = (game.scores[currentDrawerId] || 0) + 30;

        io.to(roomCode).emit("correct_guess", {
          userId,
          username,
          pointsEarned,
          scores: game.scores,
        });

        // If everyone guessed, end round early
        const nonDrawers = game.playerOrder.filter((id) => id !== currentDrawerId);
        if (game.guessedThisRound.size >= nonDrawers.length) {
          clearTimeout(game.timer);
          if (game.hintTimer1) clearTimeout(game.hintTimer1);
          if (game.hintTimer2) clearTimeout(game.hintTimer2);
          setTimeout(() => endRound(io, roomCode), 1500);
        }

        return;
      }

      // Check for close guess (within 1 char edit distance)
      if (correctWord && levenshtein(guess, correctWord) <= 1) {
        socket.emit("chat_message", {
          username: "🎯 Hint",
          message: "So close! Almost got it!",
          type: "hint",
        });
      }

      // Broadcast as regular chat (don't reveal the word)
      io.to(roomCode).emit("chat_message", { username, message, type: "chat" });
    });

    // ─── MUSIC QUIZ: multiple-choice answer click ─────────────────
    socket.on("music_answer", async ({ roomCode, userId, username, selected }) => {
      const game = activeGames[roomCode];
      if (!game || game.category !== "music") return;

      const room = await Room.findOne({ code: roomCode });
      const isSpectator = room?.players?.find(p => p.userId?.toString() === userId)?.isSpectator;
      if (isSpectator) return;

      handleMusicGuess(io, roomCode, game, { userId, username, selected });
    });

    // ─── COUPLES MODE: answerer or guesser submits selections ─────
    socket.on("couples_submit", async ({ roomCode, userId, selections }) => {
      const game = activeGames[roomCode];
      if (!game || game.category !== "couples") return;

      const room = await Room.findOne({ code: roomCode });
      const isSpectator = room?.players?.find(p => p.userId?.toString() === userId)?.isSpectator;
      if (isSpectator) return;

      handleCouplesSubmit(io, roomCode, game, { userId, selections });
    });

    // ─── DISCONNECT ──────────────────────────────────────────────
    socket.on("disconnect", async () => {
      const { roomCode, userId, username } = socket.data;
      if (!roomCode) return;

      try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) return;

        room.players = room.players.filter(
          (p) => p.socketId !== socket.id
        );
        if (room.players.length === 0) {
          if (room.autoDissolveEmpty) {
            console.log(`⏱️ Room ${roomCode} is empty. Scheduling auto-dissolve in 30 minutes.`);
            if (emptyRoomTimers[roomCode]) clearTimeout(emptyRoomTimers[roomCode]);
            emptyRoomTimers[roomCode] = setTimeout(async () => {
              try {
                const currentRoom = await Room.findOne({ code: roomCode });
                if (currentRoom && currentRoom.players.length === 0) {
                  await Room.deleteOne({ _id: currentRoom._id });
                  delete activeGames[roomCode];
                  delete emptyRoomTimers[roomCode];
                  console.log(`🧹 Empty room ${roomCode} dissolved automatically after 30 minutes.`);
                }
              } catch (err) {
                console.error("Empty room auto dissolve error:", err);
              }
            }, 30 * 60 * 1000); // 30 minutes
          } else {
            await Room.deleteOne({ _id: room._id });
            console.log(`🧹 Room ${roomCode} deleted immediately because it became empty and autoDissolveEmpty is false.`);
          }
        } else {
          await room.save();
          io.to(roomCode).emit("player_left", { userId, username, players: room.players });
          io.to(roomCode).emit("players_updated", { players: room.players });
        }
        console.log(`🔌 ${username} left room ${roomCode}`);
      } catch (err) {
        console.error("disconnect error:", err);
      }
    });
  });

  // ─── ROUND LOGIC ─────────────────────────────────────────────────

  async function updateGuessStreaks(io, roomCode, correctUserIds, ignoreUserIds = []) {
    const game = activeGames[roomCode];
    if (!game) return;

    for (const playerId of game.playerOrder) {
      if (ignoreUserIds.includes(playerId)) {
        continue;
      }

      if (correctUserIds.has(playerId)) {
        game.guessStreaks[playerId] = (game.guessStreaks[playerId] || 0) + 1;
        if (game.guessStreaks[playerId] >= 3) {
          try {
            const u = await User.findById(playerId);
            if (u && !u.badges.includes("streak_3")) {
              u.badges.push("streak_3");
              await u.save();
              io.to(roomCode).emit("badge_unlocked", { userId: playerId, badge: "streak_3" });
            }
          } catch (err) {
            console.error("Error awarding streak_3 badge:", err);
          }
        }
      } else {
        game.guessStreaks[playerId] = 0;
      }
    }
  }

  async function promoteSpectators(roomCode) {
    try {
      const room = await Room.findOne({ code: roomCode });
      if (!room) return null;

      let playerOrder = [];
      let changed = false;

      room.players.forEach((p) => {
        if (p.isSpectator) {
          p.isSpectator = false;
          changed = true;
        }
        playerOrder.push(p.userId.toString());
      });

      if (changed) {
        await room.save();
        io.to(roomCode).emit("players_updated", { players: room.players });
      }

      const game = activeGames[roomCode];
      if (game) {
        game.playerOrder = playerOrder;
      }
      return playerOrder;
    } catch (err) {
      console.error("promoteSpectators error:", err);
      return null;
    }
  }

  async function startNewRound(io, roomCode) {
    const game = activeGames[roomCode];
    if (!game) return;

    await promoteSpectators(roomCode);

    const room = await Room.findOne({ code: roomCode });
    if (!room) return;

    // Clear any previous hint timers
    if (game.hintTimer1) clearTimeout(game.hintTimer1);
    if (game.hintTimer2) clearTimeout(game.hintTimer2);

    // Reset guesses for new round
    game.guessedThisRound = new Set();

    // Pick the drawer
    const drawerId = game.playerOrder[game.currentDrawerIndex];
    game.currentDrawerId = drawerId; // store explicitly for chat/guess checks
    game.currentDrawerIndex = (game.currentDrawerIndex + 1) % game.playerOrder.length;

    // Pick a random word from category based on difficulty settings
    let bank = [];
    if (game.category === "general") {
      const difficulty = game.wordDifficulty || "mixed";
      const gBank = WORD_BANKS.general;
      if (difficulty === "easy") {
        bank = gBank.easy;
      } else if (difficulty === "medium") {
        bank = gBank.medium;
      } else if (difficulty === "hard") {
        bank = gBank.hard;
      } else {
        bank = [...gBank.easy, ...gBank.medium, ...gBank.hard];
      }
    } else {
      bank = WORD_BANKS[game.category] || WORD_BANKS.general.easy;
    }

    const word = bank[Math.floor(Math.random() * bank.length)];
    game.currentWord = word;

    const duration = game.roundDuration || 80;
    game.roundEndTime = Date.now() + duration * 1000;

    // Update room in DB
    room.currentDrawer = drawerId;
    room.currentWord = word;
    room.currentRound = game.round;
    await room.save();

    // Send word ONLY to the drawer
    const drawerSocket = findSocketByUserId(io, drawerId, roomCode);
    if (drawerSocket) {
      drawerSocket.emit("your_turn_to_draw", {
        word,
        round: game.round,
        totalRounds: game.totalRounds,
        duration: duration,
      });
    }

    // Send masked word (blanks) to everyone else
    const maskedWord = word.replace(/[a-zA-Z]/g, "_");
    io.to(roomCode).emit("round_started", {
      drawerId,
      drawerName: room.players.find((p) => p.userId?.toString() === drawerId)?.username,
      round: game.round,
      totalRounds: game.totalRounds,
      wordLength: word.length,
      maskedWord,
      duration: duration,
    });

    // Set round timer
    game.timer = setTimeout(() => endRound(io, roomCode), duration * 1000);

    // Schedule Hint Reveals if enabled
    if (game.enableHints) {
      // Find all alphabetic letter indexes in the word
      const letterIndexes = [];
      for (let i = 0; i < word.length; i++) {
        if (/[a-zA-Z]/.test(word[i])) {
          letterIndexes.push(i);
        }
      }

      // Pick up to 2 distinct indices to reveal
      let revealIndex1 = -1;
      let revealIndex2 = -1;
      if (letterIndexes.length > 2) {
        const idx1 = Math.floor(Math.random() * letterIndexes.length);
        revealIndex1 = letterIndexes[idx1];
        letterIndexes.splice(idx1, 1);
        const idx2 = Math.floor(Math.random() * letterIndexes.length);
        revealIndex2 = letterIndexes[idx2];
      } else if (letterIndexes.length > 0) {
        revealIndex1 = letterIndexes[Math.floor(Math.random() * letterIndexes.length)];
      }

      // Schedule first reveal at 50% time elapsed
      if (revealIndex1 !== -1) {
        game.hintTimer1 = setTimeout(() => {
          const maskedArray = [...word].map((ch, idx) => {
            if (idx === revealIndex1) return ch;
            return /[a-zA-Z]/.test(ch) ? "_" : ch;
          });
          io.to(roomCode).emit("hint_reveal", { maskedWord: maskedArray.join("") });
        }, (duration * 0.5) * 1000);
      }

      // Schedule second reveal at 75% time elapsed
      if (revealIndex2 !== -1) {
        game.hintTimer2 = setTimeout(() => {
          const maskedArray = [...word].map((ch, idx) => {
            if (idx === revealIndex1 || idx === revealIndex2) return ch;
            return /[a-zA-Z]/.test(ch) ? "_" : ch;
          });
          io.to(roomCode).emit("hint_reveal", { maskedWord: maskedArray.join("") });
        }, (duration * 0.75) * 1000);
      }
    }
  }

  async function endRound(io, roomCode) {
    const game = activeGames[roomCode];
    if (!game) return;

    // Clear any active hint timers
    if (game.hintTimer1) clearTimeout(game.hintTimer1);
    if (game.hintTimer2) clearTimeout(game.hintTimer2);

    // Track guess streaks (exclude the drawer)
    await updateGuessStreaks(io, roomCode, game.guessedThisRound, [game.currentDrawerId]);

    const word = game.currentWord;

    io.to(roomCode).emit("round_ended", {
      word,
      scores: game.scores,
      round: game.round,
    });

    game.round++;

    if (game.round > game.totalRounds) {
      // Game over
      setTimeout(() => endGame(io, roomCode, game), 3000);
    } else {
      // Start next round after a pause
      setTimeout(() => startNewRound(io, roomCode), 4000);
    }
  }

  // ─── KIDS QUIZ MODE LOGIC ──────────────────────────────────────────

  async function startQuizRound(io, roomCode) {
    const game = activeGames[roomCode];
    if (!game) return;

    await promoteSpectators(roomCode);

    const room = await Room.findOne({ code: roomCode });
    if (!room) return;

    // Reset guesses for new round
    game.guessedThisRound = new Set();

    // Select correct animal bank depending on difficulty setting
    const difficulty = game.quizDifficulty || "mixed";
    const bank = KIDS_QUIZ_BANK[difficulty] || KIDS_QUIZ_BANK.mixed;

    const duration = game.quizAnswerTime || 20;

    // Pick a random image+answer, avoid repeating the same item back-to-back
    let item;
    do {
      item = bank[Math.floor(Math.random() * bank.length)];
    } while (bank.length > 1 && item.answer === game.currentWord);

    game.currentWord = item.answer;
    game.currentImage = item.image;
    game.roundEndTime = Date.now() + duration * 1000;
    game.guessRank = 0; // tracks how many players have guessed correctly this round (for tiered points)

    // Update room in DB
    room.currentWord = item.answer;
    room.currentRound = game.round;
    await room.save();

    // Send the image to everyone — no "drawer" in quiz mode
    io.to(roomCode).emit("quiz_round_started", {
      image: item.image,
      round: game.round,
      totalRounds: game.totalRounds,
      duration: duration,
    });

    // Set round timer
    game.timer = setTimeout(() => endQuizRound(io, roomCode), duration * 1000);
  }

  function handleQuizGuess(io, roomCode, game, { userId, username, message }) {
    const guess = message.trim().toLowerCase();
    const correctAnswer = game.currentWord?.toLowerCase();

    if (
      correctAnswer &&
      guess === correctAnswer &&
      !game.guessedThisRound.has(userId)
    ) {
      game.guessedThisRound.add(userId);

      // Tiered points: 1st correct = 100, 2nd = 70, 3rd = 50, then 30 for the rest
      const tierPoints = [100, 70, 50];
      const basePoints = tierPoints[game.guessRank] ?? 30;

      // Small speed bonus on top
      const timeLeft = game.roundEndTime
        ? Math.max(0, Math.floor((game.roundEndTime - Date.now()) / 1000))
        : 0;
      const pointsEarned = basePoints + timeLeft;

      game.guessRank++;
      game.scores[userId] = (game.scores[userId] || 0) + pointsEarned;

      io.to(roomCode).emit("correct_guess", {
        userId,
        username,
        pointsEarned,
        scores: game.scores,
      });

      // If everyone guessed correctly, end round early
      if (game.guessedThisRound.size >= game.playerOrder.length) {
        clearTimeout(game.timer);
        setTimeout(() => endQuizRound(io, roomCode), 1500);
      }
      return;
    }

    // Wrong or repeated guess — just broadcast as chat (don't reveal answer)
    io.to(roomCode).emit("chat_message", { username, message, type: "chat" });
  }

  async function endQuizRound(io, roomCode) {
    const game = activeGames[roomCode];
    if (!game) return;

    // Track guess streaks (everyone is a guesser)
    await updateGuessStreaks(io, roomCode, game.guessedThisRound, []);

    const answer = game.currentWord;

    io.to(roomCode).emit("quiz_round_ended", {
      answer,
      scores: game.scores,
      round: game.round,
    });

    game.round++;

    if (game.round > game.totalRounds) {
      setTimeout(() => endGame(io, roomCode, game), 3000);
    } else {
      setTimeout(() => startQuizRound(io, roomCode), 4000);
    }
  }

  // ─── MUSIC QUIZ MODE LOGIC ─────────────────────────────────────────

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  async function startMusicRound(io, roomCode) {
    const game = activeGames[roomCode];
    if (!game) return;

    await promoteSpectators(roomCode);

    const room = await Room.findOne({ code: roomCode });
    if (!room) return;

    game.guessedThisRound = new Set();
    game.correctGuessesThisRound = new Set();

    // Pick a random song from the filtered bank, avoid repeating the same one back-to-back
    let song;
    const bank = game.musicBank || MUSIC_BANK;
    do {
      song = bank[Math.floor(Math.random() * bank.length)];
    } while (bank.length > 1 && song.answer === game.currentWord);

    game.currentWord = song.answer;
    game.currentSong = song;

    const duration = game.musicAnswerTime || 15;
    game.roundEndTime = Date.now() + duration * 1000;
    game.guessRank = 0;

    // Build shuffled options (correct answer + 3 fakes)
    const options = shuffle([song.answer, ...song.fakeOptions]);

    room.currentWord = song.answer;
    room.currentRound = game.round;
    await room.save();

    // Mask the correct answer in the clue lyric to avoid giving it away
    let maskedClue = song.clue;
    if (song.answer) {
      const escapedAnswer = song.answer.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(escapedAnswer, 'gi');
      maskedClue = song.clue.replace(regex, (match) => {
        return match.split('').map(char => char === ' ' ? ' ' : '_').join('');
      });
    }

    io.to(roomCode).emit("music_round_started", {
      clue: maskedClue,
      options,
      audio: song.audio, // send audio URL for 3-second hint
      round: game.round,
      totalRounds: game.totalRounds,
      duration: duration,
    });

    // Set round timer — if it runs out, reveal anyway
    game.timer = setTimeout(() => revealMusicAnswer(io, roomCode), duration * 1000);
  }

  function handleMusicGuess(io, roomCode, game, { userId, username, selected }) {
    if (game.guessedThisRound.has(userId)) return; // already answered this round
    game.guessedThisRound.add(userId);

    const isCorrect = selected === game.currentSong?.answer;

    if (isCorrect) {
      if (!game.correctGuessesThisRound) {
        game.correctGuessesThisRound = new Set();
      }
      game.correctGuessesThisRound.add(userId);
      // Tiered points: 1st correct = 100, 2nd = 70, 3rd = 50, then 30 for the rest
      const tierPoints = [100, 70, 50];
      const basePoints = tierPoints[game.guessRank] ?? 30;

      const timeLeft = game.roundEndTime
        ? Math.max(0, Math.floor((game.roundEndTime - Date.now()) / 1000))
        : 0;
      const pointsEarned = basePoints + timeLeft;

      game.guessRank++;
      game.scores[userId] = (game.scores[userId] || 0) + pointsEarned;

      io.to(roomCode).emit("correct_guess", {
        userId,
        username,
        pointsEarned,
        scores: game.scores,
      });
    } else {
      // Wrong guess — let them know privately, no points
      const sock = findSocketByUserId(io, userId, roomCode);
      sock?.emit("music_wrong_answer", { selected });
    }

    // If everyone has answered, reveal early
    if (game.guessedThisRound.size >= game.playerOrder.length) {
      clearTimeout(game.timer);
      setTimeout(() => revealMusicAnswer(io, roomCode), 1000);
    }
  }

  // Reveal album art + play audio clip for everyone, then move to next round
  async function revealMusicAnswer(io, roomCode) {
    const game = activeGames[roomCode];
    if (!game) return;

    // Track guess streaks (everyone is a guesser)
    await updateGuessStreaks(io, roomCode, game.correctGuessesThisRound || new Set(), []);

    const song = game.currentSong;
    const revealDuration = song.revealDuration || 15;

    io.to(roomCode).emit("music_reveal", {
      answer: song.answer,
      artist: song.artist,
      cover: song.cover,
      audio: song.audio,
      scores: game.scores,
      round: game.round,
      duration: revealDuration,
    });

    game.round++;

    if (game.round > game.totalRounds) {
      setTimeout(() => endGame(io, roomCode, game), revealDuration * 1000);
    } else {
      setTimeout(() => startMusicRound(io, roomCode), revealDuration * 1000);
    }
  }

  // ─── COUPLES MODE LOGIC ─────────────────────────────────────────────
  //
  // 10 rounds total. Rounds 1-5: questions about playerOrder[0] ("him").
  // Rounds 6-10: questions about playerOrder[1] ("her").
  // The "answerer" privately picks their true answers (multi-select).
  // The "guesser" tries to predict those answers (multi-select).
  // Points go to the GUESSER based on overlap accuracy.

  function shuffleAndPick(arr, count) {
    return shuffle(arr).slice(0, count);
  }

  async function startCouplesGame(io, roomCode) {
    const game = activeGames[roomCode];
    if (!game) return;

    // Force exactly 10 rounds for couples mode regardless of room setting
    game.totalRounds = 10;

    // Filter bank based on selected intensity
    const intensity = game.couplesIntensity || "mixed";
    let filteredBank = COUPLES_BANK;
    if (intensity === "sweet") {
      filteredBank = COUPLES_BANK.filter(q => q.genre === "sweet" || q.genre === "fun");
    } else if (intensity === "spicy") {
      filteredBank = COUPLES_BANK.filter(q => q.genre === "spicy" || q.genre === "harsh");
    }
    if (filteredBank.length < 10) {
      filteredBank = COUPLES_BANK;
    }

    // Pick 10 unique questions from the bank (5 for "him", 5 for "her")
    game.couplesQuestions = shuffleAndPick(filteredBank, 10);

    await startCouplesRound(io, roomCode);
  }

  async function startCouplesRound(io, roomCode) {
    const game = activeGames[roomCode];
    if (!game) return;

    await promoteSpectators(roomCode);

    const room = await Room.findOne({ code: roomCode });
    if (!room) return;

    const roundIndex = game.round - 1; // 0-based
    const question = game.couplesQuestions[roundIndex % game.couplesQuestions.length];

    // Rounds 1-5 → answerer is playerOrder[0] ("him")
    // Rounds 6-10 → answerer is playerOrder[1] ("her")
    const answererId = game.round <= 5 ? game.playerOrder[0] : game.playerOrder[1];
    const guesserId = game.round <= 5 ? game.playerOrder[1] : game.playerOrder[0];

    game.currentQuestion = question;
    game.answererId = answererId;
    game.guesserId = guesserId;
    game.answererSelections = null;
    game.guesserSelections = null;
    game.couplesPhase = "answering"; // "answering" | "guessing" | "reveal"

    const answererName = room.players.find(p => p.userId?.toString() === answererId)?.username;
    const guesserName = room.players.find(p => p.userId?.toString() === guesserId)?.username;

    room.currentRound = game.round;
    await room.save();

    // Tell everyone the round started — who's answering, who's guessing
    io.to(roomCode).emit("couples_round_started", {
      round: game.round,
      totalRounds: game.totalRounds,
      genre: question.genre,
      question: question.question,
      options: question.options,
      answererId,
      answererName,
      guesserId,
      guesserName,
      phase: "answering",
      duration: COUPLES_ANSWER_DURATION,
    });

    // Timer for the answering phase
    game.timer = setTimeout(() => {
      // If answerer didn't submit in time, default to empty selection
      if (!game.answererSelections) {
        game.answererSelections = [];
      }
      moveToGuessingPhase(io, roomCode);
    }, COUPLES_ANSWER_DURATION * 1000);
  }

  function moveToGuessingPhase(io, roomCode) {
    const game = activeGames[roomCode];
    if (!game) return;

    game.couplesPhase = "guessing";

    io.to(roomCode).emit("couples_phase_guessing", {
      duration: COUPLES_GUESS_DURATION,
    });

    game.timer = setTimeout(() => {
      if (!game.guesserSelections) {
        game.guesserSelections = [];
      }
      revealCouplesRound(io, roomCode);
    }, COUPLES_GUESS_DURATION * 1000);
  }

  function handleCouplesSubmit(io, roomCode, game, { userId, selections }) {
    if (game.couplesPhase === "answering" && userId === game.answererId) {
      if (game.answererSelections) return; // already submitted
      game.answererSelections = selections;

      // Let the guesser know the answerer has locked in (without revealing what)
      const guesserSocket = findSocketByUserId(io, game.guesserId, roomCode);
      guesserSocket?.emit("couples_answerer_ready");

      // Move on immediately if guesser already submitted (edge case) — otherwise wait for timer
      clearTimeout(game.timer);
      moveToGuessingPhase(io, roomCode);
      return;
    }

    if (game.couplesPhase === "guessing" && userId === game.guesserId) {
      if (game.guesserSelections) return; // already submitted
      game.guesserSelections = selections;

      clearTimeout(game.timer);
      revealCouplesRound(io, roomCode);
      return;
    }
  }

  // Compare answerer vs guesser selections, award points, reveal to both
  async function revealCouplesRound(io, roomCode) {
    const game = activeGames[roomCode];
    if (!game) return;

    game.couplesPhase = "reveal";

    const trueSet = new Set(game.answererSelections || []);
    const guessSet = new Set(game.guesserSelections || []);

    const correctMatches = [...guessSet].filter(g => trueSet.has(g)).length;
    const wrongSelections = [...guessSet].filter(g => !trueSet.has(g)).length;
    const totalTrue = trueSet.size;

    let points = 0;
    if (totalTrue > 0) {
      points = Math.round((correctMatches / totalTrue) * 100) - (wrongSelections * 10);
    } else if (guessSet.size === 0) {
      // Answerer picked nothing AND guesser guessed nothing — perfect read!
      points = 100;
    }
    points = Math.max(0, points);

    // Points go to the GUESSER
    game.scores[game.guesserId] = (game.scores[game.guesserId] || 0) + points;

    io.to(roomCode).emit("couples_round_revealed", {
      round: game.round,
      question: game.currentQuestion.question,
      options: game.currentQuestion.options,
      answererSelections: [...trueSet],
      guesserSelections: [...guessSet],
      pointsEarned: points,
      guesserId: game.guesserId,
      scores: game.scores,
    });

    game.round++;

    if (game.round > game.totalRounds) {
      setTimeout(() => endGame(io, roomCode, game), COUPLES_REVEAL_DURATION * 1000);
    } else {
      setTimeout(() => startCouplesRound(io, roomCode), COUPLES_REVEAL_DURATION * 1000);
    }
  }

  async function endGame(io, roomCode, game) {
    try {
      const room = await Room.findOne({ code: roomCode });
      if (!room) return;

      room.status = "finished";
      await room.save();

      // Sort players by score
      const finalScores = Object.entries(game.scores)
        .sort(([, a], [, b]) => b - a)
        .map(([userId, points], index) => ({
          userId,
          points,
          rank: index + 1,
          username: room.players.find((p) => p.userId?.toString() === userId)?.username,
          avatar: room.players.find((p) => p.userId?.toString() === userId)?.avatar,
        }));

      // Save points and stats to user accounts in DB
      for (let i = 0; i < finalScores.length; i++) {
        const { userId, points } = finalScores[i];
        try {
          const u = await User.findById(userId);
          if (u) {
            u.gamesPlayed += 1;
            if (i === 0) {
              u.gamesWon += 1;
              if (!u.badges.includes("first_win")) {
                u.badges.push("first_win");
              }
            }
            await u.addPoints(points);
          }
        } catch (dbErr) {
          console.error(`Failed to update stats for user ${userId}:`, dbErr);
        }
      }

      io.to(roomCode).emit("game_over", { finalScores });

      // Clean up in-memory state
      if (game.dissolveTimer) {
        clearTimeout(game.dissolveTimer);
      }
      delete activeGames[roomCode];
    } catch (err) {
      console.error("endGame error:", err);
    }
  }

  // Helper: find a socket by userId inside a room
  function findSocketByUserId(io, userId, roomCode) {
    const room = io.sockets.adapter.rooms.get(roomCode);
    if (!room) return null;
    for (const socketId of room) {
      const s = io.sockets.sockets.get(socketId);
      if (s?.data?.userId === userId) return s;
    }
    return null;
  }

  // Simple Levenshtein distance for "close guess" detection
  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, (_, i) =>
      Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] =
          a[i - 1] === b[j - 1]
            ? dp[i - 1][j - 1]
            : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[m][n];
  }
};