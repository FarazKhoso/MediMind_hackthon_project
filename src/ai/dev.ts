import { config } from 'dotenv';
config();

import '@/ai/flows/fetch-patient-data.ts';
import '@/ai/flows/confidence-threshold-check.ts';
import '@/ai/flows/ai-health-query.ts';
import '@/ai/flows/doctor-handoff-initiation.ts';
import '@/ai/flows/disease-tracking-agent.ts';
