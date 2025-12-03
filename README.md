# 🍊 PomRian - Thai Language Learning App

A modern, interactive React application for learning Thai language through progressive exercises with AI-powered content.

## Features

- **2 Progressive Levels**: Characters → AI-Generated Words
- **Multiple Choice Exercises**: Pick the correct Thai text from phonetic transcriptions
- **Smart Progress Tracking**: Unlock new levels as you complete exercises
- **AI-Powered Content**: Dynamic word generation using OpenAI GPT for authentic learning material
- **Modern UI**: Professional, responsive design with smooth animations
- **Error Handling**: Graceful fallbacks and clear error messages

## How to Learn Thai

1. **Level 1 - Characters**: Learn Thai consonants and vowels by associating them with their phonetic sounds
2. **Level 2 - Words**: Practice AI-generated Thai vocabulary with authentic examples

Each level consists of 10 exercises. Complete a level to unlock the next one!

## Setup Instructions

### Prerequisites
- Node.js (version 20.19+ or 22.12+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd PomRian
```

2. Install dependencies:
```bash
npm install
```

3. (Required) Set up OpenAI API for dynamic word generation:
   - Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a `.env` file in the root directory:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Card.tsx        # Multiple choice card component
│   ├── CharactersExercise.tsx  # Level 1 component
│   ├── Exercise.tsx    # Base exercise component
│   ├── LevelSelector.tsx       # Level selection component
│   ├── ProgressBar.tsx # Progress tracking component
│   └── WordsExercise.tsx       # Level 2 component
├── data/
│   └── thaiData.ts     # Thai language data (consonants, vowels, words)
├── types.ts            # TypeScript type definitions
├── App.tsx            # Main application component
├── App.css            # Application styles
├── index.css          # Global styles
└── main.tsx          # Application entry point
```

## Thai Language Data

The app includes comprehensive Thai language data:
- **44 Consonants**: All Thai consonants with their phonetic equivalents
- **32 Vowels**: Including short, long, and diphthong vowels
- **AI-Generated Words**: Dynamic vocabulary generation using OpenAI GPT for authentic, contextual learning

## Technologies Used

- **React 18** with TypeScript
- **Vite** for build tooling
- **OpenAI GPT-4o-mini** for dynamic content generation
- **CSS3** with modern features (backdrop-filter, grid, flexbox)
- **ESLint** for code quality

## Learning Methodology

The app uses **phonetic association** - you learn Thai by connecting written characters with their spoken sounds. This approach is particularly effective for:

- Visual learners who benefit from seeing characters
- Audio learners who can practice pronunciation
- Progressive learners who advance through structured levels

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For questions or feedback, please open an issue on the GitHub repository.

---

**Happy Learning! 🇹🇭**