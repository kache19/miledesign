
import { AboutContent, ContactDetails, Project, Service, SocialLink, TeamMember, Testimonial, VlogEntry } from '../types';
import { ABOUT_CONTENT, CONTACT_DETAILS, PROJECTS, SERVICES, SOCIAL_LINKS, TEAM_MEMBERS, TESTIMONIALS, VLOG_ENTRIES } from '../constants';

const KEYS = {
  PROJECTS: 'miledesigns_projects',
  SERVICES: 'miledesigns_services',
  TESTIMONIALS: 'miledesigns_testimonials',
  SOCIAL_LINKS: 'miledesigns_social_links',
  CONTACT_DETAILS: 'miledesigns_contact_details',
  ABOUT_CONTENT: 'miledesigns_about_content',
  TEAM_MEMBERS: 'miledesigns_team_members',
  VLOG_ENTRIES: 'miledesigns_vlog_entries'
};

export const storageService = {
  getProjects: (): Project[] => {
    const saved = localStorage.getItem(KEYS.PROJECTS);
    return saved ? JSON.parse(saved) : PROJECTS;
  },
  saveProjects: (data: Project[]) => {
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(data));
  },

  getServices: (): Service[] => {
    const saved = localStorage.getItem(KEYS.SERVICES);
    return saved ? JSON.parse(saved) : SERVICES;
  },
  saveServices: (data: Service[]) => {
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(data));
  },

  getTestimonials: (): Testimonial[] => {
    const saved = localStorage.getItem(KEYS.TESTIMONIALS);
    return saved ? JSON.parse(saved) : TESTIMONIALS;
  },
  saveTestimonials: (data: Testimonial[]) => {
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(data));
  },

  getSocialLinks: (): SocialLink[] => {
    const saved = localStorage.getItem(KEYS.SOCIAL_LINKS);
    if (!saved) return SOCIAL_LINKS;
    const parsed = JSON.parse(saved) as SocialLink[];
    const existingIds = new Set(parsed.map((item) => item.id));
    const missingDefaults = SOCIAL_LINKS.filter((item) => !existingIds.has(item.id));
    return missingDefaults.length > 0 ? [...parsed, ...missingDefaults] : parsed;
  },
  saveSocialLinks: (data: SocialLink[]) => {
    localStorage.setItem(KEYS.SOCIAL_LINKS, JSON.stringify(data));
  },

  getContactDetails: (): ContactDetails => {
    const saved = localStorage.getItem(KEYS.CONTACT_DETAILS);
    if (!saved) return CONTACT_DETAILS;
    const parsed = JSON.parse(saved) as Partial<ContactDetails>;
    return {
      ...CONTACT_DETAILS,
      ...parsed,
      phoneNumbers: Array.isArray(parsed.phoneNumbers) ? parsed.phoneNumbers : CONTACT_DETAILS.phoneNumbers
    };
  },
  saveContactDetails: (data: ContactDetails) => {
    localStorage.setItem(KEYS.CONTACT_DETAILS, JSON.stringify(data));
  },

  getAboutContent: (): AboutContent => {
    const saved = localStorage.getItem(KEYS.ABOUT_CONTENT);
    return saved ? JSON.parse(saved) : ABOUT_CONTENT;
  },
  saveAboutContent: (data: AboutContent) => {
    localStorage.setItem(KEYS.ABOUT_CONTENT, JSON.stringify(data));
  },

  getTeamMembers: (): TeamMember[] => {
    const saved = localStorage.getItem(KEYS.TEAM_MEMBERS);
    return saved ? JSON.parse(saved) : TEAM_MEMBERS;
  },
  saveTeamMembers: (data: TeamMember[]) => {
    localStorage.setItem(KEYS.TEAM_MEMBERS, JSON.stringify(data));
  },

  getVlogEntries: (): VlogEntry[] => {
    const saved = localStorage.getItem(KEYS.VLOG_ENTRIES);
    return saved ? JSON.parse(saved) : VLOG_ENTRIES;
  },
  saveVlogEntries: (data: VlogEntry[]) => {
    localStorage.setItem(KEYS.VLOG_ENTRIES, JSON.stringify(data));
  },

  reset: () => {
    localStorage.clear();
    window.location.reload();
  }
};
