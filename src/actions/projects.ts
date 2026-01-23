"use server";

import { z } from "zod";
import { collection, addDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  detailedDescription: z.string().min(1, "Detailed description is required"),
  techStack: z.preprocess((val) => {
      if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
      return val;
    }, z.array(z.string()).min(1, "At least one tech stack item is required")),
  githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal('')),
  liveDemoUrl: z.string().url("Invalid live demo URL").optional().or(z.literal('')),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal('')),
  featured: z.boolean(),
});

export async function createProject(data: FormData) {
  const formData = Object.fromEntries(data);
  formData.featured = formData.featured === 'on';

  const validatedFields = projectSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await addDoc(collection(firestore, "projects"), validatedFields.data);
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
  
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function updateProject(id: string, data: FormData) {
    const formData = Object.fromEntries(data);
    formData.featured = formData.featured === 'on';

    const validatedFields = projectSchema.safeParse(formData);

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const projectRef = doc(firestore, "projects", id);
        await setDoc(projectRef, validatedFields.data);
    } catch (error) {
        console.error("Error updating project:", error);
        return { success: false, message: "An unexpected error occurred." };
    }

    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/edit/${id}`);
    revalidatePath("/projects");
    revalidatePath(`/projects/${id}`);
    revalidatePath("/");
    redirect("/admin/projects");
}

export async function deleteProject(id: string) {
    try {
        await deleteDoc(doc(firestore, "projects", id));
        revalidatePath("/admin/projects");
        revalidatePath("/projects");
        revalidatePath("/");
        return { success: true, message: "Project deleted successfully." };
    } catch (error) {
        console.error("Error deleting project:", error);
        return { success: false, message: "Failed to delete project." };
    }
}
