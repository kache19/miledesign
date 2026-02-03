
import React, { useEffect, useRef, useState, useMemo } from 'react';
import Navigation from './components/Navigation';
import CostCalculator from './components/CostCalculator';
import AboutSection from './components/AboutSection';
import Admin from './components/Admin';
import { storageService } from './services/storage';
import { Project, Service, Testimonial } from './types';

const App: React.FC = () => {
  const portfolioRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(2);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State for dynamic data
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const loadData = () => {
    setIsLoading(true);
    try {
      setProjects(storageService.getProjects());
      setServices(storageService.getServices());
      setTestimonials(storageService.getTestimonials());
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const scrollTo = (id: string) => {
    if (selectedProject) {
      setSelectedProject(null);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = window.innerWidth < 768 ? 64 : 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 50);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = window.innerWidth < 768 ? 64 : 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  const allTags = useMemo(() => {
    const tags = new Set<string>(['All']);
    projects.forEach(project => project.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;
    return projects.filter(project => project.tags.includes(activeFilter));
  }, [activeFilter, projects]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [activeFilter]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1280) {
        setItemsPerView(2);
      } else {
        setItemsPerView(2);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -20px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-item');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [selectedProject, activeFilter, projects, isLoading]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullScreenImage(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const totalSlides = Math.ceil(filteredProjects.length / itemsPerView);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, totalSlides));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % Math.max(1, totalSlides));
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
  };

  const renderLightBox = () => {
    if (!fullScreenImage) return null;
    return (
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-300 p-2 sm:p-4 md:p-10"
        onClick={() => setFullScreenImage(null)}
      >
        <button 
          className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:text-amber-500 transition-colors z-[110] bg-white/5 p-2 rounded-full"
          onClick={() => setFullScreenImage(null)}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img 
          src={fullScreenImage} 
          alt="Enlarged view" 
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-500"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-amber-600/20 border-t-amber-600 rounded-full animate-spin mb-6"></div>
        <div className="text-white font-serif text-2xl animate-pulse tracking-tighter">MILEDESIGNS</div>
      </div>
    );
  }

  if (selectedProject) {
    return (
      <div className="min-h-screen bg-slate-50 animate-in fade-in duration-700">
        <Navigation onNavClick={(section) => scrollTo(section)} />
        
        <div className="pt-20 pb-16 md:pt-32 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={closeProjectDetails}
            className="group mb-6 md:mb-8 flex items-center text-slate-500 hover:text-amber-600 transition-colors font-bold text-[10px] md:text-sm uppercase tracking-widest"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Portfolio
          </button>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-start">
            <div className="space-y-4 md:space-y-8">
              <div 
                className="rounded-2xl md:rounded-[2rem] overflow-hidden shadow-xl relative group cursor-zoom-in"
                onClick={() => setFullScreenImage(selectedProject.imageUrl)}
              >
                <img 
                  src={selectedProject.imageUrl} 
                  alt={selectedProject.title} 
                  className="w-full h-auto object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-md p-3 md:p-4 rounded-full border border-white/30 text-white">
                    <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {selectedProject.gallery && selectedProject.gallery.length > 0 && (
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  {selectedProject.gallery.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="rounded-xl md:rounded-2xl overflow-hidden shadow-lg aspect-square relative group cursor-zoom-in"
                      onClick={() => setFullScreenImage(img)}
                    >
                      <img 
                        src={img} 
                        alt={`${selectedProject.title} gallery ${idx}`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 lg:pt-0">
              <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                {selectedProject.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-amber-600/10 text-amber-600 text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="inline-block px-4 py-1.5 bg-slate-900 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-4 md:mb-6">
                {selectedProject.category} • {selectedProject.year}
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 mb-4 md:mb-6 leading-tight">{selectedProject.title}</h1>
              <div className="flex items-center text-slate-500 mb-8 md:mb-10 font-medium text-sm md:text-base">
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {selectedProject.location}
              </div>

              <div className="prose prose-sm md:prose-lg text-slate-600 leading-relaxed mb-8 md:mb-12 max-w-none">
                <p>{selectedProject.description || "No description provided for this architectural marvel."}</p>
              </div>

              {selectedProject.features && selectedProject.features.length > 0 && (
                <div className="border-t border-slate-200 pt-8 md:pt-10">
                  <h3 className="text-[10px] md:text-sm font-bold text-slate-900 mb-6 md:mb-8 uppercase tracking-[0.3em]">Project Highlights</h3>
                  <div className="grid sm:grid-cols-2 gap-y-4 gap-x-10">
                    {selectedProject.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start text-slate-700">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-500 mt-1.5 mr-3 md:mr-4 shrink-0"></div>
                        <span className="font-semibold text-xs md:text-sm leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-12 md:mt-16 p-6 md:p-10 bg-slate-900 rounded-2xl md:rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-600/20 transition-colors"></div>
                <h4 className="text-xl md:text-2xl font-serif font-bold mb-3 md:mb-4 relative z-10">Start your project</h4>
                <p className="text-slate-400 mb-8 md:mb-10 text-[11px] md:text-sm leading-relaxed relative z-10">Our architectural experts are ready to draft your vision into reality. Let's discuss requirements and feasibility today.</p>
                <button 
                  onClick={() => scrollTo('contact')}
                  className="w-full py-4 bg-amber-600 text-white rounded-xl md:rounded-2xl font-bold hover:bg-amber-500 transition-all shadow-xl shadow-amber-600/10 active:scale-95 text-xs md:text-base"
                >
                  Consult an Architect
                </button>
              </div>
            </div>
          </div>
        </div>

        {renderLightBox()}

        <footer className="bg-slate-950 text-slate-500 py-12 border-t border-slate-900 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-2xl font-serif font-bold text-white tracking-tighter">MILEDESIGNS</span>
            </div>
            <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold">© 2024 Design & Build Collective</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navigation onNavClick={(section) => scrollTo(section)} />

      {/* Hero Section */}
      <section id="home" className="relative min-h-[100svh] flex flex-col justify-center pt-20 overflow-hidden bg-slate-950 shrink-0">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=2070" 
            className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
            alt="Minimalist Architecture"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-10 pb-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center space-x-3 mb-6 md:mb-8 reveal-item">
              <span className="h-px w-6 md:w-8 bg-amber-600"></span>
              <span className="text-amber-500 text-[9px] md:text-xs font-bold uppercase tracking-[0.4em]">Multi-Disciplinary Design</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 md:mb-8 leading-[1.1] reveal-item">
              Architecture that <br className="hidden sm:block" />
              <span className="text-amber-500 italic">Transcends</span> Function.
            </h1>
            
            <p className="text-base md:text-xl lg:text-2xl text-slate-300 mb-8 md:mb-12 max-w-2xl leading-relaxed font-light reveal-item">
              We create structures that are emotionally resonant and technically flawless. Modern design, engineered for a legacy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 reveal-item">
              <button 
                onClick={() => scrollTo('portfolio')}
                className="group relative bg-amber-600 text-white px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-sm md:text-lg overflow-hidden transition-all shadow-2xl active:scale-95 text-center"
              >
                <span className="relative z-10">Our Portfolio</span>
                <div className="absolute inset-0 bg-amber-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
              
              <button 
                onClick={() => scrollTo('contact')}
                className="flex items-center justify-center space-x-3 bg-white/5 backdrop-blur-xl border border-white/10 text-white px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-sm md:text-lg hover:bg-white/10 transition-all group active:scale-95 text-center"
              >
                <span>Consultation</span>
                <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Quick Stats Card - Hidden on Mobile */}
        <div className="hidden lg:block absolute bottom-28 right-8 z-30 reveal-item">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] shadow-2xl w-64">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Pulse</span>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-serif font-bold text-white">12</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Active Build Sites</div>
              </div>
              <div>
                <div className="text-2xl font-serif font-bold text-white">09</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">In Design Phase</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Services Section */}
      <section id="services" className="py-16 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-[10px] md:text-sm font-bold text-amber-600 uppercase tracking-[0.3em] mb-3 md:mb-4">Core Disciplines</h2>
            <h3 className="text-2xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">Mastering Form & Function</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {services.map((service) => (
              <div key={service.id} className="group relative bg-slate-50 rounded-2xl md:rounded-[2rem] p-6 md:p-10 hover:bg-slate-900 transition-all duration-700 cursor-default flex flex-col border border-slate-100 hover:border-slate-800 reveal-item">
                <div className="text-4xl md:text-5xl mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500">{service.icon}</div>
                <h4 className="text-lg md:text-2xl font-serif font-bold mb-3 md:mb-4 text-slate-900 group-hover:text-white">{service.title}</h4>
                <p className="text-slate-600 text-sm md:text-base group-hover:text-slate-400 transition-colors leading-relaxed mb-6 md:mb-8 flex-1">
                  {service.description}
                </p>
                <div className="flex items-center text-amber-600 font-bold text-[10px] md:text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                  Learn Process
                  <svg className="w-3 h-3 md:w-4 md:h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-16 md:py-32 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-10 md:mb-16 gap-6 md:gap-10">
            <div className="max-w-2xl">
              <h2 className="text-[10px] md:text-sm font-bold text-amber-600 uppercase tracking-[0.4em] mb-3 md:mb-4">Showcase</h2>
              <h3 className="text-2xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">Legacy Builds</h3>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setActiveFilter(tag)}
                    className={`px-3 py-2 md:px-5 md:py-2.5 rounded-full text-[9px] md:text-xs font-bold uppercase tracking-widest transition-all ${
                      activeFilter === tag 
                      ? 'bg-slate-900 text-white shadow-xl' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {totalSlides > 1 && (
                <div className="flex space-x-2 shrink-0">
                  <button 
                    onClick={prevSlide}
                    className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:border-slate-900 hover:text-white transition-all text-slate-600 shadow-sm"
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:border-slate-900 hover:text-white transition-all text-slate-600 shadow-sm"
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="relative">
            <div className="overflow-hidden" ref={portfolioRef}>
              <div 
                className="flex transition-transform duration-1000 ease-[cubic-bezier(0.25, 0.1, 0.25, 1)]"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: Math.max(1, totalSlides) }).map((_, slideIdx) => (
                  <div key={slideIdx} className="flex min-w-full gap-4 md:gap-10">
                    {filteredProjects.slice(slideIdx * itemsPerView, (slideIdx + 1) * itemsPerView).map((project) => (
                      <div 
                        key={project.id} 
                        onClick={() => handleProjectClick(project)}
                        className="reveal-item flex-1 group relative bg-white rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-700 cursor-pointer h-[350px] md:h-[500px]"
                      >
                        <img 
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-10">
                          <span className="text-white/60 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] mb-1 md:mb-2">{project.category} • {project.year}</span>
                          <h4 className="text-xl md:text-3xl font-serif font-bold text-white mb-2 md:mb-3">{project.title}</h4>
                          <div className="flex items-center text-slate-300 text-[10px] md:text-sm">
                            <span className="mr-4 md:mr-6">{project.location}</span>
                            <span className="hidden sm:inline-block px-4 py-1.5 bg-white/10 text-[8px] md:text-[9px] font-bold uppercase tracking-widest rounded-full border border-white/10">View Details</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {Array.from({ length: Math.max(0, itemsPerView - filteredProjects.slice(slideIdx * itemsPerView, (slideIdx + 1) * itemsPerView).length) }).map((_, i) => (
                      <div key={`empty-${i}`} className="hidden md:block flex-1"></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            {totalSlides > 1 && (
              <div className="mt-8 md:mt-12 flex justify-center space-x-2 md:space-x-3">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1 md:h-1.5 transition-all duration-500 rounded-full ${currentSlide === idx ? 'w-8 md:w-12 bg-amber-600' : 'w-2 md:w-3 bg-slate-300'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-24">
            <h2 className="text-[10px] md:text-sm font-bold text-amber-600 uppercase tracking-[0.4em] mb-3 md:mb-4">Voices</h2>
            <h3 className="text-2xl md:text-5xl font-serif font-bold text-slate-900">Client Perspectives</h3>
          </div>
          
          <div className="relative overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 w-max md:w-full animate-marquee-mobile md:animate-none">
              {(testimonials.length > 0 ? [...testimonials, ...testimonials] : []).map((t, idx) => (
                <div 
                  key={`${t.id}-${idx}`} 
                  className={`flex flex-col bg-slate-50 p-6 md:p-12 rounded-2xl md:rounded-[2.5rem] border border-slate-100 hover:bg-white transition-all group cursor-default w-[80vw] sm:w-[400px] md:w-auto shrink-0 ${idx >= testimonials.length ? 'md:hidden' : 'flex'}`}
                >
                  <div className="flex text-amber-500 mb-6 md:mb-8 space-x-1">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <svg key={i} className="w-3 h-3 md:w-4 md:h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="mb-6 md:mb-10 flex-1">
                    <p className="text-slate-700 leading-relaxed italic text-sm md:text-lg">"{t.feedback}"</p>
                  </div>
                  <div className="flex items-center pt-6 md:pt-10 border-t border-slate-200/50">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden mr-4 md:mr-5 border-2 border-white shadow-lg">
                      <img src={t.avatarUrl || `https://i.pravatar.cc/150?u=${t.id}`} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h5 className="text-slate-900 font-bold text-xs md:text-base leading-tight">{t.name}</h5>
                      <p className="text-slate-500 text-[8px] md:text-[10px] uppercase tracking-widest font-bold mt-1">{t.projectType}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Estimator Section */}
      <section id="calculator" className="py-16 md:py-32 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-[10px] md:text-sm font-bold text-amber-600 uppercase tracking-[0.4em] mb-3 md:mb-4">Planning</h2>
            <h3 className="text-2xl md:text-5xl font-serif font-bold text-slate-900">Capital Projection</h3>
          </div>
          <div className="reveal-item">
            <CostCalculator />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-32 bg-slate-900 text-white shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-32">
            <div className="reveal-item">
              <h2 className="text-3xl md:text-6xl font-serif font-bold mb-6 md:mb-10 leading-tight">Let's craft your <span className="italic text-amber-500">masterpiece</span>.</h2>
              <p className="text-slate-400 mb-8 md:mb-16 text-sm md:text-xl leading-relaxed font-light">
                Our synthesis of architectural vision and engineering rigor starts with a conversation. Contact our executive team for an initial feasibility review.
              </p>
              <div className="space-y-6 md:space-y-10">
                <div className="flex items-center group">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mr-4 md:mr-6">
                    <span className="text-lg md:text-2xl">📍</span>
                  </div>
                  <div>
                    <h5 className="text-[8px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Global HQ</h5>
                    <span className="text-slate-300 text-sm md:text-lg">772 Industrial Way, NY</span>
                  </div>
                </div>
                <div className="flex items-center group">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mr-4 md:mr-6">
                    <span className="text-lg md:text-2xl">📞</span>
                  </div>
                  <div>
                    <h5 className="text-[8px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Inquiry Line</h5>
                    <span className="text-slate-300 text-sm md:text-lg">+1 (888) MILE-01</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="reveal-item">
              <div className="bg-slate-800/40 p-6 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
                <form className="space-y-6 md:space-y-8">
                  <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">First Name</label>
                      <input type="text" className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 outline-none" placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Last Name</label>
                      <input type="text" className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 outline-none" placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Business Email</label>
                    <input type="email" className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 outline-none" placeholder="j.doe@company.com" />
                  </div>
                  <button type="button" className="w-full bg-amber-600 text-white font-bold py-4 rounded-xl hover:bg-amber-500 transition-all text-xs md:text-base uppercase tracking-widest active:scale-95">
                    Submit Inquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {renderLightBox()}

      {isAdminOpen && <Admin onClose={() => setIsAdminOpen(false)} onDataUpdate={loadData} />}

      <footer className="bg-slate-950 text-slate-600 py-12 md:py-24 border-t border-slate-900 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 mb-10 md:mb-12">
            <span className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tighter">MILEDESIGNS</span>
            <div className="hidden md:block h-6 w-px bg-slate-800"></div>
            <span className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">© 2024 Architectural Collective</span>
          </div>
          <div className="flex justify-center flex-wrap gap-4 md:gap-12 mb-10">
            {['LinkedIn', 'Instagram', 'ArchDaily'].map(social => (
              <a key={social} href="#" className="text-[10px] md:text-sm font-bold hover:text-white transition-colors uppercase tracking-widest">{social}</a>
            ))}
          </div>
          <button 
            onClick={() => setIsAdminOpen(true)}
            className="text-[8px] md:text-[10px] font-bold text-slate-800 uppercase tracking-widest hover:text-amber-600 transition-colors"
          >
            • Admin Portal •
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
