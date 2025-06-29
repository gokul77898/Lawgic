'use client';

import type { InfographicData } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, Scale } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

export function InfographicDisplay({ data }: { data: InfographicData | null }) {
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
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Generated Infographic</CardTitle>
        <CardDescription className="mt-1">A visual breakdown of your document.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border bg-[#f5f1ec] p-4 sm:p-6 md:p-8 text-[#4a2e2a]">
          {/* Infographic Header */}
          <header className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-4 opacity-70">
              <Scale className="w-5 h-5" />
              <span>Government of Lawgic</span>
            </div>
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
