"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

type ProjectFiltersProps = {
  allTech: string[];
  projects: Project[];
};

export function ProjectFilters({ allTech, projects }: ProjectFiltersProps) {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const filteredProjects = selectedTech
    ? projects.filter((p) => p.techStack.includes(selectedTech))
    : projects;

  return (
    <>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <Button
          variant={selectedTech === null ? "default" : "secondary"}
          onClick={() => setSelectedTech(null)}
        >
          All
        </Button>
        {allTech.map((tech) => (
          <Button
            key={tech}
            variant={selectedTech === tech ? "default" : "secondary"}
            onClick={() => setSelectedTech(tech)}
          >
            {tech}
          </Button>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="flex flex-col overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative h-56 w-full">
                <Image
                  src={project.imageUrl || `https://picsum.photos/seed/${project.id}/600/400`}
                  alt={project.title}
                  fill
                  className="object-cover"
                  data-ai-hint="web app"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 pt-6">
              <CardTitle className="font-headline text-xl">{project.title}</CardTitle>
              <CardDescription className="mt-2 text-base">{project.shortDescription}</CardDescription>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/projects/${project.id}`}>
                  View Details <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
