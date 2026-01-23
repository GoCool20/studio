import { getProjects } from "@/lib/firestore";
import { ProjectsClient } from "./ProjectsClient";

export default async function AdminProjectsPage() {
  const projects = await getProjects();
  
  return (
    <div className="w-full">
        <h1 className="font-headline text-3xl font-bold tracking-tight mb-8">Projects</h1>
        <ProjectsClient projects={projects} />
    </div>
  );
}
