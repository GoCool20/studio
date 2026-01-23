
"use server";

import { z } from "zod";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import type { Education } from "@/lib/types";
import { revalidatePath } from "next/cache";

const educationEntrySchema = z.object({
  id: z.string(),
  degree: z.string().min(1, "Degree is required."),
  institution: z.string().min(1, "Institution is required."),
  duration: z.string().min(1, "Duration is required."),
  score: z.string().min(1, "Score/CGPA is required."),
});

const updateEducationSchema = z.object({
  entries: z.array(educationEntrySchema),
});

export async function updateEducationAction(data: { entries: Education[] }) {
  const validatedFields = updateEducationSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid data provided. Please check the fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const educationRef = doc(firestore, "education", "main");
    await setDoc(educationRef, { entries: validatedFields.data.entries });

    revalidatePath("/admin/education");
    revalidatePath("/about");

    return {
      success: true,
      message: "Education details updated successfully!",
    };
  } catch (error) {
    console.error("Error updating education:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
