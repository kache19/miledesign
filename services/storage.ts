
import { Project, Service, Testimonial } from '../types';
import { PROJECTS, SERVICES, TESTIMONIALS } from '../constants';

const KEYS = {
  PROJECTS: 'miledesigns_projects',
  SERVICES: 'miledesigns_services',
  TESTIMONIALS: 'miledesigns_testimonials'
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

  reset: () => {
    localStorage.clear();
    window.location.reload();
  }
};
