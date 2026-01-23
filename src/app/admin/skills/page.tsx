import { getSkills } from "@/lib/firestore";
import { SkillsForm } from "./SkillsForm";

export default async function AdminSkillsPage() {
  const skills = await getSkills();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="font-headline text-3xl font-bold tracking-tight mb-8">Skills</h1>
      <SkillsForm initialSkills={skills} />
    </div>
  );
}
