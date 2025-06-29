'use client';

import type { InfographicData } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Image as ImageIcon, Scale, BookOpen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

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
    if (!data?.imageUrl) {
        toast({
          title: "Image not ready",
          description: "The infographic image has not been generated yet.",
          variant: "destructive",
        });
        return;
    }
    const link = document.createElement('a');
    link.href = data.imageUrl;
    link.download = 'lawgic-infographic.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="h-full shadow-lg" id="infographic-content">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-2xl">{data.title}</CardTitle>
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
            <ImageIcon className="w-5 h-5" />
            Generated Infographic
          </h3>
          <div className="mt-3 relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-muted/30">
            <Image
                src={data.imageUrl}
                alt="Generated Infographic"
                fill
                className="object-contain"
                data-ai-hint="infographic legal balance"
            />
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="flex items-center gap-2 font-headline text-lg font-semibold text-primary">
            <BookOpen className="w-5 h-5" />
            Summary
          </h3>
          <p className="text-muted-foreground text-sm mt-2">{data.summary}</p>
        </div>

        <Separator />
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="flex items-center gap-2 font-headline text-lg font-semibold text-primary">
              <Scale className="w-5 h-5" />
              {data.leftScale.concept}
            </h3>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside">
              {data.leftScale.details.map((item, index) => (
                <li key={index} className="text-muted-foreground">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="flex items-center gap-2 font-headline text-lg font-semibold text-primary">
              <Scale className="w-5 h-5" />
              {data.rightScale.concept}
            </h3>
            <ul className="mt-3 space-y-2 text-sm list-disc list-inside">
              {data.rightScale.details.map((item, index) => (
                <li key={index} className="text-muted-foreground">{item}</li>
              ))}
            </ul>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
