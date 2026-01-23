
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

const socialLinkSchema = z.object({
  id: z.string(),
  platform: z.string().min(1, "Platform name is required"),
  url: z.string().url("Invalid URL").or(z.literal('')),
});

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  bio: z.string().min(1, "Bio is required"),
  location: z.string().min(1, "Location is required"),
  email: z.string().email("Invalid email address"),
  resumeUrl: z.string().url("Invalid URL for resume").or(z.literal('')),
  avatarUrl: z.string().url("Invalid URL for avatar").optional().or(z.literal('')),
  contactSubtitle: z.string().optional(),
  responseTime: z.string().optional(),
  availability: z.string().optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
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
    revalidatePath("/contact");

    return { success: true, message: "Profile updated successfully!" };
  } catch (error) {
    console.error("Error revalidating profile:", error);
    return { success: false, message: "An unexpected error occurred during revalidation." };
  }
}
