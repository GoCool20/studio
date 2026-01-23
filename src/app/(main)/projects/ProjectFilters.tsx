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
      <div className="mb-12 flex flex-wrap justify-center gap-3">
        <Button
          variant={selectedTech === null ? "default" : "secondary"}
          onClick={() => setSelectedTech(null)}
          size="sm"
        >
          All
        </Button>
        {allTech.map((tech) => (
          <Button
            key={tech}
            variant={selectedTech === tech ? "default" : "secondary"}
            onClick={() => setSelectedTech(tech)}
            size="sm"
          >
            {tech}
          </Button>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-2">
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
            <CardContent className="flex-1 p-6">
              <CardTitle className="text-2xl">{project.title}</CardTitle>
              <CardDescription className="mt-3 text-base leading-relaxed">{project.shortDescription}</CardDescription>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-6">
              <Button asChild className="w-full" variant="secondary">
                <Link href={`/projects/${project.id}`}>
                  View Details <ArrowRight />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
