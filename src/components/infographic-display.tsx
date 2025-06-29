'use client';

import type { InfographicData } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Download, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Button } from './ui/button';
import { toPng } from 'html-to-image';
import { useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

async function downloadImage(dataUrl: string, fileName: string) {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  link.click();
}

async function fetchFont(url: string) {
    const response = await fetch(url);
    const cssText = await response.text();
    return cssText;
}

export function InfographicDisplay({ data }: { data: InfographicData | null }) {
  const infographicRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDownload = async () => {
    const node = infographicRef.current;
    if (!node) return;

    try {
      // Wait for all images inside the node to load fully.
      // This prevents blank images in the downloaded PNG.
      const images = node.getElementsByTagName('img');
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve; // Also resolve on error to not block forever
          });
        })
      );

      const fontCss = await Promise.all([
        fetchFont('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap'),
        fetchFont('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap'),
      ]);

      const dataUrl = await toPng(node, {
        cacheBust: true,
        fontEmbedCSS: fontCss.join('\n'),
        pixelRatio: 2,
      });
      downloadImage(dataUrl, 'lawgic-infographic.png');
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: 'Could not generate the infographic image. Please try again.',
      });
    }
  };


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

  return (
    <Card className="h-full shadow-lg overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline text-2xl">Generated Infographic</CardTitle>
          <CardDescription className="mt-1">A visual breakdown of your document.</CardDescription>
        </div>
        <Button onClick={handleDownload} variant="outline" size="icon">
            <Download className="h-5 w-5" />
            <span className="sr-only">Download</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div ref={infographicRef} className="rounded-lg border bg-[#f5f1ec] p-4 sm:p-6 md:p-8 text-[#4a2e2a]">
          {/* Infographic Header */}
          <header className="flex flex-col items-center mb-8">
            <div className="w-full bg-[#8c5a4f] text-white font-headline text-center py-3 px-4 rounded-lg shadow-md">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-wide">{data.title}</h1>
            </div>
          </header>

          {/* Infographic Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
            {data.points.map((point, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-3">
                <div className="relative w-full aspect-square max-w-[250px] bg-white/50 rounded-lg shadow-sm overflow-hidden border-2 border-[#d3c2b8]">
                   <Image
                      src={point.imageUrl}
                      alt={`Illustration for ${point.title}`}
                      fill
                      className="object-contain p-2"
                      data-ai-hint="infographic illustration"
                   />
                </div>
                <div className="flex-grow">
                  <h3 className="font-headline font-bold text-lg leading-tight text-[#6b443c]">{point.title}</h3>
                  <p className="mt-1 text-sm">{point.description}</p>
                </div>
              </div>
            ))}
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

      </CardContent>
    </Card>
  );
}
