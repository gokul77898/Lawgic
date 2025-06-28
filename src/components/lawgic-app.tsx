'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { generateInfographicAction, type InfographicData } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { InfographicDisplay } from '@/components/infographic-display';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState: {
  data: InfographicData | null;
  error: { legalText?: string[] } | string | null;
} = {
  data: null,
  error: null,
};


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Generating...' : 'Create Infographic'}
    </Button>
  );
}

export function LawgicApp() {
  const [state, formAction] = useFormState(generateInfographicAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof state.error === 'string') {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: state.error,
      });
    }
  }, [state, toast]);
  
  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Analyze Legal Text</CardTitle>
          <CardDescription>Paste your legal article or upload a file to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="legalText" className="font-semibold">Paste Text</Label>
              <Textarea
                id="legalText"
                name="legalText"
                placeholder="Paste your legal document here..."
                className="min-h-[250px] bg-background"
                required
              />
              {state.error && typeof state.error !== 'string' && state.error.legalText && (
                <p className="text-sm font-medium text-destructive">{state.error.legalText[0]}</p>
              )}
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="file-upload" className="font-semibold">Or Upload a File</Label>
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent/10 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">PDF, DOCX, TXT (coming soon)</p>
                        </div>
                        <input id="file-upload" type="file" className="hidden" disabled />
                    </label>
                </div>
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      <div className="lg:col-span-1">
        <InfographicDisplay data={state?.data} />
      </div>
    </div>
  );
}
