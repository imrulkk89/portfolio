export type Theme = 'dark' | 'light';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'Full Stack' | 'Cloud & Data' | 'Microservices' | 'Systems & IoT';
  description: string;
  techStack: string[];
  metrics?: string[];
  highlights: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  role: string;
  clientOrCompany?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  skills: {
    name: string;
    level: 'Expert' | 'Advanced' | 'Proficient';
    years?: string;
    featured?: boolean;
  }[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  period: string;
  badge?: string;
  description: string;
  highlights: string[];
  technologies: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
  source?: 'form' | 'terminal';
}

export interface TerminalOutput {
  id: string;
  command: string;
  outputType: 'text' | 'projects' | 'skills' | 'experience' | 'contact' | 'code' | 'help' | 'error' | 'success' | 'system' | 'messages';
  data?: any;
  timestamp: string;
}

export interface SystemStatus {
  status: 'online' | 'degraded' | 'offline';
  database: 'mongodb' | 'embedded_mongo';
  databaseStatus: 'connected' | 'simulated';
  golangService: 'active' | 'ready';
  uptimeSeconds: number;
  messageCount: number;
}
