
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
}

export interface Project {
  id: string;
  title: string;
  category: 'Residential' | 'Commercial' | 'Industrial';
  location: string;
  imageUrl: string;
  year: number;
  description?: string;
  features?: string[];
  gallery?: string[];
  tags: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  projectType: string;
  feedback: string;
  rating: number;
  avatarUrl?: string;
}

export interface SocialLink {
  id: string;
  name: string;
  platform:
    | 'LinkedIn'
    | 'Instagram'
    | 'Facebook'
    | 'X'
    | 'YouTube'
    | 'TikTok'
    | 'WhatsApp'
    | 'Pinterest'
    | 'Behance'
    | 'Dribbble'
    | 'Website';
  url: string;
  enabled: boolean;
}

export interface ContactDetails {
  id: string;
  location: string;
  phoneNumbers: string[];
  inquiryEmail: string;
  inquiryWhatsAppNumber: string;
  showFloatingWhatsApp: boolean;
  floatingWhatsAppMessage: string;
}

export interface AboutStat {
  value: string;
  suffix: string;
  label: string;
  description: string;
}

export interface SubAdmin {
  id: string;
  name: string;
  email: string;
  enabled: boolean;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  subAdmins: SubAdmin[];
}

export interface SiteContentData {
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  socialLinks: SocialLink[];
  contactDetails: ContactDetails;
  aboutContent: AboutContent;
  teamMembers: TeamMember[];
  vlogEntries: VlogEntry[];
  adminProfile: AdminProfile;
}

export interface AboutContent {
  id: string;
  badge: string;
  headingPrefix: string;
  headingHighlight: string;
  headingSuffix: string;
  introText: string;
  bodyText: string;
  stats: AboutStat[];
  homeBackgroundImages: string[];
  imageUrl: string;
  visionText: string;
  ctaText: string;
  ctaButtonText: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

export interface VlogEntry {
  id: string;
  title: string;
  topic: string;
  duration: string;
  thumbnailUrl: string;
  url: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CostEstimate {
  category: string;
  value: number;
  color: string;
}
