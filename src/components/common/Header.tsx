import React from 'react';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#05070A]/85 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#top" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg">
          <Logo size={28} />
        </a>

        <nav className="flex items-center gap-5 sm:gap-6 text-sm text-slate-400">
          <a href="#about" className="hover:text-white transition-colors">
            About
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
};
