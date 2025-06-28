'use client';

import type { InfographicData } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, BrainCircuit, Lightbulb, Share2, Download, ListChecks } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export function InfographicDisplay({ data }: { data: InfographicData | null }) {
  const { toast } = useToast();

  if (!data) {
    return (
      <Card className="h-full flex flex-col items-center justify-center text-center p-8 border-dashed shadow-none">
        <div className="p-4 bg-primary/10 rounded-full mb-4">
          <FileText className="w-12 h-12 text-primary" />
        </div>
        <CardTitle className="font-headline mb-2 text-2xl">Your Infographic Awaits</CardTitle>
        <CardDescription>
          Submit a legal document, and we'll generate a visual summary for you here.
        </CardDescription>
      </Card>
    );
  }

  const handleDownload = () => {
    toast({
      title: "Feature Coming Soon!",
      description: "Download functionality is being implemented. For now, you can use your browser's print-to-PDF feature.",
    });
  };

  return (
    <Card className="h-full shadow-lg" id="infographic-content">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-2xl">Legal Analysis</CardTitle>
            <CardDescription className="mt-1">A visual breakdown of your document.</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download Infographic">
            <Download className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="flex items-center gap-2 font-headline text-lg font-semibold text-primary">
            <ListChecks className="w-5 h-5" />
            Summary
          </h3>
          <p className="text-muted-foreground text-sm mt-2">{data.summary}</p>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="flex items-center gap-2 font-headline text-lg font-semibold text-primary">
            <Lightbulb className="w-5 h-5" />
            Key Concepts
          </h3>
          <div className="flex flex-wrap gap-2 mt-3">
            {data.concepts.map((concept) => (
              <Badge key={concept} variant="secondary" className="text-sm font-medium px-3 py-1 bg-accent/10 text-accent-foreground border-accent/20 shadow-sm">
                {concept}
              </Badge>
            ))}
          </div>
        </div>
        
        <Separator />

        <div>
          <h3 className="flex items-center gap-2 font-headline text-lg font-semibold text-primary">
            <Share2 className="w-5 h-5" />
            Relationships
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-foreground/80">
            {data.relationships.map((relationship) => (
              <li key={relationship} className="flex items-start">
                <span className="text-accent mr-3 mt-1">&#9679;</span>
                <span>{relationship}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Separator />

        <div>
          <h3 className="flex items-center gap-2 font-headline text-lg font-semibold text-primary">
            <BrainCircuit className="w-5 h-5" />
            Suggested Structure
          </h3>
          <blockquote className="mt-2 pl-4 border-l-2 border-accent text-sm italic text-muted-foreground">
            "{data.structure}"
          </blockquote>
        </div>
      </CardContent>
    </Card>
  );
}
