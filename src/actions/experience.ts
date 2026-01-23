"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import type { Experience } from "@/lib/types";

const experienceEntrySchema = z.object({
  id: z.string(),
  role: z.string().min(1, "Role is required."),
  company: z.string().min(1, "Company is required."),
  duration: z.string().min(1, "Duration is required."),
  description: z.string().min(1, "Description is required."),
});

const updateExperienceSchema = z.object({
  entries: z.array(experienceEntrySchema),
});

export async function updateExperienceAction(data: { entries: Experience[] }) {
  const validatedFields = updateExperienceSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid data provided. Please check the fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    revalidatePath("/admin/experience");
    revalidatePath("/about");

    return {
      success: true,
      message: "Experience details updated successfully!",
    };
  } catch (error) {
    console.error("Error revalidating experience:", error);
    return {
      success: false,
      message: "An unexpected error occurred during revalidation. Please try again.",
    };
  }
}
