"use server";

import { z } from "zod";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
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
    const themeRef = doc(firestore, "theme", "main");
    await setDoc(themeRef, validatedFields.data);

    // Revalidate all pages to apply the new theme
    revalidatePath("/", "layout");

    return { success: true, message: "Theme updated successfully!" };
  } catch (error) {
    console.error("Error updating theme:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}
