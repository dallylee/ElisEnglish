# Eli's English Learning Web App

A personalized, interactive English learning web app designed for Eli, a 10-year-old beginner in Zagreb. Features themed lessons (K-pop, Harry Potter, skiing), multiple game types, progress tracking, and a tutor dashboard—all running fully in the browser with no external APIs.

## ✨ Features

- **Personalized Experience**: Greets Eli by name, tracks her progress, and awards personalized badges
- **Multiple Game Types**:
  - 📇 Flashcards with images and audio
  - ✅ Multiple choice quizzes
  - 💬 Branching dialogue conversations
  - 🎮 More games (drag-and-drop, memory, puzzles) can be added easily
- **Three Themes**: K-pop, Harry Potter, and Skiing with custom color schemes
- **Progress Tracking**: Streaks, points, badges, and detailed analytics
- **Tutor Dashboard**: PIN-protected dashboard with usage statistics and progress export
- **Fully Offline**: All data stored in browser localStorage, no external APIs
- **Responsive Design**: Works on tablets, laptops, and desktops

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone or download this repository**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

This creates a `dist/` folder with all static files ready for deployment.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
ElisEnglish/
├── lessons/                    # Lesson JSON files
│   ├── kpop-greetings.json
│   ├── skiing-basics.json
│   └── hogwarts-house.json
├── voice-lessons/              # Voice lesson modules (future)
├── assets/
│   ├── audio/                  # Audio files for vocabulary
│   └── images/                 # Images for vocabulary and themes
├── src/
│   ├── components/             # React components
│   │   ├── Games/              # Game components (Flashcard, MultipleChoice, etc.)
│   │   ├── Home/               # Home screen
│   │   ├── Lessons/            # Lesson browser and player
│   │   ├── Badges/             # Badge gallery
│   │   ├── Settings/           # Settings page
│   │   ├── Tutor/              # Tutor dashboard
│   │   └── Layout/             # Navigation and layout
│   ├── contexts/               # React contexts (Theme, Progress)
│   ├── hooks/                  # Custom hooks (speech synthesis)
│   ├── services/               # Core services (storage, lesson loader, progress tracker)
│   ├── types/                  # TypeScript type definitions
│   ├── styles/                 # Global styles and design tokens
│   ├── App.tsx                 # Main app with routing
│   └── main.tsx                # Entry point
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## 📚 Adding New Lessons

### Creating a Lesson File

1. **Create a new JSON file** in the `lessons/` folder (e.g., `my-lesson.json`)

2. **Use this template**:

```json
{
  "id": "my-lesson",
  "title": "My Lesson Title",
  "theme": "kpop",
  "difficultyLevel": "A0",
  "estimatedMinutes": 15,
  "vocabulary": [
    {
      "id": "word1",
      "english": "Hello",
      "croatian": "Bok",
      "image": "/assets/images/hello.png",
      "audio": "/assets/audio/hello.mp3"
    }
  ],
  "dialogueCharacter": {
    "name": "Luna",
    "avatar": "/assets/images/kpop-character.png",
    "theme": "kpop"
  },
  "dialogueTree": [
    {
      "id": "start",
      "message": {
        "id": "m1",
        "speaker": "Luna",
        "text": "Hello! Ready to learn?"
      },
      "choices": [
        {
          "id": "c1",
          "text": "Yes!",
          "nextMessageId": "next-node-id"
        }
      ]
    }
  ],
  "games": [
    {
      "type": "flashcard",
      "vocabulary": ["word1"]
    },
    {
      "type": "multiple-choice",
      "vocabulary": ["word1"],
      "settings": {
        "mode": "word-to-translation"
      }
    },
    {
      "type": "dialogue",
      "dialogueStartId": "start"
    }
  ]
}
```

3. **Save the file** and reload the app—the lesson will appear automatically!

### Field Reference

- **id**: Unique identifier (lowercase-with-dashes)
- **theme**: `kpop`, `harry_potter`, `skiing`, or `general`
- **difficultyLevel**: `A0` (beginner), `A1`, or `A2`
- **vocabulary**: Array of words with English, Croatian translation, optional image and audio paths
- **games**: Array specifying which game types to use in the lesson

## 🎨 Adding Images and Audio

### Images

