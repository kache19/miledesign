
import React, { useEffect, useRef, useState } from 'react';

interface NavigationProps {
  onNavClick: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onNavClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const menuToggleRef = useRef<HTMLButtonElement | null>(null);

  const handleNavClick = (section: string) => {
    onNavClick(section);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const firstButton = mobileMenuRef.current?.querySelector<HTMLButtonElement>('button');
    firstButton?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsMenuOpen(false);
      menuToggleRef.current?.focus();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;
    const focusable = mobileMenuRef.current?.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])');
    if (!focusable || focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Portfolio', id: 'portfolio' },
    { name: 'Team', id: 'team' },
    { name: 'Vlog', id: 'vlog' },
    { name: 'Location', id: 'location' },
    { name: 'Testimonials', id: 'testimonials' },
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
              <span className={`text-lg md:text-xl font-serif font-bold tracking-tight transition-colors ${
                isMenuOpen ? 'text-white' : 'text-slate-900 group-hover:text-terracotta'
              }`}>
                MILEDESIGN CONSTRUCTION
              </span>
              <div className={`hidden sm:block h-6 w-px transition-colors ${
                isMenuOpen ? 'bg-slate-700' : 'bg-slate-300'
              }`}></div>
              <span className={`hidden sm:block text-[9px] md:text-[10px] tracking-widest uppercase font-bold transition-colors ${
                isMenuOpen ? 'text-slate-400' : 'text-slate-500 group-hover:text-slate-700'
              }`}>
                PROJESCT MANAGEMENT
              </span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-slate-600">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className="hover:text-terracotta transition-colors py-2"
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
                    ? 'bg-terracotta text-white hover:bg-terracotta-hover' 
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/10'
                }`}
              >
                Inquiry
              </button>
              
              <button 
                ref={menuToggleRef}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`lg:hidden p-2.5 rounded-xl transition-all duration-300 ${
                  isMenuOpen 
                    ? 'bg-white/10 text-white hover:bg-white/20' 
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
                aria-label="Toggle Menu"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-nav-menu"
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
          id="mobile-nav-menu"
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          className={`lg:hidden fixed inset-x-0 bottom-0 top-[64px] md:top-[80px] z-40 bg-slate-900 transition-all duration-500 ease-in-out ${
            isMenuOpen 
              ? 'opacity-100 translate-y-0 visible' 
              : 'opacity-0 -translate-y-4 invisible pointer-events-none'
          }`}
          onKeyDown={handleMenuKeyDown}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-6 px-6 pb-12">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="group w-full max-w-xs py-4 text-2xl md:text-3xl font-serif font-bold text-white hover:text-skyblue transition-colors relative"
              >
                <span className="relative z-10">{link.name}</span>
                <div className="absolute inset-0 bg-white/5 rounded-2xl scale-95 opacity-0 group-active:opacity-100 group-active:scale-100 transition-all"></div>
              </button>
            ))}
            <div className="w-full max-w-xs pt-6 border-t border-slate-800">
              <button 
                onClick={() => handleNavClick('contact')}
                className="w-full bg-terracotta text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-2xl shadow-terracotta/20 active:scale-95 transition-transform"
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
