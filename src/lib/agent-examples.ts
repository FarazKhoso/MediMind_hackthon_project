
type AgentExamples = {
    [key: string]: {
        greeting: string;
        queries: string[];
    }
}

export const agentExamples: AgentExamples = {
    "default": {
        greeting: "Your personal AI health assistant.",
        queries: [
            "What are the symptoms of a common cold?",
            "How can I improve my sleep quality?",
            "Tell me about intermittent fasting.",
            "What's a healthy diet for high blood pressure?",
        ]
    },
    "Cardiologist": {
        greeting: "Welcome to the Cardiology AI Agent.",
        queries: [
            "What are the warning signs of a heart attack?",
            "How can I lower my cholesterol through diet?",
            "Explain what blood pressure numbers mean.",
            "What are common treatments for atrial fibrillation?",
        ]
    },
    "Dentist": {
        greeting: "Welcome to the Dental AI Agent.",
        queries: [
            "What is the best way to treat a toothache at home?",
            "How can I prevent gum disease?",
            "What are the pros and cons of dental implants?",
            "Why are my teeth sensitive to cold?",
        ]
    },
    "Pediatrician": {
        greeting: "Welcome to the Pediatrics AI Agent.",
        queries: [
            "What is a normal fever for a 2-year-old?",
            "When should my baby start eating solid foods?",
            "How to handle common skin rashes in infants?",
            "What's the recommended vaccination schedule?",
        ]
    },
    "Neurologist": {
        greeting: "Welcome to the Neurology AI Agent.",
        queries: [
            "What are the early symptoms of a migraine?",
            "What's the difference between a stroke and an aneurysm?",
            "How can I improve my memory?",
            "What are the common treatments for epilepsy?",
        ]
    },
    "Orthopedic": {
        greeting: "Welcome to the Orthopedic AI Agent.",
        queries: [
            "How do I treat a sprained ankle?",
            "What are some exercises for lower back pain?",
            "What is arthritis and how is it managed?",
            "When should I see a doctor for knee pain?",
        ]
    },
    "General Physician": {
        greeting: "Welcome to the General Physician AI Agent.",
        queries: [
            "What are the symptoms of a common cold?",
            "How can I improve my sleep quality?",
            "Tell me about intermittent fasting.",
            "What's a healthy diet for high blood pressure?",
        ]
    }
}
