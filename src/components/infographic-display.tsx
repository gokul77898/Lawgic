'use client';

import type { InfographicData } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Scale, BookOpen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useRef } from 'react';
import { toPng } from 'html-to-image';

export function InfographicDisplay({ data }: { data: InfographicData | null }) {
  const { toast } = useToast();
  const infographicRef = useRef<HTMLDivElement>(null);


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
    if (!infographicRef.current) {
        toast({
          title: "Download failed",
          description: "Could not find the infographic content to download.",
          variant: "destructive",
        });
        return;
    }
    toPng(infographicRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'lawgic-infographic.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Download failed",
          description: "An error occurred while generating the image.",
          variant: "destructive",
        });
      });
  };

  return (
    <Card className="h-full shadow-lg">
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
        <div id="infographic-content-wrapper">
          <div ref={infographicRef} className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-muted/30">
            <Image
                src={data.imageUrl}
                alt="Generated Infographic Background"
                fill
                className="object-contain"
                data-ai-hint="infographic legal balance"
            />
            <div className="absolute inset-0 flex flex-col p-4 md:p-6 text-black">
                <h3 className="text-center text-xl md:text-2xl font-bold font-headline shrink-0">{data.title}</h3>
                <div className="flex-grow flex items-center justify-around gap-4 pt-4">
                    <div className="w-2/5 text-left space-y-2">
                        <p className="font-bold font-headline text-base md:text-lg">{data.leftScale.concept}</p>
                        <p className="text-xs md:text-sm">{data.leftScale.details.join(' ')}</p>
                    </div>
                    <div className="w-2/5 text-left space-y-2">
                        <p className="font-bold font-headline text-base md:text-lg">{data.rightScale.concept}</p>
                        <p className="text-xs md:text-sm">{data.rightScale.details.join(' ')}</p>
                    </div>
                </div>
            </div>
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
