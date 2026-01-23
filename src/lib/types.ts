
import type { Timestamp } from "firebase/firestore";

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
};

export type Profile = {
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  resumeUrl: string;
  avatarUrl: string;
  contactSubtitle?: string;
  responseTime?: string;
  availability?: string;
  socialLinks?: SocialLink[];
};

export type Project = {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  techStack: string[];
  githubUrl: string;
  liveDemoUrl: string;
  featured: boolean;
  imageUrl: string;
  orderIndex: number;
};

export type Skill = {
  name: string;
  category: "Technical" | "Tools";
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
};

export type Education = {
  id:string;
  degree: string;
  institution: string;
  duration: string;
  score: string;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Timestamp;
  read: boolean;
};

export type Theme = {
  primaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textPrimaryColor: string;
  useGradientBorder: boolean;
  gradientStartColor: string;
  gradientEndColor: string;
};

export type DashboardStats = {
  projects: number;
  skills: number;
  education: number;
  messages: number;
  experience: number;
};
