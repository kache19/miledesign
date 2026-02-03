
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

  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    setProjects(storageService.getProjects());
    setServices(storageService.getServices());
    setTestimonials(storageService.getTestimonials());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid password. Try admin123');
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

  const startEdit = (item: any) => {
    setEditingItem({ ...item });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'projects') {
      const exists = projects.find(p => p.id === editingItem.id);
      if (exists) {
        setProjects(projects.map(p => p.id === editingItem.id ? editingItem : p));
      } else {
        setProjects([...projects, { ...editingItem, id: Date.now().toString() }]);
      }
    }
    // Logic for services and testimonials could be expanded here
    setEditingItem(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          <h2 className="text-2xl font-serif font-bold text-white mb-6 text-center">Admin Portal</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Enter Master Password" 
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button className="w-full bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-500 transition-colors active:scale-[0.98]">
              Unlock Dashboard
            </button>
            <button type="button" onClick={onClose} className="w-full text-slate-500 text-sm py-2 hover:text-white transition-colors">
              Cancel
            </button>
          </form>
          <p className="mt-4 text-[10px] text-center text-slate-600 uppercase tracking-widest">Master Key: admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col lg:flex-row overflow-hidden animate-in fade-in duration-300">
      {/* Sidebar / Top Nav for Mobile */}
      <div className="w-full lg:w-64 bg-slate-900 text-white p-4 lg:p-6 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 shrink-0">
        <div className="flex items-center justify-between lg:block lg:mb-10">
          <div className="text-xl font-serif font-bold tracking-tighter">
            MILEDESIGNS <span className="text-amber-500">Admin</span>
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
                activeTab === tab ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="hidden lg:block pt-6 border-t border-slate-800 space-y-3">
          <button onClick={saveAll} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-500 transition-colors">
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

      {/* Mobile Actions Bar */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex gap-2">
        <button onClick={saveAll} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider">Save</button>
        <button onClick={() => storageService.reset()} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider">Reset</button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-10 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-slate-900 capitalize leading-tight">Manage {activeTab}</h1>
              <p className="text-slate-500 text-sm mt-1">Updates are saved to local memory until you Publish.</p>
            </div>
            <button 
              onClick={() => startEdit(activeTab === 'projects' ? { title: '', category: 'Residential', location: '', tags: [], features: [], gallery: [], imageUrl: '', year: 2024, description: '' } : {})}
              className="w-full sm:w-auto bg-slate-900 text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
            >
              + Create New {activeTab.slice(0, -1)}
            </button>
          </div>

          <div className="grid gap-3 lg:gap-4">
            {activeTab === 'projects' && (projects.length > 0 ? (
              projects.map(p => (
                <div key={p.id} className="bg-white p-4 lg:p-6 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm group hover:shadow-md transition-all">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <img src={p.imageUrl} alt="" className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded-xl bg-slate-100" />
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 truncate text-sm lg:text-base">{p.title || 'Untitled Project'}</h3>
                      <p className="text-[10px] lg:text-xs text-slate-500 uppercase tracking-widest truncate">{p.category} • {p.year}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1 lg:space-x-2 shrink-0">
                    <button onClick={() => startEdit(p)} className="p-2 text-slate-400 hover:text-amber-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <button onClick={() => deleteItem(p.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">No {activeTab} found. Create your first entry!</p>
              </div>
            ))}
            
            {activeTab !== 'projects' && (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                <p className="text-slate-400 text-sm">Management for {activeTab} coming in the next update.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal - Mobile Optimized */}
      {editingItem && (
        <div className="fixed inset-0 z-[110] bg-slate-950/50 backdrop-blur-md flex items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full h-full sm:h-auto sm:max-w-2xl sm:rounded-[2rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
            <div className="p-5 lg:p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-xl lg:text-2xl font-serif font-bold">Edit {activeTab.slice(0, -1)}</h2>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-900 transition-colors p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto p-5 lg:p-8 space-y-5 lg:space-y-6">
              {activeTab === 'projects' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Title</label>
                      <input 
                        type="text" 
                        required
                        value={editingItem.title} 
                        onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500/20 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Location</label>
                      <input 
                        type="text" 
                        required
                        value={editingItem.location} 
                        onChange={e => setEditingItem({...editingItem, location: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500/20 outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
                      <select 
                        value={editingItem.category}
                        onChange={e => setEditingItem({...editingItem, category: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500/20 outline-none"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Completion Year</label>
                      <input 
                        type="number" 
                        required
                        value={editingItem.year} 
                        onChange={e => setEditingItem({...editingItem, year: parseInt(e.target.value) || 2024})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500/20 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Main Image URL</label>
                    <input 
                      type="url" 
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={editingItem.imageUrl} 
                      onChange={e => setEditingItem({...editingItem, imageUrl: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Project Description</label>
                    <textarea 
                      rows={4}
                      required
                      value={editingItem.description} 
                      onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500/20 outline-none resize-none"
                      placeholder="Write a brief overview of the project highlights and design philosophy..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Tags (Comma Separated)</label>
                    <input 
                      type="text" 
                      placeholder="Sustainable, Luxury, Timber"
                      value={editingItem.tags?.join(', ')} 
                      onChange={e => setEditingItem({...editingItem, tags: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500/20 outline-none"
                    />
                  </div>
                </>
              )}
            </form>
            
            <div className="p-5 lg:p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3 shrink-0">
              <button onClick={() => setEditingItem(null)} className="order-2 sm:order-1 px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Discard Changes</button>
              <button onClick={handleEditSubmit} className="order-1 sm:order-2 px-8 py-3 bg-slate-900 text-white rounded-full text-sm font-bold shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95">
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
