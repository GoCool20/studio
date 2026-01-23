"use server";

import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { revalidatePath } from "next/cache";

export async function toggleMessageRead(id: string, read: boolean) {
  try {
    const messageRef = doc(firestore, "messages", id);
    await updateDoc(messageRef, { read: !read });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Error toggling message read status:", error);
    return { success: false, message: "Failed to update message." };
  }
}

export async function deleteMessage(id: string) {
  try {
    await deleteDoc(doc(firestore, "messages", id));
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Error deleting message:", error);
    return { success: false, message: "Failed to delete message." };
  }
}
