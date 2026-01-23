
"use server";

import { revalidatePath } from "next/cache";

export async function revalidateMessages() {
  revalidatePath("/admin/messages");
}
