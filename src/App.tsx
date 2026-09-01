import { useState } from 'react';
import { IntroSequence } from './components/intro/IntroSequence';
import { Header } from './components/common/Header';
import { Hero } from './components/landing/Hero';
import { AnalyzerFlow } from './components/AnalyzerFlow';

export function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <div
      id="top"
      className="min-h-screen bg-[#05070A] text-slate-100 flex flex-col font-sans selection:bg-cyan-400/30 selection:text-cyan-200"
    >
      {!introDone && <IntroSequence onComplete={() => setIntroDone(true)} />}

      <Header />

      <main className="flex-1 px-4 sm:px-6 py-14 sm:py-20">
        <Hero />
        <AnalyzerFlow />
      </main>

      <section id="about" className="max-w-xl mx-auto px-4 py-10 sm:py-14 border-t border-white/[0.06] text-center">
        <h2 className="text-base font-display font-semibold text-white">About MedVision AI</h2>
        <p className="text-slate-400 text-sm mt-3 leading-relaxed">
          MedVision AI uses a deep learning model trained on chest radiographs to screen for visual
          patterns associated with pneumonia. It's built as a screening aid, not a diagnostic tool —
          results should always be reviewed by a qualified healthcare professional.
        </p>
      </section>

      <footer className="border-t border-white/[0.06] py-6 px-4 text-center">
        <p className="text-xs text-slate-600">
          MedVision AI — an AI-based screening tool, not a substitute for professional medical advice.
        </p>
      </footer>
    </div>
  );
}
