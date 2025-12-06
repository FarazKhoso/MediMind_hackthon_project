# API Key Setup for MediMind AI

This document explains how to set up the Gemini API key for the MediMind AI project.

## Getting Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click on "Get API Key" or "Create API Key"
4. Follow the instructions to create your API key

## Setting Up Environment Variables

### For Local Development

1. Create a file named `.env.local` in the root of your project (same level as `package.json`)
2. Add your API key to this file:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

Alternative variable name (either works):
```env
GOOGLE_API_KEY=your_actual_api_key_here
```

### Example `.env.local` file:

```env
# Gemini API Key
GEMINI_API_KEY=AIzxGO***************************  # Replace with your actual key
```

## Important Notes

- **Never commit** your `.env.local` file to version control
- The `.env.local` file is already in the `.gitignore` file, so it won't be committed
- The `.env` and `.env.example` files in the repository only contain examples and placeholders
- API keys should never be hardcoded in your source code

## Environment Files in This Project

- `.env` - Contains example environment variables (for reference only)
- `.env.example` - Template showing what environment variables are needed
- `.env.local` - **Your personal file with actual API keys** (this is git-ignored)

## Restart Development Server

After adding your API key, restart your development server for the changes to take effect:

```bash
npm run dev
```

Or with Turbopack:
```bash
npm run dev
```

## Troubleshooting

If you get API key errors:

1. Verify your `.env.local` file is in the root directory of your project
2. Check that the variable name is exactly `GEMINI_API_KEY` or `GOOGLE_API_KEY`
3. Ensure there are no spaces around the `=` sign
4. Make sure you're using the actual API key, not the placeholder text
5. Restart your development server after making changes

## For Production Deployment

When deploying to production, make sure to set the environment variable in your hosting platform's configuration (e.g., Vercel Environment Variables, Firebase environment variables, etc.).

The API key is only used server-side for Genkit flows, so it remains secure and is not exposed to the client.