
import React, { useState } from 'react';

interface NavigationProps {
  onNavClick: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onNavClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (section: string) => {
    onNavClick(section);
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Portfolio', id: 'portfolio' },
    { name: 'Testimonials', id: 'testimonials' },
    { name: 'Estimator', id: 'calculator' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-xl md:text-2xl font-serif font-bold text-slate-900 tracking-tight">STRUCTURA</span>
              <div className="hidden sm:block h-6 w-px bg-slate-300"></div>
              <span className="hidden sm:block text-[10px] md:text-xs tracking-widest text-slate-500 uppercase font-bold">Design & Build</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-slate-600">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className="hover:text-amber-600 transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Inquiry Button & Mobile Toggle */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => handleNavClick('contact')} 
                className="hidden sm:block bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
              >
                Inquiry
              </button>
              
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-amber-600 transition-colors"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`lg:hidden fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-xl transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
          <div className="flex flex-col items-center justify-center h-full space-y-8 px-6 text-center">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-2xl md:text-3xl font-serif font-bold text-white hover:text-amber-400 transition-colors"
              >
                {link.name}
              </button>
            ))}
            <button 
              onClick={() => handleNavClick('contact')}
              className="mt-4 bg-amber-600 text-white px-10 py-4 rounded-full text-lg font-bold w-full max-w-xs shadow-xl shadow-amber-600/20"
            >
              Start Inquiry
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
