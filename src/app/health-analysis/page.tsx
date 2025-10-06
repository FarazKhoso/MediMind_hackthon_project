
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { healthDataAnalysis, HealthDataAnalysisInput, HealthDataAnalysisOutput, HealthDataAnalysisInputSchema } from '@/ai/flows/health-data-analysis';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SidebarTrigger } from '@/components/ui/sidebar';

type FormData = HealthDataAnalysisInput;

export default function HealthAnalysisPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HealthDataAnalysisOutput | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(HealthDataAnalysisInputSchema),
    defaultValues: {
      bloodPressure: "",
      bloodSugar: "",
      heartRate: undefined,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await healthDataAnalysis(data);
      setResult(response);
    } catch (error) {
      console.error("Error calling health data analysis agent:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm z-10">
        <h1 className="text-xl font-headline font-bold">Health Data Analysis</h1>
        <SidebarTrigger />
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Vitals</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="bloodPressure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Pressure (e.g., 120/80)</FormLabel>
                        <FormControl>
                          <Input placeholder="120/80" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bloodSugar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Sugar (e.g., 90 mg/dL)</FormLabel>
                        <FormControl>
                          <Input placeholder="90 mg/dL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="heartRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heart Rate (bpm)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="72" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Analyze Health
                  </Button>
                </form>
              </Form>
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
                  <CardTitle>AI Analysis Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <h3 className="font-bold font-headline">Risk Analysis</h3>
                    <p className="text-foreground/80">{result.riskAnalysis}</p>
                  </div>
                  <div>
                    <h3 className="font-bold font-headline">Recommendations</h3>
                    <p className="text-foreground/80">{result.recommendations}</p>
                  </div>
                  {result.isDoctorAlertRequired && (
                    <Alert variant="destructive">
                      <ShieldAlert className="h-4 w-4" />
                      <AlertTitle className="font-headline">High Risk Detected!</AlertTitle>
                      <AlertDescription>
                        Aapke readings high-risk zone mein hain. Baraye meharbani fori taur par doctor se rujoo karein.
                      </AlertDescription>
                    </Alert>
                  )}
                   <Alert>
                    <AlertTitle className="font-headline">Disclaimer</AlertTitle>
                    <AlertDescription>
                      Yeh AI se bana hai. Doctor se salah lain. Yeh medical salah nahi hai.
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
