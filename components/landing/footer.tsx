'use client';

import { Globe, Mail } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="bg-brand-primary text-white w-full py-16 mt-20">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 gap-12 max-w-7xl mx-auto">
        <div className="flex flex-col gap-4">
          <span className="text-2xl font-bold tracking-tighter">CORTEX</span>
          <p className="text-xs text-brand-gray-300 font-medium">
            © 2026 Cortex Airlines. Luxo de Precisão.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-12">
          {['Privacidade', 'Termos de Uso', 'Contato'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs text-brand-gray-300 font-medium hover:text-white transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="flex gap-8">
          <Globe className="w-5 h-5 cursor-pointer opacity-60 hover:opacity-100 transition-opacity" />
          <Mail className="w-5 h-5 cursor-pointer opacity-60 hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </footer>
  );
}
