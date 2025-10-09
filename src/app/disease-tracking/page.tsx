
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { diseaseTrackingAgent } from '@/ai/flows/disease-tracking-agent';
import type { DiseaseTrackingOutput } from '@/ai/flows/disease-tracking-agent';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AppHeader } from '@/components/header';


const mockData = {
    "Dengue": {
        "cases": {
            "Karachi": [
                {"case_id": "karachi_1", "date": "2025-10-06", "symptoms": "fever, headache", "severity": "medium"},
                {"case_id": "karachi_2", "date": "2025-10-06", "symptoms": "fever, headache", "severity": "medium"},
                {"case_id": "karachi_3", "date": "2025-10-06", "symptoms": "fever, headache", "severity": "medium"},
                {"case_id": "karachi_4", "date": "2025-10-06", "symptoms": "fever, headache", "severity": "medium"},
                {"case_id": "karachi_5", "date": "2025-10-06", "symptoms": "fever, headache", "severity": "medium"},
                {"case_id": "karachi_6", "date": "2025-10-06", "symptoms": "fever, headache", "severity": "medium"},
                {"case_id": "karachi_7", "date": "2025-10-06", "symptoms": "fever, headache", "severity": "medium"},
                {"case_id": "karachi_8", "date": "2025-10-06", "symptoms": "fever, headache", "severity": "medium"},
                {"case_id": "karachi_9", "date": "2025-10-06", "symptoms": "fever, headache", "severity": "medium"},
                {"case_id": "karachi_10", "date": "2025-10-06", "symptoms": "fever, headache", "severity": "medium"}
            ],
            "Lahore": [
                {"case_id": "lahore_1", "date": "2025-10-06", "symptoms": "fever, joint pain", "severity": "high"},
                {"case_id": "lahore_2", "date": "2025-10-06", "symptoms": "fever, joint pain", "severity": "high"},
                {"case_id": "lahore_3", "date": "2025-10-06", "symptoms": "fever, joint pain", "severity": "high"},
                {"case_id": "lahore_4", "date": "2025-10-06", "symptoms": "fever, joint pain", "severity": "high"},
                {"case_id": "lahore_5", "date": "2025-10-06", "symptoms": "fever, joint pain", "severity": "high"},
                {"case_id": "lahore_6", "date": "2025-10-06", "symptoms": "fever, joint pain", "severity": "high"},
                {"case_id": "lahore_7", "date": "2025-10-06", "symptoms": "fever, joint pain", "severity": "high"},
                {"case_id": "lahore_8", "date": "2025-10-06", "symptoms": "fever, joint pain", "severity": "high"},
                {"case_id": "lahore_9", "date": "2025-10-06", "symptoms": "fever, joint pain", "severity": "high"},
                {"case_id": "lahore_10", "date": "2025-10-06", "symptoms": "fever, joint pain", "severity": "high"}
            ]
        }
    }
};

export default function DiseaseTrackingPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseTrackingOutput | null>(null);
  const [jsonData, setJsonData] = useState(JSON.stringify(mockData, null, 2));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const parsedData = JSON.parse(jsonData);
      const disease = Object.keys(parsedData)[0];
      const casesByCity = parsedData[disease].cases;
      
      const response = await diseaseTrackingAgent({ disease, casesByCity });
      setResult(response);
    } catch (error) {
      console.error("Error calling disease tracking agent:", error);
      // Handle error display to the user
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm z-10 md:hidden">
        <h1 className="text-xl font-headline font-bold">Disease Outbreak Tracking</h1>
        <AppHeader />
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Reported Cases Data (JSON)</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="jsonData">JSON Data</Label>
                  <Textarea
                    id="jsonData"
                    value={jsonData}
                    onChange={(e) => setJsonData(e.target.value)}
                    className="min-h-[300px] font-mono text-xs"
                  />
                </div>

                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Analyze Data
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            {loading && (
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}

            {result && (
              <Card className="animate-in fade-in">
                <CardHeader>
                  <CardTitle>Analysis & Prediction</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <h3 className="font-bold font-headline">Prediction</h3>
                    <p className="text-foreground/80">{result.prediction}</p>
                  </div>
                  <div>
                    <h3 className="font-bold font-headline">Hotspots</h3>
                    <ul className="list-disc list-inside text-foreground/80">
                      {result.hotspots.map((hotspot) => (
                        <li key={hotspot}>{hotspot}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold font-headline">Recommendations</h3>
                    <p className="text-foreground/80">{result.recommendations}</p>
                  </div>
                  <Alert>
                    <AlertTitle className="font-headline">Disclaimer</AlertTitle>
                    <AlertDescription>
                      Confidence: {(result.confidenceScore * 100).toFixed(0)}%. Yeh AI se bana hai. Doctor se salah lain. Yeh medical salah nahi hai.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
