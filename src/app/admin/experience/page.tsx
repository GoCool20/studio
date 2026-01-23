import { getExperience } from "@/lib/firestore";
import { ExperienceForm } from "./ExperienceForm";

export default async function AdminExperiencePage() {
  const experienceEntries = await getExperience();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="font-headline text-3xl font-bold tracking-tight mb-8">Experience</h1>
      <ExperienceForm initialData={experienceEntries} />
    </div>
  );
}
