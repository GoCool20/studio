import { getProjects } from "@/lib/firestore";
import { ProjectFilters } from "./ProjectFilters";

export default async function ProjectsPage() {
  const projects = await getProjects();
  const allTech = Array.from(new Set(projects.flatMap(p => p.techStack)));

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
      <header className="mb-16 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">
          My Work
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          A collection of projects I've built.
        </p>
      </header>

      <ProjectFilters allTech={allTech} projects={projects} />
    </div>
  );
}
