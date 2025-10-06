# **App Name**: MediMind AI

## Core Features:

- AI Consultation: Allows users to input health-related queries, which are then processed by the AI to provide potential insights, risk factors and possible next steps, incorporating guardrails for sensitive topics and disclaimer.
- Data Fetching: The AI tool fetches patient data from Firestore when contextually relevant to the query. Uses data privacy policies to prevent information leaks.
- Confidence Threshold: AI responses are checked against a 95% confidence threshold. If the confidence level is below this threshold, the user is prompted to consult a doctor.
- Doctor Handoff: If the AI determines that the user should consult with a medical professional, the tool initiates a handoff request via FCM to available doctors.
- Consultation Logging: Stores consultation logs with anonymized user data, AI responses, confidence scores, and handoff status.
- Alerting System: Display alerts to make the patient aware that the answer given is AI-generated and should not be considered professional medical advice.
- User Interface: Clean user interface for easy input of queries and review of AI responses, emphasizing clarity and trustworthiness. Display a history of previous queries.
- Offline Support: Enable offline support with local sync.

## Style Guidelines:

- Primary color: Light sky blue (#87CEEB) to evoke feelings of calm, trust, and health. It balances the AI aspect with a familiar medical association.
- Background color: Very light blue (#EBF4FA), near-white, creates a clean and professional look.
- Accent color: Soft lavender (#E6E6FA), positioned between blue and purple on the color wheel, symbolizes knowledge and tranquility, serving as a gentle contrast.
- Body font: 'PT Sans', a humanist sans-serif that combines a modern look and a little warmth or personality.
- Headline font: 'Poppins' (sans-serif) for headings. Note: currently only Google Fonts are supported.
- Use recognizable health-related icons to illustrate consultation status, data privacy levels, and other key actions. Keep consistent line widths and maintain simplicity.
- Ensure clear separation of user input, AI response, disclaimers, and CTAs. Keep handoff CTA distinct.
- Use subtle fade-in effects on new AI responses. A simple loading animation for queries.