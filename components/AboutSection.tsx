
import React, { useEffect, useRef, useState } from 'react';
import { AboutContent } from '../types';

interface AboutSectionProps {
  content: AboutContent;
}

const AboutSection: React.FC<AboutSectionProps> = ({ content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = content.stats.length > 0
    ? content.stats
    : [
        { value: '15', suffix: '+', label: 'Years of Excellence', description: 'Since 2008' },
        { value: '450', suffix: '+', label: 'Projects Completed', description: 'Successful Handover' },
        { value: '98', suffix: '%', label: 'Client Satisfaction', description: 'Rating Score' },
        { value: '35', suffix: '', label: 'Design Awards', description: 'Industry Recognition' }
      ];

  const pillars = [
    {
      title: "Innovation First",
      desc: "Integrating cutting-edge BIM modeling and design tools to eliminate construction inefficiencies before the first stone is laid.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: 'bg-skyblue/10 text-skyblue hover:bg-skyblue/20',
      borderColor: 'border-skyblue/20',
    },
    {
      title: "Ethical Sourcing",
      desc: "We prioritize materials that are both structurally superior and environmentally responsible, ensuring a legacy of planetary care.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-sagegreen/10 text-sagegreen hover:bg-sagegreen/20',
      borderColor: 'border-sagegreen/20',
    },
    {
      title: "Turnkey Precision",
      desc: "From initial feasibility to final interior polish, our integrated process ensures your vision remains uncompromised.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'bg-terracotta/10 text-terracotta hover:bg-terracotta/20',
      borderColor: 'border-terracotta/20',
    },
  ];

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="py-24 bg-slate-50 overflow-hidden relative"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-terracotta/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-skyblue/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className={`text-center max-w-4xl mx-auto mb-20 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block text-xs font-bold text-terracotta uppercase tracking-[0.3em] mb-4 px-4 py-2 bg-terracotta/10 rounded-full">
            {content.badge}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 mb-6 leading-tight">
            {content.headingPrefix} <span className="italic text-terracotta relative">
              {content.headingHighlight}
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-terracotta/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0,8 Q50,0 100,8" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span> {content.headingSuffix}
          </h2>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            {content.introText}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Left Content */}
          <div className={`transition-all duration-1000 delay-200 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="space-y-8">
              <p className="text-slate-600 text-lg leading-relaxed">
                {content.bodyText}
              </p>
              
              <div className="flex flex-wrap gap-3">
                {['BIM Modeling', 'Sustainable Design', 'Turnkey Solutions', 'Interior Design'].map((tag, i) => (
                  <span 
                    key={i}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:border-terracotta/50 hover:text-terracotta transition-colors cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6 pt-4">
                {stats.map((stat, i) => (
                  <div 
                    key={i}
                    className="relative group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br from-terracotta/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="relative p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
                          {stat.value}
                        </span>
                        <span className="text-xl font-semibold text-terracotta">{stat.suffix}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
                      <div className="text-xs text-slate-400 mt-1">{stat.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Image Section */}
          <div className={`relative transition-all duration-1000 delay-400 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              {/* Main Image */}
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10">
                <img 
                  src={content.imageUrl} 
                  alt="Architectural design showcase" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-xl z-20 hidden md:block animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-terracotta rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Award Winning</div>
                    <div className="text-xs text-slate-500">Best Architecture 2023</div>
                  </div>
                </div>
              </div>

              {/* Vision Card */}
              <div className="absolute top-1/2 -right-6 md:-right-12 -translate-y-1/2 bg-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl z-20 hidden md:block transform hover:scale-105 transition-transform duration-300">
                <div className="text-terracotta text-2xl mb-3 italic font-serif">Our Vision</div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-skyblue rounded-full animate-pulse" />
                  <span className="text-skyblue/80 text-xs uppercase tracking-widest font-bold">Core Values</span>
                </div>
                <p className="text-white/90 text-sm leading-relaxed">
                  {content.visionText}
                </p>
              </div>

              {/* Decorative blur elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-terracotta/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-skyblue/20 rounded-full blur-3xl -z-10" />
            </div>

            {/* Mobile Cards */}
            <div className="mt-5 space-y-3 md:hidden">
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-terracotta rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Award Winning</div>
                    <div className="text-xs text-slate-500">Best Architecture 2023</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-5 shadow-lg">
                <div className="text-terracotta text-xl mb-2 italic font-serif">Our Vision</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-skyblue rounded-full animate-pulse" />
                  <span className="text-skyblue/80 text-[11px] uppercase tracking-widest font-bold">Core Values</span>
                </div>
                <p className="text-white/90 text-sm leading-relaxed">
                  {content.visionText}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pillars Section */}
        <div className={`transition-all duration-1000 delay-600 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-4">
              Our Core Pillars
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              The foundation of everything we build is built on these three essential principles
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {pillars.map((pillar, i) => (
              <div 
                key={i}
                className={`group relative p-8 md:p-10 rounded-3xl border ${pillar.borderColor} ${pillar.color} transition-all duration-500 hover:shadow-xl hover:-translate-y-2 cursor-pointer overflow-hidden`}
              >
                {/* Background pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
                  <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="80" cy="20" r="30" />
                  </svg>
                </div>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {pillar.icon}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-terracotta transition-colors">
                    {pillar.title}
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-sm group-hover:text-slate-700 transition-colors">
                    {pillar.desc}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="absolute bottom-6 right-6 w-10 h-10 bg-white/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <svg className="w-5 h-5 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className={`mt-20 text-center transition-all duration-1000 delay-800 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-4 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
            <span className="px-6 py-3 text-slate-700 font-medium">
              {content.ctaText}
            </span>
            <a 
              href="#contact" 
              className="px-8 py-3 bg-terracotta text-white rounded-full font-semibold hover:bg-terracotta-hover transition-colors duration-300 flex items-center gap-2 group"
            >
              {content.ctaButtonText}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
