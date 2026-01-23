
import { getEducation } from "@/lib/firestore";
import { EducationForm } from "./EducationForm";

export default async function AdminEducationPage() {
  const educationEntries = await getEducation();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="font-headline text-3xl font-bold tracking-tight mb-8">Education</h1>
      <EducationForm initialData={educationEntries} />
    </div>
  );
}
