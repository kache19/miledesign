import React, { useEffect, useMemo, useState } from 'react';
import { AboutContent, AdminProfile, ContactDetails, Project, Service, SocialLink, SubAdmin, TeamMember, Testimonial, VlogEntry } from '../types';
import { authService, storageService } from '../services/storage';

interface AdminProps {
  onClose: () => void;
  onDataUpdate: () => void;
}

type ToastType = 'success' | 'error' | 'info';
type AdminTab = 'projects' | 'services' | 'testimonials' | 'socials' | 'team' | 'vlogs' | 'home' | 'contact' | 'about' | 'profile';
type EditableItem = Project | Service | Testimonial | SocialLink | TeamMember | VlogEntry | ContactDetails | AboutContent | AdminProfile;

const Admin: React.FC<AdminProps> = ({ onClose, onDataUpdate }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInAdminEmail, setLoggedInAdminEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('projects');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [vlogEntries, setVlogEntries] = useState<VlogEntry[]>([]);
  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    id: 'contact-details',
    location: '',
    phoneNumbers: [],
    inquiryEmail: '',
    inquiryWhatsAppNumber: '',
    showFloatingWhatsApp: true,
    floatingWhatsAppMessage: 'Hi, am here to serve you!'
  });
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    id: 'about-content',
    badge: '',
    headingPrefix: '',
    headingHighlight: '',
    headingSuffix: '',
    introText: '',
    bodyText: '',
    stats: [],
    homeBackgroundImages: [],
    certificateImages: [],
    imageUrl: '',
    visionText: '',
    ctaText: '',
    ctaButtonText: ''
  });
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    id: 'admin-profile',
    name: 'Site Administrator',
    email: 'admin@miledesigns.com',
    avatarUrl: '',
    subAdmins: []
  });
  const [newSubAdmin, setNewSubAdmin] = useState<Omit<SubAdmin, 'id'>>({
    name: '',
    email: '',
    enabled: true
  });
  const [newSubAdminPassword, setNewSubAdminPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savedSnapshot, setSavedSnapshot] = useState('');

  const [editingItem, setEditingItem] = useState<EditableItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const [loadedData, currentUserEmail] = await Promise.all([
          storageService.getAllContent(),
          authService.getCurrentUserEmail()
        ]);

        if (!mounted) return;
        setProjects(loadedData.projects);
        setServices(loadedData.services);
        setTestimonials(loadedData.testimonials);
        setSocialLinks(loadedData.socialLinks);
        setTeamMembers(loadedData.teamMembers);
        setVlogEntries(loadedData.vlogEntries);
        setContactDetails(loadedData.contactDetails);
        setAboutContent(loadedData.aboutContent);
        setAdminProfile(loadedData.adminProfile);
        setSavedSnapshot(JSON.stringify(loadedData));
        setLoggedInAdminEmail(currentUserEmail);
        setIsLoggedIn(Boolean(currentUserEmail));
      } catch (error) {
        if (!mounted) return;
        notify('error', error instanceof Error ? error.message : 'Failed to initialize admin portal.');
      }
    };

    void initialize();

    const unsubscribe = authService.onAuthStateChange((email) => {
      if (!mounted) return;
      setLoggedInAdminEmail(email);
      setIsLoggedIn(Boolean(email));
      if (!email) {
        setLoginEmail('');
        setPassword('');
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (isEditing) {
        setIsEditing(false);
        setEditingItem(null);
        return;
      }
      handleExitAdmin();
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [isLoggedIn, isEditing]);

  useEffect(() => {
    setSearchTerm('');
  }, [activeTab]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const deferredNotice = sessionStorage.getItem('admin_notice');
    if (!deferredNotice) return;
    setToast({ type: 'success', message: deferredNotice });
    sessionStorage.removeItem('admin_notice');
  }, []);

  const notify = (type: ToastType, message: string) => {
    setToast({ type, message });
  };

  const singularLabelByTab: Record<AdminTab, string> = {
    projects: 'project',
    services: 'service',
    testimonials: 'testimonial',
    socials: 'social link',
    team: 'team member',
    vlogs: 'vlog entry',
    home: 'home content',
    contact: 'contact details',
    about: 'about content',
    profile: 'admin profile'
  };

  const currentSnapshot = useMemo(
    () =>
      JSON.stringify({
        projects,
        services,
        testimonials,
        socialLinks,
        teamMembers,
        vlogEntries,
        contactDetails,
        aboutContent,
        adminProfile
      }),
    [projects, services, testimonials, socialLinks, teamMembers, vlogEntries, contactDetails, aboutContent, adminProfile]
  );

  const hasUnsavedChanges = currentSnapshot !== savedSnapshot;
  const loggedInAdminDisplay = useMemo(() => {
    if (!loggedInAdminEmail) {
      return {
        name: adminProfile.name,
        email: adminProfile.email,
        avatarUrl: adminProfile.avatarUrl
      };
    }

    if (adminProfile.email.trim().toLowerCase() === loggedInAdminEmail.trim().toLowerCase()) {
      return {
        name: adminProfile.name,
        email: adminProfile.email,
        avatarUrl: adminProfile.avatarUrl
      };
    }

    const matchedSubAdmin = adminProfile.subAdmins.find(
      (item) => item.email.trim().toLowerCase() === loggedInAdminEmail.trim().toLowerCase()
    );

    return {
      name: matchedSubAdmin?.name || 'Sub Admin',
      email: matchedSubAdmin?.email || loggedInAdminEmail,
      avatarUrl: ''
    };
  }, [adminProfile, loggedInAdminEmail]);

  const filteredProjects = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter(
      (project) =>
        project.title.toLowerCase().includes(query) ||
        project.location.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query)
    );
  }, [projects, searchTerm]);

  const filteredServices = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return services;
    return services.filter(
      (service) =>
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
    );
  }, [services, searchTerm]);

  const filteredTestimonials = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return testimonials;
    return testimonials.filter(
      (testimonial) =>
        testimonial.name.toLowerCase().includes(query) ||
        testimonial.projectType.toLowerCase().includes(query) ||
        testimonial.feedback.toLowerCase().includes(query)
    );
  }, [testimonials, searchTerm]);

  const filteredSocialLinks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return socialLinks;
    return socialLinks.filter(
      (link) =>
        link.name.toLowerCase().includes(query) ||
        link.platform.toLowerCase().includes(query) ||
        link.url.toLowerCase().includes(query)
    );
  }, [socialLinks, searchTerm]);

  const filteredTeamMembers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return teamMembers;
    return teamMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query) ||
        member.bio.toLowerCase().includes(query)
    );
  }, [teamMembers, searchTerm]);

  const filteredVlogEntries = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return vlogEntries;
    return vlogEntries.filter(
      (entry) =>
        entry.title.toLowerCase().includes(query) ||
        entry.topic.toLowerCase().includes(query) ||
        entry.duration.toLowerCase().includes(query) ||
        entry.url.toLowerCase().includes(query)
    );
  }, [vlogEntries, searchTerm]);

  const filteredCount =
    activeTab === 'projects'
      ? filteredProjects.length
      : activeTab === 'services'
        ? filteredServices.length
        : activeTab === 'testimonials'
          ? filteredTestimonials.length
          : activeTab === 'socials'
            ? filteredSocialLinks.length
            : activeTab === 'team'
              ? filteredTeamMembers.length
              : activeTab === 'vlogs'
                ? filteredVlogEntries.length
            : 1;

  const totalCount =
    activeTab === 'projects'
      ? projects.length
      : activeTab === 'services'
        ? services.length
        : activeTab === 'testimonials'
          ? testimonials.length
          : activeTab === 'socials'
            ? socialLinks.length
            : activeTab === 'team'
              ? teamMembers.length
              : activeTab === 'vlogs'
                ? vlogEntries.length
            : 1;

  const handleExitAdmin = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Could not sign out.');
    }
    setIsLoggedIn(false);
    setLoggedInAdminEmail(null);
    setLoginEmail('');
    setPassword('');
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = loginEmail.trim().toLowerCase();
    const loginPassword = password.trim();

    if (!email || !loginPassword) {
      notify('error', 'Enter both email and password.');
      return;
    }

    try {
      await authService.signIn(email, loginPassword);
      setIsLoggedIn(true);
      setLoggedInAdminEmail(email);
      setLoginEmail('');
      setPassword('');
      notify('success', 'Welcome back.');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Invalid credentials.');
    }
  };

  const addSubAdmin = async () => {
    const name = newSubAdmin.name.trim();
    const email = newSubAdmin.email.trim().toLowerCase();
    const subAdminPassword = newSubAdminPassword.trim();

    if (!name || !email || !subAdminPassword) {
      notify('error', 'Sub-admin name, email, and password are required.');
      return;
    }

    if (subAdminPassword.length < 8) {
      notify('error', 'Sub-admin password must be at least 8 characters.');
      return;
    }

    if (adminProfile.email.trim().toLowerCase() === email) {
      notify('error', 'That email is already used by the main admin.');
      return;
    }

    const emailExists = adminProfile.subAdmins.some((item) => item.email.trim().toLowerCase() === email);
    if (emailExists) {
      notify('error', 'A sub-admin with this email already exists.');
      return;
    }

    const updatedProfile: AdminProfile = {
      ...adminProfile,
      subAdmins: [
        ...adminProfile.subAdmins,
        {
          id: `sub-admin-${Date.now()}`,
          name,
          email,
          enabled: newSubAdmin.enabled
        }
      ]
    };
    setAdminProfile(updatedProfile);
    try {
      await authService.createUserFromAdmin(email, subAdminPassword);
      await storageService.saveAdminProfile(updatedProfile);
      setNewSubAdmin({ name: '', email: '', enabled: true });
      setNewSubAdminPassword('');
      notify('success', 'Sub-admin added and saved.');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Failed to save sub-admin.');
    }
  };

  const changeMyPassword = async () => {
    const trimmedNewPassword = newPassword.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedNewPassword || !trimmedConfirmPassword) {
      notify('error', 'Enter and confirm your new password.');
      return;
    }

    if (trimmedNewPassword.length < 8) {
      notify('error', 'New password must be at least 8 characters.');
      return;
    }

    if (trimmedNewPassword !== trimmedConfirmPassword) {
      notify('error', 'Password confirmation does not match.');
      return;
    }

    try {
      await authService.updatePassword(trimmedNewPassword);
      setNewPassword('');
      setConfirmPassword('');
      notify('success', 'Password updated successfully.');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Could not update password.');
    }
  };

  const toggleSubAdmin = async (id: string) => {
    const updatedProfile: AdminProfile = {
      ...adminProfile,
      subAdmins: adminProfile.subAdmins.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    };
    setAdminProfile(updatedProfile);
    try {
      await storageService.saveAdminProfile(updatedProfile);
      notify('success', 'Sub-admin status updated.');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Failed to update sub-admin.');
    }
  };

  const removeSubAdmin = async (id: string) => {
    const updatedProfile: AdminProfile = {
      ...adminProfile,
      subAdmins: adminProfile.subAdmins.filter((item) => item.id !== id)
    };
    setAdminProfile(updatedProfile);
    try {
      await storageService.saveAdminProfile(updatedProfile);
      notify('success', 'Sub-admin removed and saved.');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Failed to remove sub-admin.');
    }
  };

  const saveAll = async () => {
    try {
      await storageService.saveAllContent({
        projects,
        services,
        testimonials,
        socialLinks,
        teamMembers,
        vlogEntries,
        contactDetails,
        aboutContent,
        adminProfile
      });
      onDataUpdate();
      setSavedSnapshot(currentSnapshot);
      notify('success', 'Changes published successfully.');
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Failed to publish changes.');
    }
  };

  const resetAllData = () => {
    setConfirmDialog({
      title: 'Reset All Data',
      message: 'Reset all content to defaults? This cannot be undone.',
      onConfirm: async () => {
        try {
          await storageService.reset();
          onDataUpdate();
          notify('success', 'Data reset to defaults.');
        } catch (error) {
          notify('error', error instanceof Error ? error.message : 'Failed to reset data.');
        }
      }
    });
  };

  const closeEditor = () => {
    setIsEditing(false);
    setEditingItem(null);
  };

  const deleteItem = (id: string) => {
    setConfirmDialog({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item?',
      onConfirm: () => {
        if (activeTab === 'projects') setProjects(projects.filter(p => p.id !== id));
        if (activeTab === 'services') setServices(services.filter(s => s.id !== id));
        if (activeTab === 'testimonials') setTestimonials(testimonials.filter(t => t.id !== id));
        if (activeTab === 'socials') setSocialLinks(socialLinks.filter(link => link.id !== id));
        if (activeTab === 'team') setTeamMembers(teamMembers.filter(member => member.id !== id));
        if (activeTab === 'vlogs') setVlogEntries(vlogEntries.filter(entry => entry.id !== id));
        notify('success', 'Item deleted.');
      }
    });
  };

  const startEdit = (item: EditableItem) => {
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
    } else if (activeTab === 'socials') {
      setEditingItem({
        id: Date.now().toString(),
        name: '',
        platform: 'Website',
        url: '',
        enabled: true
      });
    } else if (activeTab === 'team') {
      setEditingItem({
        id: Date.now().toString(),
        name: '',
        role: '',
        bio: '',
        imageUrl: ''
      });
    } else if (activeTab === 'vlogs') {
      setEditingItem({
        id: Date.now().toString(),
        title: '',
        topic: '',
        duration: '',
        thumbnailUrl: '',
        url: ''
      });
    } else if (activeTab === 'home') {
      setEditingItem({
        ...aboutContent
      });
    } else if (activeTab === 'contact') {
      setEditingItem({
        ...contactDetails
      });
    } else if (activeTab === 'about') {
      setEditingItem({
        ...aboutContent
      });
    } else if (activeTab === 'profile') {
      setEditingItem({
        ...adminProfile
      });
    }
    setIsEditing(true);
    notify('info', `Creating new ${singularLabelByTab[activeTab]}.`);
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
    } else if (activeTab === 'socials') {
      const socialLink = editingItem as SocialLink;
      const exists = socialLinks.find(link => link.id === socialLink.id);
      if (exists) {
        setSocialLinks(socialLinks.map(link => link.id === socialLink.id ? socialLink : link));
      } else {
        setSocialLinks([...socialLinks, socialLink]);
      }
    } else if (activeTab === 'team') {
      const member = editingItem as TeamMember;
      const exists = teamMembers.find(item => item.id === member.id);
      if (exists) {
        setTeamMembers(teamMembers.map(item => item.id === member.id ? member : item));
      } else {
        setTeamMembers([...teamMembers, member]);
      }
    } else if (activeTab === 'vlogs') {
      const vlog = editingItem as VlogEntry;
      const normalizedUrl = normalizeExternalUrl(vlog.url);
      if (!normalizedUrl) {
        notify('error', 'Please provide a valid video URL.');
        return;
      }
      const normalizedVlog: VlogEntry = {
        ...vlog,
        url: normalizedUrl
      };
      const exists = vlogEntries.find(item => item.id === vlog.id);
      if (exists) {
        setVlogEntries(vlogEntries.map(item => item.id === vlog.id ? normalizedVlog : item));
      } else {
        setVlogEntries([...vlogEntries, normalizedVlog]);
      }
    } else if (activeTab === 'home') {
      const home = editingItem as AboutContent;
      setAboutContent(home);
    } else if (activeTab === 'contact') {
      const contact = editingItem as ContactDetails;
      setContactDetails(contact);
    } else if (activeTab === 'about') {
      const about = editingItem as AboutContent;
      setAboutContent(about);
    } else if (activeTab === 'profile') {
      const profile = editingItem as AdminProfile;
      setAdminProfile(profile);
    }
    closeEditor();
    notify('success', `${singularLabelByTab[activeTab]} saved.`);
  };

  const updateEditingField = (field: string, value: unknown) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [field]: value });
  };

  const normalizeExternalUrl = (rawUrl: string): string | null => {
    const trimmed = rawUrl.trim();
    if (!trimmed) return null;
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    try {
      const parsed = new URL(withProtocol);
      if (!parsed.hostname) return null;
      return parsed.toString();
    } catch {
      return null;
    }
  };

  const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });

  const handleImageUpload = async (field: 'imageUrl' | 'avatarUrl' | 'thumbnailUrl', file: File | null | undefined) => {
    if (!file) {
      updateEditingField(field, '');
      notify('info', 'Image removed.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      notify('error', 'Please upload an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      notify('error', 'Image must be under 5MB.');
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      updateEditingField(field, dataUrl);
      notify('success', 'Image uploaded.');
    } catch {
      notify('error', 'Could not process the selected image.');
    }
  };

  const handleHomeBackgroundUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !editingItem) return;
    const currentImages = (editingItem as AboutContent).homeBackgroundImages || [];
    const uploadedImages: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        notify('error', `Skipped ${file.name}: not an image file.`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        notify('error', `Skipped ${file.name}: must be under 5MB.`);
        continue;
      }

      try {
        const dataUrl = await readFileAsDataUrl(file);
        uploadedImages.push(dataUrl);
      } catch {
        notify('error', `Skipped ${file.name}: could not process file.`);
      }
    }

    if (uploadedImages.length > 0) {
      updateEditingField('homeBackgroundImages', [...currentImages, ...uploadedImages]);
      notify('success', `${uploadedImages.length} home image(s) uploaded.`);
    }
  };

  const handleCertificateUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !editingItem) return;
    const currentImages = (editingItem as AboutContent).certificateImages || [];
    const uploadedImages: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        notify('error', `Skipped ${file.name}: not an image file.`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        notify('error', `Skipped ${file.name}: must be under 5MB.`);
        continue;
      }

      try {
        const dataUrl = await readFileAsDataUrl(file);
        uploadedImages.push(dataUrl);
      } catch {
        notify('error', `Skipped ${file.name}: could not process file.`);
      }
    }

    if (uploadedImages.length > 0) {
      updateEditingField('certificateImages', [...currentImages, ...uploadedImages]);
      notify('success', `${uploadedImages.length} certificate image(s) uploaded.`);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          <h2 className="text-xl font-serif font-bold text-white mb-6 text-center">Admin Portal</h2>
          {toast && (
            <div
              className={`mb-4 rounded-xl border px-4 py-3 text-sm font-medium ${
                toast.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : toast.type === 'error'
                    ? 'bg-red-50 text-red-800 border-red-200'
                    : 'bg-sky-50 text-sky-800 border-sky-200'
              }`}
            >
              {toast.message}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-1.5">Admin Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-terracotta outline-none transition-all"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-terracotta outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full bg-terracotta text-white font-bold py-3 rounded-xl hover:bg-terracotta-hover transition-colors active:scale-[0.98]">
              Unlock Dashboard
            </button>
            <button type="button" onClick={handleExitAdmin} className="w-full text-slate-500 text-sm py-2 hover:text-white transition-colors">
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col lg:flex-row overflow-hidden animate-in fade-in duration-300 text-[13px]">
      {/* Sidebar */}
      <div className="w-full lg:w-64 bg-slate-900 text-white p-4 lg:p-6 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 shrink-0">
        <div className="flex items-center justify-between lg:block lg:mb-10">
          <div className="text-lg font-serif font-bold tracking-tighter">
            MILEDESIGNS <span className="text-terracotta">Admin</span>
          </div>
          <button onClick={handleExitAdmin} className="lg:hidden p-2 text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        
        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar space-x-1 lg:space-x-0 lg:space-y-1 mt-3 lg:mt-0 flex-1">
          {(['projects', 'services', 'testimonials', 'socials', 'team', 'vlogs', 'home', 'contact', 'about', 'profile'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap lg:w-full text-left px-3 py-2 lg:py-2.5 rounded-xl text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.12em] transition-all ${
                activeTab === tab ? 'bg-terracotta text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="hidden lg:block pt-6 border-t border-slate-800 space-y-3">
          <button onClick={saveAll} disabled={!hasUnsavedChanges} className="w-full bg-sagegreen text-white py-3 rounded-xl font-bold text-sm hover:bg-sagegreen-hover transition-colors disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed">
            Publish Changes
          </button>
          <button onClick={resetAllData} className="w-full bg-red-600/20 text-red-500 py-3 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all">
            Reset Data
          </button>
          <button onClick={handleExitAdmin} className="w-full text-slate-500 text-sm hover:text-white py-2">
            Exit Admin Mode
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 bg-slate-50 pb-28 lg:pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-10 gap-4">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-slate-900 capitalize leading-tight">Manage {activeTab}</h1>
              <p className="text-slate-500 text-sm mt-1">Add, edit, search, and publish your content updates.</p>
            </div>
            <div className="w-full sm:w-auto flex flex-col sm:items-end gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <img
                  src={loggedInAdminDisplay.avatarUrl || `https://i.pravatar.cc/60?u=${loggedInAdminDisplay.email}`}
                  alt={loggedInAdminDisplay.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 bg-slate-100"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">{loggedInAdminDisplay.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{loggedInAdminDisplay.email}</p>
                </div>
              </div>
              {activeTab !== 'home' && activeTab !== 'contact' && activeTab !== 'about' && activeTab !== 'profile' ? (
                <button 
                  onClick={startAdd}
                  className="w-full sm:w-auto bg-terracotta text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-terracotta-hover transition-all active:scale-95 shadow-lg"
                >
                  + Quick Add
                </button>
              ) : activeTab === 'home' ? (
                <button
                  onClick={() => startEdit(aboutContent)}
                  className="w-full sm:w-auto bg-terracotta text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-terracotta-hover transition-all active:scale-95 shadow-lg"
                >
                  Edit Home Content
                </button>
              ) : activeTab === 'contact' ? (
                <button
                  onClick={() => startEdit(contactDetails)}
                  className="w-full sm:w-auto bg-terracotta text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-terracotta-hover transition-all active:scale-95 shadow-lg"
                >
                  Edit Contact Info & Email
                </button>
              ) : activeTab === 'about' ? (
                <button
                  onClick={() => startEdit(aboutContent)}
                  className="w-full sm:w-auto bg-terracotta text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-terracotta-hover transition-all active:scale-95 shadow-lg"
                >
                  Edit About Content
                </button>
              ) : (
                <button
                  onClick={() => startEdit(adminProfile)}
                  className="w-full sm:w-auto bg-terracotta text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-terracotta-hover transition-all active:scale-95 shadow-lg"
                >
                  Edit Admin Profile
                </button>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 lg:mb-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-700 uppercase tracking-wider">
                {filteredCount} of {totalCount}
              </div>
              <p className={`text-xs font-medium ${hasUnsavedChanges ? 'text-amber-600' : 'text-slate-500'}`}>
                {hasUnsavedChanges ? 'Unsaved changes pending publish' : 'All changes are saved'}
              </p>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={`Search ${activeTab}`}
              className="w-full md:w-80 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-terracotta"
            />
          </div>

          {/* Projects List */}
          {activeTab === 'projects' && (
            <div className="grid gap-3 lg:gap-4">
              {filteredProjects.length > 0 ? (
                filteredProjects.map(p => (
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
                  <p className="text-slate-400 font-medium">{searchTerm ? 'No matching projects found.' : 'No projects found.'}</p>
                  {!searchTerm && <button onClick={startAdd} className="mt-4 text-terracotta font-bold hover:underline">+ Add your first project</button>}
                </div>
              )}
            </div>
          )}

          {/* Services List */}
          {activeTab === 'services' && (
            <div className="grid gap-3 lg:gap-4">
              {filteredServices.length > 0 ? (
                filteredServices.map(s => (
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
                  <p className="text-slate-400 font-medium">{searchTerm ? 'No matching services found.' : 'No services found.'}</p>
                  {!searchTerm && <button onClick={startAdd} className="mt-4 text-terracotta font-bold hover:underline">+ Add your first service</button>}
                </div>
              )}
            </div>
          )}

          {/* Testimonials List */}
          {activeTab === 'testimonials' && (
            <div className="grid gap-3 lg:gap-4">
              {filteredTestimonials.length > 0 ? (
                filteredTestimonials.map(t => (
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
                  <p className="text-slate-400 font-medium">{searchTerm ? 'No matching testimonials found.' : 'No testimonials found.'}</p>
                  {!searchTerm && <button onClick={startAdd} className="mt-4 text-terracotta font-bold hover:underline">+ Add your first testimonial</button>}
                </div>
              )}
            </div>
          )}

          {/* Social Links List */}
          {activeTab === 'socials' && (
            <div className="grid gap-3 lg:gap-4">
              {filteredSocialLinks.length > 0 ? (
                filteredSocialLinks.map(link => (
                  <div key={link.id} className="bg-white p-4 lg:p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm group hover:shadow-md transition-all">
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 truncate text-sm lg:text-base">{link.name || 'Unnamed link'}</h3>
                      <p className="text-[10px] text-terracotta uppercase tracking-widest">{link.platform}</p>
                      <p className="text-xs text-slate-500 truncate mt-1">{link.url}</p>
                      <p className={`text-[10px] mt-1 font-semibold uppercase tracking-wider ${link.enabled ? 'text-sagegreen' : 'text-slate-400'}`}>
                        {link.enabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <div className="flex space-x-1 lg:space-x-2 shrink-0">
                      <button onClick={() => startEdit(link)} className="p-2 text-slate-400 hover:text-terracotta transition-colors" title="Edit">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button onClick={() => deleteItem(link.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">{searchTerm ? 'No matching social links found.' : 'No social links found.'}</p>
                  {!searchTerm && <button onClick={startAdd} className="mt-4 text-terracotta font-bold hover:underline">+ Add your first social link</button>}
                </div>
              )}
            </div>
          )}

          {/* Team List */}
          {activeTab === 'team' && (
            <div className="grid gap-3 lg:gap-4">
              {filteredTeamMembers.length > 0 ? (
                filteredTeamMembers.map(member => (
                  <div key={member.id} className="bg-white p-4 lg:p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm group hover:shadow-md transition-all">
                    <div className="flex items-center space-x-3 lg:space-x-4 min-w-0">
                      <img src={member.imageUrl} alt={member.name} className="w-12 h-12 lg:w-14 lg:h-14 object-cover rounded-full bg-slate-100" />
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 truncate text-sm lg:text-base">{member.name || 'Unnamed member'}</h3>
                        <p className="text-[10px] text-terracotta uppercase tracking-widest truncate">{member.role || 'Role not set'}</p>
                        <p className="text-xs text-slate-500 truncate mt-1">{member.bio || 'Bio not set'}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1 lg:space-x-2 shrink-0">
                      <button onClick={() => startEdit(member)} className="p-2 text-slate-400 hover:text-terracotta transition-colors" title="Edit">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button onClick={() => deleteItem(member.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">{searchTerm ? 'No matching team members found.' : 'No team members found.'}</p>
                  {!searchTerm && <button onClick={startAdd} className="mt-4 text-terracotta font-bold hover:underline">+ Add your first team member</button>}
                </div>
              )}
            </div>
          )}

          {/* Vlog List */}
          {activeTab === 'vlogs' && (
            <div className="grid gap-3 lg:gap-4">
              {filteredVlogEntries.length > 0 ? (
                filteredVlogEntries.map(entry => (
                  <div key={entry.id} className="bg-white p-4 lg:p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm group hover:shadow-md transition-all">
                    <div className="flex items-center space-x-3 lg:space-x-4 min-w-0">
                      <img src={entry.thumbnailUrl} alt={entry.title} className="w-12 h-12 lg:w-14 lg:h-14 object-cover rounded-xl bg-slate-100" />
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 truncate text-sm lg:text-base">{entry.title || 'Untitled vlog'}</h3>
                        <p className="text-[10px] text-terracotta uppercase tracking-widest truncate">{entry.topic || 'Topic not set'} • {entry.duration || 'N/A'}</p>
                        <p className="text-xs text-slate-500 truncate mt-1">{entry.url || 'URL not set'}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1 lg:space-x-2 shrink-0">
                      <button onClick={() => startEdit(entry)} className="p-2 text-slate-400 hover:text-terracotta transition-colors" title="Edit">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button onClick={() => deleteItem(entry.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">{searchTerm ? 'No matching vlog entries found.' : 'No vlog entries found.'}</p>
                  {!searchTerm && <button onClick={startAdd} className="mt-4 text-terracotta font-bold hover:underline">+ Add your first vlog entry</button>}
                </div>
              )}
            </div>
          )}

          {/* Home Content */}
          {activeTab === 'home' && (
            <div className="grid gap-3 lg:gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-base">Home Section</h3>
                <p className="text-xs uppercase tracking-widest text-terracotta mt-1">Hero background configuration</p>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Background Images</p>
                    <p className="text-sm text-slate-800 mt-1">{aboutContent.homeBackgroundImages.length} image(s) configured</p>
                    <p className="text-[11px] text-slate-500 mt-1">When more than one image is added, the hero auto-scrolls endlessly.</p>
                  </div>
                </div>
                <button
                  onClick={() => startEdit(aboutContent)}
                  className="mt-4 px-4 py-2 rounded-lg bg-terracotta text-white text-xs font-bold hover:bg-terracotta-hover transition-colors"
                >
                  Edit Home Content
                </button>
              </div>
            </div>
          )}

          {/* Contact Info */}
          {activeTab === 'contact' && (
            <div className="grid gap-3 lg:gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-base">Inquiry Contact Details</h3>
                <p className="text-xs uppercase tracking-widest text-terracotta mt-1">Displayed on inquiry section</p>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Location</p>
                    <p className="text-sm text-slate-800 mt-1">{contactDetails.location || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Phone Numbers</p>
                    <div className="text-sm text-slate-800 mt-1 space-y-1">
                      {contactDetails.phoneNumbers.length > 0 ? (
                        contactDetails.phoneNumbers.map((phone, index) => <p key={`${phone}-${index}`}>{phone}</p>)
                      ) : (
                        <p>Not set</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Inquiry Email</p>
                    <p className="text-sm text-slate-800 mt-1">{contactDetails.inquiryEmail || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Inquiry WhatsApp Number</p>
                    <p className="text-sm text-slate-800 mt-1">{contactDetails.inquiryWhatsAppNumber || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1.5">
                      Quick Edit Inquiry Email
                    </label>
                    <input
                      type="email"
                      value={contactDetails.inquiryEmail || ''}
                      onChange={(e) => setContactDetails({ ...contactDetails, inquiryEmail: e.target.value })}
                      placeholder="info@miledesigns.com"
                      className="w-full md:w-[28rem] bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">Click Publish Changes to apply this update.</p>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1.5">
                      Quick Edit Inquiry WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={contactDetails.inquiryWhatsAppNumber || ''}
                      onChange={(e) => setContactDetails({ ...contactDetails, inquiryWhatsAppNumber: e.target.value })}
                      placeholder="+18880000000"
                      className="w-full md:w-[28rem] bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">Use international format, e.g. +1XXXXXXXXXX.</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Floating WhatsApp</p>
                    <p className="text-sm text-slate-800 mt-1">{contactDetails.showFloatingWhatsApp ? 'Enabled' : 'Disabled'}</p>
                    <p className="text-xs text-slate-500 mt-1">{contactDetails.floatingWhatsAppMessage || 'Not set'}</p>
                  </div>
                </div>
                <button
                  onClick={() => startEdit(contactDetails)}
                  className="mt-4 px-4 py-2 rounded-lg bg-terracotta text-white text-xs font-bold hover:bg-terracotta-hover transition-colors"
                >
                  Edit Contact Details (Advanced)
                </button>
              </div>
            </div>
          )}

          {/* Admin Profile */}
          {activeTab === 'profile' && (
            <div className="grid gap-3 lg:gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-base">Admin Profile</h3>
                <p className="text-xs uppercase tracking-widest text-terracotta mt-1">Controls admin identity display</p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={adminProfile.avatarUrl || `https://i.pravatar.cc/80?u=${adminProfile.email}`}
                      alt={adminProfile.name}
                      className="w-14 h-14 rounded-full object-cover border border-slate-200 bg-slate-100"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{adminProfile.name || 'Not set'}</p>
                      <p className="text-xs text-slate-500">{adminProfile.email || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 pt-4 space-y-3">
                    <p className="text-xs uppercase tracking-widest font-bold text-slate-500">Change My Password</p>
                    <input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full md:w-[22rem] bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full md:w-[22rem] bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                    />
                    <button
                      onClick={() => void changeMyPassword()}
                      className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => startEdit(adminProfile)}
                  className="mt-4 px-4 py-2 rounded-lg bg-terracotta text-white text-xs font-bold hover:bg-terracotta-hover transition-colors"
                >
                  Edit Admin Profile
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-base">Sub Admins</h3>
                <p className="text-xs uppercase tracking-widest text-terracotta mt-1">Add users who can log into admin portal</p>

                <div className="mt-4 space-y-3">
                  {adminProfile.subAdmins.length > 0 ? (
                    adminProfile.subAdmins.map((subAdmin) => (
                      <div key={subAdmin.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{subAdmin.name}</p>
                          <p className="text-xs text-slate-500">{subAdmin.email}</p>
                          <p className={`text-[10px] mt-1 uppercase tracking-widest font-bold ${subAdmin.enabled ? 'text-sagegreen' : 'text-slate-400'}`}>
                            {subAdmin.enabled ? 'Enabled' : 'Disabled'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleSubAdmin(subAdmin.id)}
                            className="px-3 py-2 rounded-lg border border-slate-300 text-[11px] font-bold text-slate-600 hover:bg-slate-100"
                          >
                            {subAdmin.enabled ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => removeSubAdmin(subAdmin.id)}
                            className="px-3 py-2 rounded-lg bg-red-50 text-red-600 text-[11px] font-bold hover:bg-red-600 hover:text-white transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No sub-admins yet.</p>
                  )}
                </div>

                <div className="mt-5 border-t border-slate-200 pt-4 space-y-3">
                  <p className="text-xs uppercase tracking-widest font-bold text-slate-500">Add Sub Admin</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Name"
                      value={newSubAdmin.name}
                      onChange={(e) => setNewSubAdmin((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newSubAdmin.email}
                      onChange={(e) => setNewSubAdmin((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                    />
                    <input
                      type="password"
                      placeholder="Password (min 8 chars)"
                      value={newSubAdminPassword}
                      onChange={(e) => setNewSubAdminPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                    />
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={newSubAdmin.enabled}
                      onChange={(e) => setNewSubAdmin((prev) => ({ ...prev, enabled: e.target.checked }))}
                      className="rounded border-slate-300 text-terracotta focus:ring-terracotta"
                    />
                    Enable this sub-admin immediately
                  </label>
                  <button
                    onClick={addSubAdmin}
                    className="px-4 py-2 rounded-lg bg-terracotta text-white text-xs font-bold hover:bg-terracotta-hover transition-colors"
                  >
                    Add Sub Admin
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* About Content */}
          {activeTab === 'about' && (
            <div className="grid gap-3 lg:gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-base">About Section Content</h3>
                <p className="text-xs uppercase tracking-widest text-terracotta mt-1">Displayed on public about section</p>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Badge</p>
                    <p className="text-sm text-slate-800 mt-1">{aboutContent.badge || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Heading</p>
                    <p className="text-sm text-slate-800 mt-1">
                      {[aboutContent.headingPrefix, aboutContent.headingHighlight, aboutContent.headingSuffix].filter(Boolean).join(' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Intro</p>
                    <p className="text-sm text-slate-800 mt-1 line-clamp-3">{aboutContent.introText || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Home Background Images</p>
                    <p className="text-sm text-slate-800 mt-1">{aboutContent.homeBackgroundImages.length} image(s) configured</p>
                  </div>
                </div>
                <button
                  onClick={() => startEdit(aboutContent)}
                  className="mt-4 px-4 py-2 rounded-lg bg-terracotta text-white text-xs font-bold hover:bg-terracotta-hover transition-colors"
                >
                  Edit About Content
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 inset-x-0 z-[105] bg-white/95 backdrop-blur border-t border-slate-200 p-3 grid grid-cols-2 gap-2">
        <button
          onClick={saveAll}
          disabled={!hasUnsavedChanges}
          className="w-full bg-sagegreen text-white py-2.5 rounded-xl font-bold text-xs disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
        >
          Publish
        </button>
        <button
          onClick={resetAllData}
          className="w-full bg-red-600/10 text-red-600 py-2.5 rounded-xl font-bold text-xs hover:bg-red-600 hover:text-white transition-colors"
        >
          Reset
        </button>
      </div>

      {toast && (
        <div className="fixed top-4 right-4 z-[130]">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl text-sm font-medium border ${
              toast.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : toast.type === 'error'
                  ? 'bg-red-50 text-red-800 border-red-200'
                  : 'bg-slate-50 text-slate-800 border-slate-200'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      {confirmDialog && (
        <div className="fixed inset-0 z-[120] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-5">
            <h3 className="text-lg font-serif font-bold text-slate-900">{confirmDialog.title}</h3>
            <p className="text-sm text-slate-600 mt-2">{confirmDialog.message}</p>
            <div className="mt-5 flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-terracotta rounded-lg hover:bg-terracotta-hover"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && editingItem && (
        <div className="fixed inset-0 z-[110] bg-slate-950/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl h-[100dvh] sm:h-auto sm:max-h-[90dvh] rounded-none sm:rounded-[1.5rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-serif font-bold text-terracotta">
                {activeTab === 'projects'
                  ? 'Project Details'
                  : activeTab === 'services'
                    ? 'Service Details'
                    : activeTab === 'testimonials'
                      ? 'Testimonial Details'
                      : activeTab === 'socials'
                        ? 'Social Link Details'
                        : activeTab === 'team'
                          ? 'Team Member Details'
                        : activeTab === 'vlogs'
                            ? 'Vlog Entry Details'
                        : activeTab === 'home'
                          ? 'Home Content'
                        : activeTab === 'contact'
                          ? 'Contact Details'
                          : activeTab === 'about'
                            ? 'About Content'
                            : 'Admin Profile'}
              </h2>
              <button onClick={closeEditor} className="text-slate-400 hover:text-slate-900 p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            
            <form id="admin-edit-form" onSubmit={handleEditSubmit} className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto pb-24 sm:pb-6">
              {/* Project Form Fields */}
              {activeTab === 'projects' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Project Image</label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => void handleImageUpload('imageUrl', e.target.files?.[0])}
                        className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-terracotta/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-terracotta hover:file:bg-terracotta/20"
                      />
                      {(editingItem as Project).imageUrl && (
                        <button
                          type="button"
                          onClick={() => void handleImageUpload('imageUrl', null)}
                          className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    {(editingItem as Project).imageUrl && (
                      <img
                        src={(editingItem as Project).imageUrl}
                        alt="Project preview"
                        className="mt-3 h-28 w-full sm:w-40 object-cover rounded-lg border border-slate-200 bg-white"
                      />
                    )}
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

                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Service Image</label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => void handleImageUpload('imageUrl', e.target.files?.[0])}
                        className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-terracotta/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-terracotta hover:file:bg-terracotta/20"
                      />
                      {(editingItem as Service).imageUrl && (
                        <button
                          type="button"
                          onClick={() => void handleImageUpload('imageUrl', null)}
                          className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    {(editingItem as Service).imageUrl && (
                      <img
                        src={(editingItem as Service).imageUrl}
                        alt="Service preview"
                        className="mt-3 h-28 w-full sm:w-40 object-cover rounded-lg border border-slate-200 bg-white"
                      />
                    )}
                  </div>
                </>
              )}

              {/* Testimonial Form Fields */}
              {activeTab === 'testimonials' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Client Avatar (optional)</label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => void handleImageUpload('avatarUrl', e.target.files?.[0])}
                        className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-terracotta/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-terracotta hover:file:bg-terracotta/20"
                      />
                      {(editingItem as Testimonial).avatarUrl && (
                        <button
                          type="button"
                          onClick={() => void handleImageUpload('avatarUrl', null)}
                          className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    {(editingItem as Testimonial).avatarUrl && (
                      <img
                        src={(editingItem as Testimonial).avatarUrl}
                        alt="Avatar preview"
                        className="mt-3 h-20 w-20 object-cover rounded-full border border-slate-200 bg-white"
                      />
                    )}
                  </div>
                </>
              )}

              {/* Social Link Form Fields */}
              {activeTab === 'socials' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Display Name</label>
                      <input
                        type="text"
                        required
                        value={(editingItem as SocialLink).name}
                        onChange={(e) => updateEditingField('name', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Platform</label>
                      <select
                        value={(editingItem as SocialLink).platform}
                        onChange={(e) => updateEditingField('platform', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm outline-none focus:border-terracotta"
                      >
                        {['LinkedIn', 'Instagram', 'Facebook', 'X', 'YouTube', 'TikTok', 'WhatsApp', 'Pinterest', 'Behance', 'Dribbble', 'Website'].map(platform => (
                          <option key={platform} value={platform}>{platform}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Profile URL</label>
                    <input
                      type="url"
                      required
                      value={(editingItem as SocialLink).url}
                      onChange={(e) => updateEditingField('url', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-terracotta"
                    />
                  </div>

                  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={(editingItem as SocialLink).enabled}
                      onChange={(e) => updateEditingField('enabled', e.target.checked)}
                      className="rounded border-slate-300 text-terracotta focus:ring-terracotta"
                    />
                    Show this link on site
                  </label>
                </>
              )}

              {/* Team Form Fields */}
              {activeTab === 'team' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Name</label>
                      <input
                        type="text"
                        required
                        value={(editingItem as TeamMember).name}
                        onChange={(e) => updateEditingField('name', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Role</label>
                      <input
                        type="text"
                        required
                        value={(editingItem as TeamMember).role}
                        onChange={(e) => updateEditingField('role', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Bio</label>
                    <textarea
                      rows={4}
                      required
                      value={(editingItem as TeamMember).bio}
                      onChange={(e) => updateEditingField('bio', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none resize-none focus:border-terracotta"
                    />
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Profile Image</label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => void handleImageUpload('imageUrl', e.target.files?.[0])}
                        className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-terracotta/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-terracotta hover:file:bg-terracotta/20"
                      />
                      {(editingItem as TeamMember).imageUrl && (
                        <button
                          type="button"
                          onClick={() => void handleImageUpload('imageUrl', null)}
                          className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    {(editingItem as TeamMember).imageUrl && (
                      <img
                        src={(editingItem as TeamMember).imageUrl}
                        alt="Team member preview"
                        className="mt-3 h-28 w-full sm:w-40 object-cover rounded-lg border border-slate-200 bg-white"
                      />
                    )}
                  </div>
                </>
              )}

              {/* Vlog Form Fields */}
              {activeTab === 'vlogs' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Title</label>
                      <input
                        type="text"
                        required
                        value={(editingItem as VlogEntry).title}
                        onChange={(e) => updateEditingField('title', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Topic</label>
                      <input
                        type="text"
                        required
                        value={(editingItem as VlogEntry).topic}
                        onChange={(e) => updateEditingField('topic', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Duration</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 10:30"
                        value={(editingItem as VlogEntry).duration}
                        onChange={(e) => updateEditingField('duration', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Video URL</label>
                      <input
                        type="text"
                        required
                        placeholder="youtube.com/... or tiktok.com/... or any public link"
                        value={(editingItem as VlogEntry).url}
                        onChange={(e) => updateEditingField('url', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Thumbnail Image</label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => void handleImageUpload('thumbnailUrl', e.target.files?.[0])}
                        className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-terracotta/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-terracotta hover:file:bg-terracotta/20"
                      />
                      {(editingItem as VlogEntry).thumbnailUrl && (
                        <button
                          type="button"
                          onClick={() => void handleImageUpload('thumbnailUrl', null)}
                          className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    {(editingItem as VlogEntry).thumbnailUrl && (
                      <img
                        src={(editingItem as VlogEntry).thumbnailUrl}
                        alt="Vlog preview"
                        className="mt-3 h-28 w-full sm:w-40 object-cover rounded-lg border border-slate-200 bg-white"
                      />
                    )}
                  </div>
                </>
              )}

              {/* Home Form Fields */}
              {activeTab === 'home' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Home Background Images</label>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => void handleHomeBackgroundUpload(e.target.files)}
                        className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-terracotta/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-terracotta hover:file:bg-terracotta/20"
                      />
                      {(editingItem as AboutContent).homeBackgroundImages.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {(editingItem as AboutContent).homeBackgroundImages.map((image, index) => (
                            <div key={`${image}-${index}`} className="relative group">
                              <img
                                src={image}
                                alt={`Home background ${index + 1}`}
                                className="h-24 w-full object-cover rounded-lg border border-slate-200 bg-white"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const next = [...(editingItem as AboutContent).homeBackgroundImages];
                                  next.splice(index, 1);
                                  updateEditingField('homeBackgroundImages', next);
                                }}
                                className="absolute top-1.5 right-1.5 px-2 py-1 text-[10px] font-bold rounded-md bg-slate-950/75 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Add 2+ images to enable endless auto-scrolling on the Home section background.
                    </p>
                  </div>
                </>
              )}

              {/* Contact Form Fields */}
              {activeTab === 'contact' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Location</label>
                    <input
                      type="text"
                      required
                      value={(editingItem as ContactDetails).location}
                      onChange={(e) => updateEditingField('location', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Phone Numbers (comma separated)</label>
                    <input
                      type="text"
                      required
                      value={(editingItem as ContactDetails).phoneNumbers.join(', ')}
                      onChange={(e) =>
                        updateEditingField(
                          'phoneNumbers',
                          e.target.value
                            .split(',')
                            .map((item) => item.trim())
                            .filter((item) => item)
                        )
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Inquiry Email</label>
                    <input
                      type="email"
                      required
                      value={(editingItem as ContactDetails).inquiryEmail}
                      onChange={(e) => updateEditingField('inquiryEmail', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Inquiry WhatsApp Number</label>
                    <input
                      type="tel"
                      required
                      value={(editingItem as ContactDetails).inquiryWhatsAppNumber}
                      onChange={(e) => updateEditingField('inquiryWhatsAppNumber', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Floating WhatsApp Message</label>
                    <input
                      type="text"
                      value={(editingItem as ContactDetails).floatingWhatsAppMessage}
                      onChange={(e) => updateEditingField('floatingWhatsAppMessage', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                    />
                  </div>

                  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={(editingItem as ContactDetails).showFloatingWhatsApp}
                      onChange={(e) => updateEditingField('showFloatingWhatsApp', e.target.checked)}
                      className="rounded border-slate-300 text-terracotta focus:ring-terracotta"
                    />
                    Show floating WhatsApp button
                  </label>
                </>
              )}

              {/* Admin Profile Form Fields */}
              {activeTab === 'profile' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Admin Name</label>
                      <input
                        type="text"
                        required
                        value={(editingItem as AdminProfile).name}
                        onChange={(e) => updateEditingField('name', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Admin Email</label>
                      <input
                        type="email"
                        required
                        value={(editingItem as AdminProfile).email}
                        onChange={(e) => updateEditingField('email', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Avatar Image</label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => void handleImageUpload('avatarUrl', e.target.files?.[0])}
                        className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-terracotta/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-terracotta hover:file:bg-terracotta/20"
                      />
                      {(editingItem as AdminProfile).avatarUrl && (
                        <button
                          type="button"
                          onClick={() => void handleImageUpload('avatarUrl', null)}
                          className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <img
                      src={(editingItem as AdminProfile).avatarUrl || `https://i.pravatar.cc/100?u=${(editingItem as AdminProfile).email}`}
                      alt="Admin avatar preview"
                      className="mt-3 h-20 w-20 object-cover rounded-full border border-slate-200 bg-white"
                    />
                  </div>

                </>
              )}

              {/* About Form Fields */}
              {activeTab === 'about' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Badge</label>
                      <input
                        type="text"
                        required
                        value={(editingItem as AboutContent).badge}
                        onChange={(e) => updateEditingField('badge', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                      />
                    </div>
                    <div className="sm:col-span-1 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">About Image</label>
                      <div className="flex flex-col gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => void handleImageUpload('imageUrl', e.target.files?.[0])}
                          className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-terracotta/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-terracotta hover:file:bg-terracotta/20"
                        />
                        {(editingItem as AboutContent).imageUrl && (
                          <button
                            type="button"
                            onClick={() => void handleImageUpload('imageUrl', null)}
                            className="w-fit px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      {(editingItem as AboutContent).imageUrl && (
                        <img
                          src={(editingItem as AboutContent).imageUrl}
                          alt="About preview"
                          className="mt-3 h-28 w-full sm:w-44 object-cover rounded-lg border border-slate-200 bg-white"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Certificate Images</label>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => void handleCertificateUpload(e.target.files)}
                        className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-terracotta/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-terracotta hover:file:bg-terracotta/20"
                      />
                      {(editingItem as AboutContent).certificateImages.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {(editingItem as AboutContent).certificateImages.map((image, index) => (
                            <div key={`${image}-${index}`} className="relative group">
                              <img
                                src={image}
                                alt={`Certificate ${index + 1}`}
                                className="h-24 w-full object-cover rounded-lg border border-slate-200 bg-white"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const next = [...(editingItem as AboutContent).certificateImages];
                                  next.splice(index, 1);
                                  updateEditingField('certificateImages', next);
                                }}
                                className="absolute top-1.5 right-1.5 px-2 py-1 text-[10px] font-bold rounded-md bg-slate-950/75 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Heading Prefix</label>
                      <input
                        type="text"
                        required
                        value={(editingItem as AboutContent).headingPrefix}
                        onChange={(e) => updateEditingField('headingPrefix', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Highlight</label>
                      <input
                        type="text"
                        required
                        value={(editingItem as AboutContent).headingHighlight}
                        onChange={(e) => updateEditingField('headingHighlight', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Heading Suffix</label>
                      <input
                        type="text"
                        required
                        value={(editingItem as AboutContent).headingSuffix}
                        onChange={(e) => updateEditingField('headingSuffix', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Intro Text</label>
                    <textarea
                      rows={3}
                      required
                      value={(editingItem as AboutContent).introText}
                      onChange={(e) => updateEditingField('introText', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none resize-none focus:border-terracotta"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Body Text</label>
                    <textarea
                      rows={4}
                      required
                      value={(editingItem as AboutContent).bodyText}
                      onChange={(e) => updateEditingField('bodyText', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none resize-none focus:border-terracotta"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Stats</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(editingItem as AboutContent).stats.map((stat, index) => (
                        <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Value"
                              value={stat.value}
                              onChange={(e) => {
                                const next = [...(editingItem as AboutContent).stats];
                                next[index] = { ...next[index], value: e.target.value };
                                updateEditingField('stats', next);
                              }}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-sm focus:border-terracotta outline-none"
                            />
                            <input
                              type="text"
                              placeholder="Suffix"
                              value={stat.suffix}
                              onChange={(e) => {
                                const next = [...(editingItem as AboutContent).stats];
                                next[index] = { ...next[index], suffix: e.target.value };
                                updateEditingField('stats', next);
                              }}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-sm focus:border-terracotta outline-none"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Label"
                            value={stat.label}
                            onChange={(e) => {
                              const next = [...(editingItem as AboutContent).stats];
                              next[index] = { ...next[index], label: e.target.value };
                              updateEditingField('stats', next);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-sm focus:border-terracotta outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Description"
                            value={stat.description}
                            onChange={(e) => {
                              const next = [...(editingItem as AboutContent).stats];
                              next[index] = { ...next[index], description: e.target.value };
                              updateEditingField('stats', next);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-sm focus:border-terracotta outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Vision Text</label>
                    <input
                      type="text"
                      required
                      value={(editingItem as AboutContent).visionText}
                      onChange={(e) => updateEditingField('visionText', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">CTA Text</label>
                      <input
                        type="text"
                        required
                        value={(editingItem as AboutContent).ctaText}
                        onChange={(e) => updateEditingField('ctaText', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">CTA Button Label</label>
                      <input
                        type="text"
                        required
                        value={(editingItem as AboutContent).ctaButtonText}
                        onChange={(e) => updateEditingField('ctaButtonText', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-terracotta outline-none"
                      />
                    </div>
                  </div>
                </>
              )}
            </form>
            
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-2 shrink-0 sticky bottom-0 z-10">
              <button onClick={closeEditor} className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg sm:border-0 sm:rounded-none">Cancel</button>
              <button type="submit" form="admin-edit-form" className="w-full sm:w-auto px-6 py-2.5 bg-terracotta text-white rounded-lg text-xs font-bold active:scale-95 shadow-lg shadow-terracotta/20">
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

