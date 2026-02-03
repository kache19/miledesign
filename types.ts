
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

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CostEstimate {
  category: string;
  value: number;
  color: string;
}
