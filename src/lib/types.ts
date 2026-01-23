import type { Timestamp } from "firebase/firestore";

export type Profile = {
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  resumeUrl: string;
  avatarUrl: string;
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
};

export type Skill = {
  name: string;
  category: "Technical" | "Tools";
};

export type Education = {
  id: string;
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
};

export type DashboardStats = {
  projects: number;
  skills: number;
  education: number;
  messages: number;
};
