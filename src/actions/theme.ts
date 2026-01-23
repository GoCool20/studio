
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

const themeSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color"),
  backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color"),
  surfaceColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color"),
  textPrimaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color"),
});

export async function updateTheme(data: z.infer<typeof themeSchema>) {
  const validatedFields = themeSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // Revalidate all pages to apply the new theme
    revalidatePath("/", "layout");

    return { success: true, message: "Theme updated successfully!" };
  } catch (error) {
    console.error("Error revalidating theme:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}
