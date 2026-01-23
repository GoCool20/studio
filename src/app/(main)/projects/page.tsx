import Image from "next/image";
import Link from "next/link";
import { getProjects } from "@/lib/firestore";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { ProjectFilters } from "./ProjectFilters";

export default async function ProjectsPage() {
  const projects = await getProjects();
  const allTech = Array.from(new Set(projects.flatMap(p => p.techStack)));

  return (
    <div className="container py-12 md:py-16">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
          My Work
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          A collection of projects I've built.
        </p>
      </header>

      <ProjectFilters allTech={allTech} projects={projects} />
    </div>
  );
}
