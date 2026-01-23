
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import type { Skill } from "@/lib/types";

const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required."),
  category: z.enum(["Technical", "Tools"]),
});

const updateSkillsSchema = z.object({
  skills: z.array(skillSchema),
});

export async function updateSkills(data: { skills: Skill[] }) {
  const validatedFields = updateSkillsSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid data provided.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    revalidatePath("/admin/skills");
    revalidatePath("/about");
    revalidatePath("/");

    return {
      success: true,
      message: "Skills updated successfully!",
    };
  } catch (error) {
    console.error("Error revalidating skills:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
