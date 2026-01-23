
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  bio: z.string().min(1, "Bio is required"),
  location: z.string().min(1, "Location is required"),
  email: z.string().email("Invalid email address"),
  resumeUrl: z.string().url("Invalid URL for resume").or(z.literal('')),
  avatarUrl: z.string().url("Invalid URL for avatar").optional().or(z.literal('')),
});

export async function updateProfile(data: z.infer<typeof profileSchema>) {
  const validatedFields = profileSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // This action is now only for revalidation.
    revalidatePath("/admin/profile");
    revalidatePath("/");
    revalidatePath("/about");

    return { success: true, message: "Profile updated successfully!" };
  } catch (error) {
    console.error("Error revalidating profile:", error);
    return { success: false, message: "An unexpected error occurred during revalidation." };
  }
}
