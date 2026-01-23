import { getTheme } from "@/lib/firestore";
import { ThemeForm } from "./ThemeForm";

export default async function AdminThemePage() {
  const theme = await getTheme();
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="font-headline text-3xl font-bold tracking-tight mb-8">Theme</h1>
      <ThemeForm theme={theme} />
    </div>
  );
}
