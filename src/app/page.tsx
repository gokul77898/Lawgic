import { LawgicApp } from '@/components/lawgic-app';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto">
          <Logo />
        </div>
      </header>
      <main className="flex-grow p-4 md:p-8">
        <LawgicApp />
      </main>
      <footer className="p-4 text-center text-xs text-muted-foreground border-t">
        <div className="max-w-4xl mx-auto">
          <p>
            <strong>Disclaimer:</strong> This tool is for informational purposes only and does not constitute legal advice. The generated infographics are based on AI analysis and may not be fully accurate or comprehensive. Always consult with a qualified legal professional for any legal concerns.
          </p>
        </div>
      </footer>
    </div>
  );
}
