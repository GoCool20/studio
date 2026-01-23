import { getProjectById } from "@/lib/firestore";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Globe } from "lucide-react";
import Link from "next/link";

type ProjectDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="relative mb-8 h-80 w-full overflow-hidden rounded-lg shadow-lg">
          <Image
            src={project.imageUrl || `https://picsum.photos/seed/${project.id}/1200/800`}
            alt={project.title}
            fill
            className="object-cover"
            data-ai-hint="web app"
          />
        </div>

        <header className="mb-8">
          <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">{project.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{project.shortDescription}</p>
        </header>

        <div className="mb-8 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="secondary">{tech}</Badge>
          ))}
        </div>

        <article className="prose prose-invert max-w-none">
          <p>{project.detailedDescription}</p>
        </article>

        <div className="mt-12 flex flex-wrap gap-4">
          {project.liveDemoUrl && (
            <Button asChild>
              <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-4 w-4" /> Live Demo
              </a>
            </Button>
          )}
          {project.githubUrl && (
            <Button asChild variant="outline">
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" /> View on GitHub
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
