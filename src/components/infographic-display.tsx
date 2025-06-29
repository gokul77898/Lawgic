'use client';

import type { InfographicData } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Lightbulb, BookOpen } from 'lucide-react';
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

  const handleDownload = async () => {
    if (!infographicRef.current) {
        toast({
          title: "Download failed",
          description: "Could not find the infographic content to download.",
          variant: "destructive",
        });
        return;
    }
    
    try {
      const fontUrl = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap';
      const response = await fetch(fontUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch font CSS');
      }
      const fontCss = await response.text();

      const dataUrl = await toPng(infographicRef.current, { 
        cacheBust: true, 
        pixelRatio: 2,
        fontEmbedCss: fontCss
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'lawgic-infographic.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      toast({
        title: "Download failed",
        description: "An error occurred while generating the image. This may be due to a network issue.",
        variant: "destructive",
      });
    }
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
           <div ref={infographicRef} className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-muted">
            <Image
                src={data.imageUrl}
                alt="Generated Infographic Background"
                fill
                className="object-cover"
                data-ai-hint="abstract colorful background"
            />
            <div className="absolute inset-0 flex flex-col p-4 md:p-8 text-white bg-black/20">
                <h3 className="text-xl md:text-3xl font-bold font-headline leading-tight text-center mb-6 drop-shadow-lg">{data.title}</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 flex-grow">
                    {data.points.map((point, i) => (
                      <div key={i} className="space-y-2 drop-shadow-md">
                        <p className="font-bold font-headline text-base md:text-xl">{point.title}</p>
                        <p className="text-xs md:text-base">{point.description}</p>
                      </div>
                    ))}
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
        
        <div>
            <h3 className="flex items-center gap-2 font-headline text-lg font-semibold text-primary mb-3">
              <Lightbulb className="w-5 h-5" />
              Key Points
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {data.points.map((point, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-primary/90">{point.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{point.description}</p>
                </div>
              ))}
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
