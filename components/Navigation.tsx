
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
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b ${
          isMenuOpen 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-white/95 backdrop-blur-md border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-2 transition-colors duration-300 group outline-none"
            >
              <span className={`text-xl md:text-2xl font-serif font-bold tracking-tight transition-colors ${
                isMenuOpen ? 'text-white' : 'text-slate-900 group-hover:text-amber-600'
              }`}>
                MILEDESIGNS
              </span>
              <div className={`hidden sm:block h-6 w-px transition-colors ${
                isMenuOpen ? 'bg-slate-700' : 'bg-slate-300'
              }`}></div>
              <span className={`hidden sm:block text-[10px] md:text-xs tracking-widest uppercase font-bold transition-colors ${
                isMenuOpen ? 'text-slate-400' : 'text-slate-500 group-hover:text-slate-700'
              }`}>
                Design & Build
              </span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-slate-600">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className="hover:text-amber-600 transition-colors py-2"
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Inquiry Button & Mobile Toggle */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => handleNavClick('contact')} 
                className={`hidden sm:block px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg ${
                  isMenuOpen 
                    ? 'bg-amber-600 text-white hover:bg-amber-500' 
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/10'
                }`}
              >
                Inquiry
              </button>
              
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`lg:hidden p-2.5 rounded-xl transition-all duration-300 ${
                  isMenuOpen 
                    ? 'bg-white/10 text-white hover:bg-white/20' 
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          className={`lg:hidden fixed inset-x-0 bottom-0 top-[64px] md:top-[80px] z-40 bg-slate-900 transition-all duration-500 ease-in-out ${
            isMenuOpen 
              ? 'opacity-100 translate-y-0 visible' 
              : 'opacity-0 -translate-y-4 invisible pointer-events-none'
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-6 px-6 pb-12">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="group w-full max-w-xs py-4 text-2xl md:text-3xl font-serif font-bold text-white hover:text-amber-400 transition-colors relative"
              >
                <span className="relative z-10">{link.name}</span>
                <div className="absolute inset-0 bg-white/5 rounded-2xl scale-95 opacity-0 group-active:opacity-100 group-active:scale-100 transition-all"></div>
              </button>
            ))}
            <div className="w-full max-w-xs pt-6 border-t border-slate-800">
              <button 
                onClick={() => handleNavClick('contact')}
                className="w-full bg-amber-600 text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-2xl shadow-amber-600/20 active:scale-95 transition-transform"
              >
                Start Inquiry
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;