
import React, { useEffect, useRef, useState, useMemo } from 'react';
import Navigation from './components/Navigation';
import CostCalculator from './components/CostCalculator';
import AboutSection from './components/AboutSection';
import Admin from './components/Admin';
import { storageService } from './services/storage';
import { Project, Service, Testimonial } from './types';

const App: React.FC = () => {
  const portfolioRef = useRef<HTMLDivElement | null>(null);
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

  // Contact form state
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

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

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Contact form submitted:', contactForm);
      setSubmitMessage('Thank you! We\'ll be in touch within 24 hours.');
      setContactForm({ firstName: '', lastName: '', email: '' });
      setIsSubmitting(false);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitMessage(null), 5000);
    }, 1000);
  };

  const handleContactChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
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
          className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:text-terracotta transition-colors z-[110] bg-white/5 p-2 rounded-full"
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
        <div className="w-16 h-16 border-4 border-terracotta/20 border-t-terracotta rounded-full animate-spin mb-6"></div>
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
            className="group mb-6 md:mb-8 flex items-center text-slate-500 hover:text-terracotta transition-colors font-bold text-[10px] md:text-sm uppercase tracking-widest"
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
                  <span key={tag} className="px-3 py-1 bg-skyblue/10 text-skyblue font-bold text-[9px] md:text-[10px] uppercase tracking-widest rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="inline-block px-4 py-1.5 bg-terracotta text-white text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-4 md:mb-6">
                {selectedProject.category} • {selectedProject.year}
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 mb-4 md:mb-6 leading-tight">{selectedProject.title}</h1>
              <div className="flex items-center text-slate-500 mb-8 md:mb-10 font-medium text-sm md:text-base">
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-sagegreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-skyblue mt-1.5 mr-3 md:mr-4 shrink-0"></div>
                        <span className="font-semibold text-xs md:text-sm leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-12 md:mt-16 p-6 md:p-10 bg-slate-900 rounded-2xl md:rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-terracotta/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-terracotta/20 transition-colors"></div>
                <h4 className="text-xl md:text-2xl font-serif font-bold mb-3 md:mb-4 relative z-10">Start your project</h4>
                <p className="text-slate-400 mb-8 md:mb-10 text-[11px] md:text-sm leading-relaxed relative z-10">Our architectural experts are ready to draft your vision into reality. Let's discuss requirements and feasibility today.</p>
                <button 
                  onClick={() => scrollTo('contact')}
                  className="w-full py-4 bg-terracotta text-white rounded-xl md:rounded-2xl font-bold hover:bg-terracotta-hover transition-all shadow-xl shadow-terracotta/10 active:scale-95 text-xs md:text-base"
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
            <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold">© 2026 Miledesigns</p>
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

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 pb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-3 mb-6 reveal-item">
              <span className="h-px w-12 bg-terracotta"></span>
              <span className="text-terracotta text-xs font-bold uppercase tracking-[0.25em]">Architecture & Construction </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight reveal-item">
              Where Vision <span className="text-terracotta">Meets</span> Reality
            </h1>
            
            <p className="text-base text-slate-300 mb-8 max-w-lg leading-relaxed reveal-item">
              Award-winning architectural studio specializing in sustainable, innovative designs that transform spaces and inspire communities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 reveal-item">
              <button 
                onClick={() => scrollTo('portfolio')}
                className="bg-terracotta text-white px-8 py-3.5 rounded-lg font-semibold text-sm hover:bg-terracotta-hover transition-all shadow-lg text-center"
              >
                View Projects
              </button>
              
              <button 
                onClick={() => scrollTo('contact')}
                className="flex items-center justify-center space-x-2 bg-white/10 border border-white/20 text-white px-8 py-3.5 rounded-lg font-semibold text-sm hover:bg-white/20 transition-all text-center"
              >
                <span>Get in Touch</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xs font-bold text-sagegreen uppercase tracking-[0.25em] mb-2">What We Do</h2>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900">Our Services</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service) => (
              <div key={service.id} className="group bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-terracotta/50 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-terracotta transition-colors">
                  <span className="text-xl">{service.icon}</span>
                </div>
                <h4 className="text-base font-semibold mb-2 text-slate-900 group-hover:text-terracotta transition-colors">{service.title}</h4>
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-xs font-bold text-terracotta uppercase tracking-[0.25em] mb-2">Our Work</h2>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900">Featured Projects</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeFilter === tag 
                    ? 'bg-terracotta text-white' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-terracotta hover:text-terracotta'
                  }`}
                >
                  {tag}
                </button>
              ))}
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
                        className="reveal-item flex-1 group relative bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer h-[280px] md:h-[380px]"
                      >
                        <img 
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-5 md:p-6">
                          <span className="text-skyblue text-[10px] font-bold uppercase tracking-[0.25em] mb-1.5">{project.category} • {project.year}</span>
                          <h4 className="text-lg md:text-xl font-serif font-bold text-white mb-1.5">{project.title}</h4>
                          <span className="text-slate-300 text-xs">{project.location}</span>
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
                    className={`h-1 md:h-1.5 transition-all duration-500 rounded-full ${currentSlide === idx ? 'w-8 md:w-12 bg-terracotta' : 'w-2 md:w-3 bg-slate-300'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xs font-bold text-skyblue uppercase tracking-[0.25em] mb-2">Testimonials</h2>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900">What Our Clients Say</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, idx) => (
              <div 
                key={`${t.id}-${idx}`} 
                className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="flex text-amber-400 mb-3">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">"{t.feedback}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-slate-200">
                    <img src={t.avatarUrl || `https://i.pravatar.cc/150?u=${t.id}`} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-900">{t.name}</h5>
                    <p className="text-xs text-slate-500">{t.projectType}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estimator Section */}
      <section id="calculator" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-terracotta uppercase tracking-[0.3em] mb-2">Planning</h2>
            <h3 className="text-2xl md:text-4xl font-serif font-bold text-slate-900">Capital Projection</h3>
          </div>
          <div className="reveal-item">
            <CostCalculator />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-slate-100 text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="reveal-item">
              <h2 className="text-2xl md:text-4xl font-bold mb-5 leading-tight">Ready to start your <span className="text-terracotta">project</span>?</h2>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                Get in touch with our team to discuss your architectural vision. We'll help bring your ideas to life.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-terracotta/10 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Location</p>
                    <p className="text-slate-800">772 Industrial Way, NY</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-terracotta/10 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone</p>
                    <p className="text-slate-800">+1 (888) MILE-01</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="reveal-item">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                {submitMessage ? (
                  <div className="text-center py-6">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-slate-900 text-sm font-medium">{submitMessage}</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">First Name</label>
                        <input 
                          type="text" 
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta" 
                          placeholder="John"
                          value={contactForm.firstName}
                          onChange={(e) => handleContactChange('firstName', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Last Name</label>
                        <input 
                          type="text" 
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta" 
                          placeholder="Doe"
                          value={contactForm.lastName}
                          onChange={(e) => handleContactChange('lastName', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
                      <input 
                        type="email" 
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta" 
                        placeholder="j.doe@company.com"
                        value={contactForm.email}
                        onChange={(e) => handleContactChange('email', e.target.value)}
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-terracotta text-white font-semibold py-2.5 rounded-lg hover:bg-terracotta-hover transition-colors text-sm disabled:opacity-50"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {renderLightBox()}

      {isAdminOpen && <Admin onClose={() => setIsAdminOpen(false)} onDataUpdate={loadData} />}

      <footer className="bg-slate-950 text-slate-500 py-10 border-t border-slate-900 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-6 mb-8">
            <span className="text-xl md:text-2xl font-serif font-bold text-white tracking-tighter">MILEDESIGNS</span>
            <div className="hidden md:block h-5 w-px bg-slate-800"></div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500">© 2024 Architectural Collective</span>
          </div>
          <div className="flex justify-center flex-wrap gap-6 mb-6">
            {['LinkedIn', 'Instagram', 'ArchDaily'].map(social => (
              <a key={social} href="#" className="text-xs font-bold hover:text-white transition-colors uppercase tracking-wider">{social}</a>
            ))}
          </div>
          <button 
            onClick={() => setIsAdminOpen(true)}
            className="text-[10px] font-bold text-slate-700 uppercase tracking-widest hover:text-terracotta transition-colors"
          >
            Admin Portal
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
