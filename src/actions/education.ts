
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import type { Education } from "@/lib/types";

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
    revalidatePath("/admin/education");
    revalidatePath("/about");

    return {
      success: true,
      message: "Education details updated successfully!",
    };
  } catch (error) {
    console.error("Error revalidating education:", error);
    return {
      success: false,
      message: "An unexpected error occurred during revalidation. Please try again.",
    };
  }
}