1. Add image files to `assets/images/`
2. Reference them in lesson JSON: `"/assets/images/filename.png"`
3. Supported formats: PNG, JPG, SVG

### Audio Files

1. Add audio files to `assets/audio/`
2. Reference them in lesson JSON: `"/assets/audio/filename.mp3"`
3. Supported formats: MP3, WAV, OGG

**Note**: Audio files are not included in this repository. You'll need to:
- Record your own audio for vocabulary words
- Use text-to-speech tools to generate audio
- Source royalty-free audio files

## 💬 Creating Dialogues

Dialogues use a branching tree structure where each node has:
- A message from a character
- Optional choices leading to other nodes

Example dialogue tree:
```json
"dialogueTree": [
  {
    "id": "start",
    "message": {
      "id": "m1",
      "speaker": "Luna",
      "text": "Hello! How are you?"
    },
    "choices": [
      { "id": "c1", "text": "I'm good!", "nextMessageId": "response-good" },
      { "id": "c2", "text": "I'm tired", "nextMessageId": "response-tired" }
    ]
  },
  {
    "id": "response-good",
    "message": {
      "id": "m2",
      "speaker": "Luna",
      "text": "That's great to hear!"
    }
    // No choices = end of conversation
  }
]
```

## 🎮 Available Game Types

1. **flashcard**: Vocabulary flashcards with flip animation
2. **multiple-choice**: Quiz with 4 options
3. **dialogue**: Interactive conversation with branching paths
4. **drag-and-drop**: Match words to pictures (coming soon)
5. **memory**: Memory card matching game (coming soon)
6. **letter-scramble**: Spell words by arranging letters (coming soon)
7. **fill-in-the-gap**: Complete sentences (coming soon)
8. **voice-lesson**: Audio-based lessons with comprehension questions (coming soon)

## 👨‍🏫 Tutor Dashboard

Access the tutor dashboard at `/tutor`:
- **Default PIN**: `1234`
- **Features**:
  - View usage statistics (time, streaks, points)
  - See recent activity (last 7 days)
  - Identify difficult words (high error rate)
  - Export progress as JSON or Markdown

To change the PIN, edit the default value in `src/services/storage.ts` (line with `pin: '1234'`).

## 🌐 Deployment

### GitHub Pages

1. Update `vite.config.ts` base path:
   ```ts
   base: '/ElisEnglish/', // Your repo name
   ```

2. Build and deploy:
   ```bash
   npm run build
   # Upload dist/ folder to GitHub Pages
   ```

### Netlify

1. Connect your repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

### Other Static Hosts

The app works on any static file host:
- Vercel
- Cloudflare Pages
- Firebase Hosting
- Any web server

Just upload the `dist/` folder after running `npm run build`.

## 🛠️ Customization

### Changing Eli's Name

Edit `src/services/storage.ts`:
```ts
profile: {
  name: 'YourName', // Change this
  nativeLanguage: 'Croatian',
  targetDailyMinutes: 30
}
```

### Adding New Themes

1. Add theme colors in `src/styles/design-tokens.css`:
   ```css
   [data-theme="your-theme"] {
     --color-primary: #yourcolor;
     --color-secondary: #yourcolor;
     /* etc. */
   }
   ```

2. Update `src/types/lesson.ts` to include your theme in the `Theme` type

3. Create lessons with `"theme": "your-theme"`

### Customizing Badges

Edit badge definitions in `src/services/storage.ts` (function `getDefaultBadges()`).

## 🐛 Troubleshooting

### Lessons Not Appearing

- Check the console for errors
- Ensure JSON files are valid (use JSONLint.com)
- Verify file paths start with `/lessons/`
- Clear browser cache and reload

### Audio Not Playing

- Ensure audio files exist in `assets/audio/`
- Check file paths in lesson JSON
- Some browsers require user interaction before playing audio
- Try different audio formats (MP3, WAV)

### Data Not Saving

- Check if localStorage is enabled in your browser
- Try a different browser
- Check browser console for errors

## 📄 License

This project is created for personal educational use for Eli.

## 🙏 Credits

Made with ❤️ for Eli to help her learn English through fun, personalized practice.

---

**Need Help?** Check the existing lesson files for examples, or refer to the inline code comments for guidance.
