import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { firestore } from "./firebase";
import type { Profile, Project, Skill, Education, Theme, DashboardStats, Message, Experience } from "./types";
import { unstable_noStore as noStore } from 'next/cache';

const defaultTheme: Theme = {
  primaryColor: "#4F46E5",
  backgroundColor: "#0B1020",
  surfaceColor: "#121A33",
  textPrimaryColor: "#E6E8F2",
  useGradientBorder: true,
  gradientStartColor: "#4F46E5",
  gradientEndColor: "#9333ea",
};

export async function getTheme(): Promise<Theme> {
  noStore();
  try {
    const docRef = doc(firestore, 'theme', 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Ensure default values are present if they are missing from Firestore
      return {
        ...defaultTheme,
        ...data,
      } as Theme;
    }
    return defaultTheme;
  } catch (error) {
    console.error("Error fetching theme:", error);
    return defaultTheme;
  }
}

export async function getProfile(): Promise<Profile> {
  noStore();
  try {
    const docRef = doc(firestore, 'profile', 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Profile;
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
  return {
    name: 'Your Name',
    title: 'Professional Title',
    bio: 'Welcome to your portfolio. This is a brief bio that you can edit in the admin dashboard.',
    location: 'City, Country',
    email: 'youremail@example.com',
    resumeUrl: '',
    avatarUrl: '',
    contactSubtitle: "Have a project in mind or want to discuss a potential collaboration? I'd love to hear from you.",
    responseTime: "24 hours",
    availability: "Available for remote work worldwide",
    socialLinks: [
      { id: '1', platform: 'linkedin', url: 'https://linkedin.com' },
      { id: '2', platform: 'github', url: 'https://github.com' },
    ]
  };
}

export async function getProjects(options: { featured?: boolean } = {}): Promise<Project[]> {
  noStore();
  try {
    const projectsRef = collection(firestore, "projects");
    
    const queryConstraints = [];
    if (options.featured) {
      queryConstraints.push(where("featured", "==", true));
    }
    queryConstraints.push(orderBy("orderIndex", "asc"));
    
    const q = query(projectsRef, ...queryConstraints);

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
    noStore();
    try {
        const docRef = doc(firestore, 'projects', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Project;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching project with id ${id}:`, error);
        return null;
    }
}


export async function getSkills(): Promise<Skill[]> {
  noStore();
  try {
    const docRef = doc(firestore, 'skills', 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().skills) {
      return docSnap.data().skills as Skill[];
    }
  } catch (error) {
    console.error("Error fetching skills:", error);
  }
  return [];
}

export async function getExperience(): Promise<Experience[]> {
  noStore();
  try {
    const docRef = doc(firestore, 'experience', 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().entries) {
      return docSnap.data().entries as Experience[];
    }
  } catch (error) {
    console.error("Error fetching experience:", error);
  }
  return [];
}

export async function getEducation(): Promise<Education[]> {
  noStore();
  try {
    const docRef = doc(firestore, 'education', 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().entries) {
      return docSnap.data().entries as Education[];
    }
  } catch (error) {
    console.error("Error fetching education:", error);
  }
  return [];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  noStore();
  try {
    const [projectsSnap, skillsSnap, educationSnap, messagesSnap, experienceSnap] = await Promise.all([
      getDocs(collection(firestore, "projects")),
      getDoc(doc(firestore, "skills", "main")),
      getDoc(doc(firestore, "education", "main")),
      getDocs(query(collection(firestore, "messages"), where("read", "==", false))),
      getDoc(doc(firestore, "experience", "main")),
    ]);

    const skills = skillsSnap.exists() ? (skillsSnap.data().skills?.length || 0) : 0;
    const education = educationSnap.exists() ? (educationSnap.data().entries?.length || 0) : 0;
    const experience = experienceSnap.exists() ? (experienceSnap.data().entries?.length || 0) : 0;
    
    return {
      projects: projectsSnap.size,
      skills: skills,
      education: education,
      messages: messagesSnap.size,
      experience: experience,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { projects: 0, skills: 0, education: 0, messages: 0, experience: 0 };
  }
}

export async function getMessages(): Promise<Message[]> {
  noStore();
  try {
    const messagesRef = collection(firestore, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}
