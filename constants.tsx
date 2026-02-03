
import React from 'react';
import { Service, Project, Testimonial } from './types';

export const SERVICES: Service[] = [
  {
    id: 'arch-design',
    title: 'Architectural Design',
    description: 'Bespoke architectural solutions that blend aesthetics with structural integrity.',
    icon: '📐',
    imageUrl: 'https://picsum.photos/seed/arch/800/600'
  },
  {
    id: 'new-const',
    title: 'New Construction',
    description: 'Turnkey construction projects from ground-breaking to final handover.',
    icon: '🏗️',
    imageUrl: 'https://picsum.photos/seed/const/800/600'
  },
  {
    id: 'interior',
    title: 'Interior Curation',
    description: 'Modern, sustainable, and functional interior designs for living and working.',
    icon: '🛋️',
    imageUrl: 'https://picsum.photos/seed/interior/800/600'
  },
  {
    id: 'reno',
    title: 'Renovation & Retrofit',
    description: 'Breathing new life into existing structures with modern upgrades.',
    icon: '🔨',
    imageUrl: 'https://picsum.photos/seed/reno/800/600'
  }
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'The Obsidian Villa',
    category: 'Residential',
    location: 'Beverly Hills, CA',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070',
    year: 2023,
    tags: ['Luxury', 'Minimalist', 'Smart Home'],
    description: 'A masterclass in modern minimalism, The Obsidian Villa integrates raw concrete textures with expansive glass facades. This residential project prioritizes seamless indoor-outdoor living, featuring a cantilevered terrace and a gravity-defying infinity pool.',
    features: ['Solar Integration', 'Smart Home Automation', 'Custom Millwork', 'Sustainable Water Recycling'],
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: '2',
    title: 'Nexus Hub',
    category: 'Commercial',
    location: 'Austin, TX',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2070',
    year: 2024,
    tags: ['Biophilic', 'Sustainable', 'Tech'],
    description: 'Nexus Hub redefines the collaborative workspace. Located in the heart of Austin’s tech corridor, this 50,000 sq. ft. commercial building features biophilic design elements, including an interior three-story vertical garden and high-efficiency climate control systems.',
    features: ['LEED Platinum Certified', 'Open-Concept Layouts', 'Biophilic Design', 'Advanced VRV Cooling'],
    gallery: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: '3',
    title: 'Green Canopy Estate',
    category: 'Residential',
    location: 'Seattle, WA',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2070',
    year: 2022,
    tags: ['Sustainable', 'Timber', 'Modern'],
    description: 'Nestled in the lush hills of Seattle, Green Canopy Estate is a timber-frame marvel. Constructed using reclaimed Pacific Northwest cedar, the estate balances luxury with deep environmental responsibility.',
    features: ['Zero-Carbon Footprint', 'Rainwater Harvesting', 'Triple-Pane Glazing', 'Native Landscaping'],
    gallery: [
      'https://images.unsplash.com/photo-1513584684374-8bdb7483fe8f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: '4',
    title: 'Industrial Loft X',
    category: 'Industrial',
    location: 'Brooklyn, NY',
    imageUrl: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=2070',
    year: 2023,
    tags: ['Industrial', 'Adaptive Reuse', 'Modern'],
    description: 'A transformation of a 1920s warehouse into a cutting-edge creative studio. Industrial Loft X retains its grit with exposed brick and steel beams, while introducing modern acoustic treatments and high-speed data infrastructure.',
    features: ['Historic Retrofitting', 'Acoustic Engineering', 'Custom Industrial Finishes', 'Mezzanine Studio'],
    gallery: [
      'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1536376074432-8864a665977a?auto=format&fit=crop&q=80&w=800'
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Julian Montgomery',
    projectType: 'Luxury Residential',
    feedback: "Structura's attention to detail during the architectural phase was unparalleled. They didn't just build a house; they built our dream home with precision and care.",
    rating: 5,
    avatarUrl: 'https://i.pravatar.cc/150?u=julian'
  },
  {
    id: 't2',
    name: 'Sarah Kensington',
    projectType: 'Commercial Office Hub',
    feedback: "Professionalism and efficiency. The Nexus Hub project was delivered ahead of schedule without compromising on the high-end finishes we requested. Exceptional team.",
    rating: 5,
    avatarUrl: 'https://i.pravatar.cc/150?u=sarah'
  },
  {
    id: 't3',
    name: 'Dr. Elena Rossi',
    projectType: 'Sustainable Estate',
    feedback: "The sustainable materials they suggested not only look stunning but have significantly reduced our energy footprint. Truly forward-thinking builders in every sense.",
    rating: 5,
    avatarUrl: 'https://i.pravatar.cc/150?u=elena'
  }
];
