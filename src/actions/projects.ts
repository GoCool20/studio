
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';

export async function revalidateProjects() {
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
}

export async function revalidateAndRedirectProjects() {
    await revalidateProjects();
    redirect("/admin/projects");
}

export async function deleteProjectAction() {
    await revalidateProjects();
    return { success: true, message: "Project deleted successfully." };
}
