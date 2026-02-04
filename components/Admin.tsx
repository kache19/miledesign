import React, { useState, useEffect } from 'react';
import { Project, Service, Testimonial } from '../types';
import { storageService } from '../services/storage';

interface AdminProps {
  onClose: () => void;
  onDataUpdate: () => void;
}

const Admin: React.FC<AdminProps> = ({ onClose, onDataUpdate }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'testimonials'>('projects');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const [editingItem, setEditingItem] = useState<Project | Service | Testimonial | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setProjects(storageService.getProjects());
    setServices(storageService.getServices());
    setTestimonials(storageService.getTestimonials());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple check - in production, use proper authentication
    if (password.trim().length > 0) {
      setIsLoggedIn(true);
    } else {
      alert('Please enter a password');
    }
  };

  const saveAll = () => {
    storageService.saveProjects(projects);
    storageService.saveServices(services);
    storageService.saveTestimonials(testimonials);
    onDataUpdate();
    alert('All changes saved to local storage!');
  };

  const deleteItem = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    if (activeTab === 'projects') setProjects(projects.filter(p => p.id !== id));
    if (activeTab === 'services') setServices(services.filter(s => s.id !== id));
    if (activeTab === 'testimonials') setTestimonials(testimonials.filter(t => t.id !== id));
  };

  const startEdit = (item: Project | Service | Testimonial) => {
    setEditingItem({ ...item });
    setIsEditing(true);
  };

  const startAdd = () => {
    if (activeTab === 'projects') {
      setEditingItem({
        id: Date.now().toString(),
        title: '',
        category: 'Residential' as const,
        location: '',
        imageUrl: '',
        year: new Date().getFullYear(),
        description: '',
        tags: [],
        features: [],
        gallery: []
      });
    } else if (activeTab === 'services') {
      setEditingItem({
        id: Date.now().toString(),
        title: '',
        description: '',
        icon: '🏗️',
        imageUrl: ''
      });
    } else if (activeTab === 'testimonials') {
      setEditingItem({
        id: Date.now().toString(),
        name: '',
        projectType: '',
        feedback: '',
        rating: 5,
        avatarUrl: ''
      });
    }
    setIsEditing(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (activeTab === 'projects') {
      const project = editingItem as Project;
      const exists = projects.find(p => p.id === project.id);
      if (exists) {
        setProjects(projects.map(p => p.id === project.id ? project : p));
      } else {
        setProjects([...projects, project]);
      }
    } else if (activeTab === 'services') {
      const service = editingItem as Service;
      const exists = services.find(s => s.id === service.id);
      if (exists) {
        setServices(services.map(s => s.id === service.id ? service : s));
      } else {
        setServices([...services, service]);
      }
    } else if (activeTab === 'testimonials') {
      const testimonial = editingItem as Testimonial;
      const exists = testimonials.find(t => t.id === testimonial.id);
      if (exists) {
        setTestimonials(testimonials.map(t => t.id === testimonial.id ? testimonial : t));
      } else {
        setTestimonials([...testimonials, testimonial]);
      }
    }
    setIsEditing(false);
    setEditingItem(null);
  };

  const updateEditingField = (field: string, value: any) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [field]: value });
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          <h2 className="text-2xl font-serif font-bold text-white mb-6 text-center">Admin Portal</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Enter Password" 
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-terracotta outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button type="submit" className="w-full bg-terracotta text-white font-bold py-3 rounded-xl hover:bg-terracotta-hover transition-colors active:scale-[0.98]">
              Unlock Dashboard
            </button>
            <button type="button" onClick={onClose} className="w-full text-slate-500 text-sm py-2 hover:text-white transition-colors">
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col lg:flex-row overflow-hidden animate-in fade-in duration-300">
      {/* Sidebar */}
      <div className="w-full lg:w-64 bg-slate-900 text-white p-4 lg:p-6 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 shrink-0">
        <div className="flex items-center justify-between lg:block lg:mb-10">
          <div className="text-xl font-serif font-bold tracking-tighter">
            MILEDESIGNS <span className="text-terracotta">Admin</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        
        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar space-x-2 lg:space-x-0 lg:space-y-2 mt-4 lg:mt-0 flex-1">
          {(['projects', 'services', 'testimonials'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap lg:w-full text-left px-4 py-2.5 lg:py-3 rounded-xl text-[10px] lg:text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-terracotta text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="hidden lg:block pt-6 border-t border-slate-800 space-y-3">
          <button onClick={saveAll} className="w-full bg-sagegreen text-white py-3 rounded-xl font-bold text-sm hover:bg-sagegreen-hover transition-colors">
            Publish Changes
          </button>
          <button onClick={() => storageService.reset()} className="w-full bg-red-600/20 text-red-500 py-3 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all">
            Reset Data
          </button>
          <button onClick={onClose} className="w-full text-slate-500 text-sm hover:text-white py-2">
            Exit Admin Mode
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-10 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-slate-900 capitalize leading-tight">Manage {activeTab}</h1>
              <p className="text-slate-500 text-sm mt-1">Click + Quick Add to create new content</p>
            </div>
            <button 
              onClick={startAdd}
              className="w-full sm:w-auto bg-terracotta text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-terracotta-hover transition-all active:scale-95 shadow-lg"
            >
              + Quick Add
            </button>
          </div>

          {/* Projects List */}
          {activeTab === 'projects' && (
            <div className="grid gap-3 lg:gap-4">
              {projects.length > 0 ? (
                projects.map(p => (
                  <div key={p.id} className="bg-white p-4 lg:p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm group hover:shadow-md transition-all">
                    <div className="flex items-center space-x-3 lg:space-x-4">
                      <img src={p.imageUrl} alt={p.title} className="w-12 h-12 lg:w-14 lg:h-14 object-cover rounded-xl bg-slate-100" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/56?text=No+Img'; }} />
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 truncate text-sm lg:text-base">{p.title || 'Untitled'}</h3>
                        <p className="text-[9px] lg:text-[10px] text-terracotta uppercase tracking-widest truncate">{p.category} • {p.year}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1 lg:space-x-2 shrink-0">
                      <button onClick={() => startEdit(p)} className="p-2 text-slate-400 hover:text-terracotta transition-colors" title="Edit">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button onClick={() => deleteItem(p.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">No projects found.</p>
                  <button onClick={startAdd} className="mt-4 text-terracotta font-bold hover:underline">+ Add your first project</button>
                </div>
              )}
            </div>
          )}

          {/* Services List */}
          {activeTab === 'services' && (
            <div className="grid gap-3 lg:gap-4">
              {services.length > 0 ? (
                services.map(s => (
                  <div key={s.id} className="bg-white p-4 lg:p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm group hover:shadow-md transition-all">
                    <div className="flex items-center space-x-3 lg:space-x-4">
                      <div className="w-12 h-12 lg:w-14 lg:h-14 object-cover rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
                        {s.icon}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 truncate text-sm lg:text-base">{s.title || 'Untitled'}</h3>
                        <p className="text-[9px] lg:text-[10px] text-terracotta uppercase tracking-widest truncate">{s.description?.substring(0, 50)}...</p>
                      </div>
                    </div>
                    <div className="flex space-x-1 lg:space-x-2 shrink-0">
                      <button onClick={() => startEdit(s)} className="p-2 text-slate-400 hover:text-terracotta transition-colors" title="Edit">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button onClick={() => deleteItem(s.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">No services found.</p>
                  <button onClick={startAdd} className="mt-4 text-terracotta font-bold hover:underline">+ Add your first service</button>
                </div>
              )}
            </div>
          )}

          {/* Testimonials List */}
          {activeTab === 'testimonials' && (
            <div className="grid gap-3 lg:gap-4">
              {testimonials.length > 0 ? (
                testimonials.map(t => (
                  <div key={t.id} className="bg-white p-4 lg:p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm group hover:shadow-md transition-all">
                    <div className="flex items-center space-x-3 lg:space-x-4">
                      <img src={t.avatarUrl || `https://i.pravatar.cc/150?u=${t.id}`} alt={t.name} className="w-12 h-12 lg:w-14 lg:h-14 object-cover rounded-full bg-slate-100" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/56?text=User'; }} />
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 truncate text-sm lg:text-base">{t.name || 'Unnamed'}</h3>
                        <p className="text-[9px] lg:text-[10px] text-terracotta uppercase tracking-widest truncate">{t.projectType}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1 lg:space-x-2 shrink-0">
                      <button onClick={() => startEdit(t)} className="p-2 text-slate-400 hover:text-terracotta transition-colors" title="Edit">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button onClick={() => deleteItem(t.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">No testimonials found.</p>
                  <button onClick={startAdd} className="mt-4 text-terracotta font-bold hover:underline">+ Add your first testimonial</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && editingItem && (
        <div className="fixed inset-0 z-[110] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-[1.5rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 my-8">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-lg font-serif font-bold text-terracotta">
                {activeTab === 'projects' ? 'Project Details' : activeTab === 'services' ? 'Service Details' : 'Testimonial Details'}
              </h2>
              <button onClick={() => { setIsEditing(false); setEditingItem(null); }} className="text-slate-400 hover:text-slate-900 p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="flex-1 p-6 space-y-4 overflow-y-auto">
              {/* Project Form Fields */}
              {activeTab === 'projects' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Project Title</label>
                      <input 
                        type="text" required
                        value={(editingItem as Project).title} 
                        onChange={(e) => updateEditingField('title', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Location</label>
                      <input 
                        type="text" required
                        value={(editingItem as Project).location} 
                        onChange={(e) => updateEditingField('location', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Category</label>
                      <select 
                        value={(editingItem as Project).category}
                        onChange={(e) => updateEditingField('category', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs outline-none focus:border-terracotta"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Year</label>
                      <input 
                        type="number" required
                        value={(editingItem as Project).year} 
                        onChange={(e) => updateEditingField('year', parseInt(e.target.value) || new Date().getFullYear())}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-terracotta"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Tags (comma separated)</label>
                      <input 
                        type="text"
                        value={(editingItem as Project).tags?.join(', ') || ''} 
                        onChange={(e) => updateEditingField('tags', e.target.value.split(',').map(s => s.trim()).filter(s => s !== ''))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-terracotta"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Image URL</label>
                    <input 
                      type="url" required
                      value={(editingItem as Project).imageUrl} 
                      onChange={(e) => updateEditingField('imageUrl', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-terracotta"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Description</label>
                    <textarea 
                      rows={3} required
                      value={(editingItem as Project).description || ''} 
                      onChange={(e) => updateEditingField('description', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none resize-none focus:border-terracotta"
                    />
                  </div>
                </>
              )}

              {/* Service Form Fields */}
              {activeTab === 'services' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Service Title</label>
                    <input 
                      type="text" required
                      value={(editingItem as Service).title} 
                      onChange={(e) => updateEditingField('title', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Icon (emoji)</label>
                    <input 
                      type="text"
                      value={(editingItem as Service).icon} 
                      onChange={(e) => updateEditingField('icon', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Description</label>
                    <textarea 
                      rows={3} required
                      value={(editingItem as Service).description || ''} 
                      onChange={(e) => updateEditingField('description', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none resize-none focus:border-terracotta"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Image URL</label>
                    <input 
                      type="url"
                      value={(editingItem as Service).imageUrl || ''} 
                      onChange={(e) => updateEditingField('imageUrl', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-terracotta"
                    />
                  </div>
                </>
              )}

              {/* Testimonial Form Fields */}
              {activeTab === 'testimonials' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Client Name</label>
                      <input 
                        type="text" required
                        value={(editingItem as Testimonial).name} 
                        onChange={(e) => updateEditingField('name', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Project Type</label>
                      <input 
                        type="text" required
                        value={(editingItem as Testimonial).projectType} 
                        onChange={(e) => updateEditingField('projectType', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Rating (1-5)</label>
                    <select 
                      value={(editingItem as Testimonial).rating}
                      onChange={(e) => updateEditingField('rating', parseInt(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm outline-none focus:border-terracotta"
                    >
                      {[1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Feedback</label>
                    <textarea 
                      rows={4} required
                      value={(editingItem as Testimonial).feedback || ''} 
                      onChange={(e) => updateEditingField('feedback', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none resize-none focus:border-terracotta"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Avatar URL (optional)</label>
                    <input 
                      type="url"
                      value={(editingItem as Testimonial).avatarUrl || ''} 
                      onChange={(e) => updateEditingField('avatarUrl', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-terracotta"
                    />
                  </div>
                </>
              )}
            </form>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 shrink-0">
              <button onClick={() => { setIsEditing(false); setEditingItem(null); }} className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600">Cancel</button>
              <button onClick={handleEditSubmit} className="px-6 py-2 bg-terracotta text-white rounded-lg text-xs font-bold active:scale-95 shadow-lg shadow-terracotta/20">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
