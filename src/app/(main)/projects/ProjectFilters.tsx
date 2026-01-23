"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Github, ExternalLink } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

type ProjectFiltersProps = {
  allTech: string[];
  projects: Project[];
};

const ProjectCard = ({ project }: { project: Project }) => (
    <Card className="group flex flex-col overflow-hidden h-full">
      <Link href={`/projects/${project.id}`} aria-label={`View details for ${project.title}`}>
        <CardHeader className="p-0">
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={project.imageUrl || `https://picsum.photos/seed/${project.id}/600/400`}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="web app"
            />
          </div>
        </CardHeader>
      </Link>
      <CardContent className="flex flex-1 flex-col p-6">
        <CardTitle className="mb-2 text-xl font-bold group-hover:text-primary">
          <Link href={`/projects/${project.id}`}>{project.title}</Link>
        </CardTitle>
        <CardDescription className="mb-4 flex-grow text-muted-foreground">
          {project.shortDescription}
        </CardDescription>
        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
          {project.techStack.length > 3 && (
            <Badge variant="outline">+{project.techStack.length - 3}</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-6 pt-0">
        <Button asChild variant="link" className="p-0 text-sm font-semibold text-foreground hover:text-primary">
          <Link href={`/projects/${project.id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-1">
          {project.githubUrl && (
            <Button asChild variant="outline" size="icon" className="h-8 w-8">
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">
                <Github className="h-4 w-4 text-muted-foreground" />
              </a>
            </Button>
          )}
          {project.liveDemoUrl && (
            <Button asChild variant="outline" size="icon" className="h-8 w-8">
              <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" aria-label="Live demo">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
);

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

      {selectedTech === null ? (
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {projects.map((project) => (
              <CarouselItem key={project.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <ProjectCard project={project} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex" />
          <CarouselNext className="hidden lg:flex" />
        </Carousel>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
      )}

    </>
  );
}
