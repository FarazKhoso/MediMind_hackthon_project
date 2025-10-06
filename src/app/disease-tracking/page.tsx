
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { diseaseTrackingAgent, DiseaseTrackingOutput } from '@/ai/flows/disease-tracking-agent';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DiseaseTrackingPage() {
  const [disease, setDisease] = useState('Dengue');
  const [cases, setCases] = useState([
    { location: 'Lahore', count: 10 },
    { location: 'Karachi', count: 5 },
  ]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseTrackingOutput | null>(null);

  const handleCaseChange = (index: number, field: 'location' | 'count', value: string) => {
    const newCases = [...cases];
    if (field === 'count') {
      newCases[index][field] = parseInt(value, 10) || 0;
    } else {
      newCases[index][field] = value;
    }
    setCases(newCases);
  };

  const addCaseEntry = () => {
    setCases([...cases, { location: '', count: 0 }]);
  };

  const removeCaseEntry = (index: number) => {
    const newCases = cases.filter((_, i) => i !== index);
    setCases(newCases);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await diseaseTrackingAgent({ disease, cases });
      setResult(response);
    } catch (error) {
      console.error("Error calling disease tracking agent:", error);
      // Handle error display to the user
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm z-10">
        <h1 className="text-xl font-headline font-bold">Disease Outbreak Tracking</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Reported Cases Data</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="disease">Disease</Label>
                  <Input
                    id="disease"
                    value={disease}
                    onChange={(e) => setDisease(e.target.value)}
                    placeholder="e.g., Dengue, Flu"
                  />
                </div>

                <div className="space-y-4">
                  <Label>Case Counts by Location</Label>
                  {cases.map((caseItem, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={caseItem.location}
                        onChange={(e) => handleCaseChange(index, 'location', e.target.value)}
                        placeholder="Location (e.g., Lahore)"
                        className="w-1/2"
                      />
                      <Input
                        type="number"
                        value={caseItem.count}
                        onChange={(e) => handleCaseChange(index, 'count', e.target.value)}
                        placeholder="Case count"
                        className="w-1/2"
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeCaseEntry(index)} type="button">
                        &times;
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addCaseEntry} type="button">
                    Add Location
                  </Button>
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
