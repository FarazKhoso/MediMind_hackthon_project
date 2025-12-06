# MediMind AI - Your AI Health Assistant

MediMind is an AI-powered health assistant that provides medical insights, health analysis, and wellness tracking through the power of Google's Gemini AI.

## Features

- AI Health Query Assistant
- Disease Tracking Agent
- Health Data Analysis
- Medicine Reminders
- Mental Health Chatbot
- Symptom Checker
- Health Dashboard

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Google Gemini API key

## API Key Setup

You'll need a Gemini API key to run this application. Follow these steps:

1. Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a `.env.local` file in the project root
3. Add your API key to the file:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

See the [API Setup Guide](./docs/api-setup.md) for detailed instructions.

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MediMind_hackthon_project
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see above)

4. Run the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002)

## Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run genkit:dev` - Start Genkit development server
- `npm run genkit:watch` - Start Genkit with file watching
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run linting
- `npm run typecheck` - Run TypeScript type checking
- `npm run setup-env` - Display environment setup instructions

## Project Structure

- `/src/app` - Next.js application pages and layout
- `/src/ai` - AI flows and Genkit configuration
- `/src/ai/flows` - Individual AI flow implementations
- `/src/components` - React components
- `/src/firebase` - Firebase configuration and utilities
- `/docs` - Documentation files

## Technologies Used

- Next.js 15
- React 18
- TypeScript
- Genkit
- Google Gemini AI
- Tailwind CSS
- Radix UI
- Firebase

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## Environment Variables

This project uses the following environment variables:

- `GEMINI_API_KEY` - Google Gemini API key (required)

## License

This project is licensed under the MIT License.