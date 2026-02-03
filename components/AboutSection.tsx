
import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="reveal-item">
            <h2 className="text-sm font-bold text-amber-600 uppercase tracking-[0.3em] mb-3">Our Legacy</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8 leading-tight">
              Crafting environments that <span className="italic text-amber-600">inspire</span> human connection.
            </h3>
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>
                Founded in 2008, Structura Design & Build was born from a simple realization: the spaces we inhabit fundamentally shape who we are. We bridge the gap between visionary architecture and uncompromising engineering.
              </p>
              <p>
                Our team consists of award-winning architects, master craftsmen, and sustainability experts who believe that every blueprint is a promise of quality. We don't just follow industry standards; we set them through rigorous material selection and innovative construction technology.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mt-12">
              <div>
                <div className="text-4xl font-serif font-bold text-slate-900 mb-2">15+</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Years of Excellence</div>
              </div>
              <div>
                <div className="text-4xl font-serif font-bold text-slate-900 mb-2">450+</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Projects Handovered</div>
              </div>
            </div>
          </div>
          
          <div className="relative reveal-item">
            <div className="aspect-w-4 aspect-h-5 rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1503387762-592dee58c460?auto=format&fit=crop&q=80&w=2000" 
                alt="Architectural details" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-slate-900 rounded-3xl p-8 flex flex-col justify-center shadow-2xl z-20 hidden md:flex">
              <div className="text-amber-500 text-3xl mb-2 italic">Vision</div>
              <p className="text-slate-400 text-xs leading-relaxed uppercase tracking-widest font-bold">Sustainable. Functional. Aesthetic.</p>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          {[
            {
              title: "Innovation First",
              desc: "Integrating AI-driven design tools and cutting-edge BIM modeling to eliminate construction inefficiencies before the first stone is laid.",
              icon: "💡"
            },
            {
              title: "Ethical Sourcing",
              desc: "We prioritize materials that are both structurally superior and environmentally responsible, ensuring a legacy of planetary care.",
              icon: "🌿"
            },
            {
              title: "Turnkey Precision",
              desc: "From the initial feasibility study to the final interior polish, our integrated process ensures your vision remains uncompromised.",
              icon: "🔑"
            }
          ].map((pillar, i) => (
            <div key={i} className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-6">{pillar.icon}</div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">{pillar.title}</h4>
              <p className="text-slate-500 leading-relaxed text-sm">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
