
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { medicineReminder, MedicineReminderInput, MedicineReminderOutput, MedicineReminderInputSchema } from '@/ai/flows/medicine-reminder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, BellRing } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SidebarTrigger } from '@/components/ui/sidebar';

type FormData = MedicineReminderInput;

export default function MedicineReminderPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MedicineReminderOutput | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(MedicineReminderInputSchema),
    defaultValues: {
      request: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await medicineReminder(data);
      setResult(response);
    } catch (error) {
      console.error("Error calling medicine reminder agent:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm z-10">
        <h1 className="text-xl font-headline font-bold">Medicine & Vaccination Reminders</h1>
        <SidebarTrigger />
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Set a New Reminder</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="request"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reminder Request</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., 'Set a reminder for Panadol every 6 hours' or 'Polio vaccine is due on 10/10/2025'"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Set Reminder
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
                  <CardTitle className="flex items-center gap-2">
                    <BellRing className="text-primary"/>
                    Reminder Set Successfully
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <p className="text-lg text-foreground/90">{result.confirmation}</p>
                  <div className="p-4 bg-muted/50 rounded-md">
                      <h4 className="font-bold font-headline mb-2">Schedule Details:</h4>
                      <p><strong>Medicine/Vaccine:</strong> {result.schedule.medicineOrVaccine}</p>
                      {result.schedule.frequency && <p><strong>Frequency:</strong> {result.schedule.frequency}</p>}
                      {result.schedule.date && <p><strong>Date:</strong> {result.schedule.date}</p>}
                      {result.schedule.time && <p><strong>Time:</strong> {result.schedule.time}</p>}
                  </div>
                   <Alert>
                    <AlertTitle className="font-headline">Note</AlertTitle>
                    <AlertDescription>
                      This is a prototype. In a real app, you would receive push notifications via FCM.
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
