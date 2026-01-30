
import { getProjectById } from "@/lib/firestore";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Globe } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

  const galleryImages = [
    project.imageUrl,
    ...(project.gallery || [])
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-4xl px-4 py-24 md:px-8 md:py-32">
      {galleryImages.length > 1 ? (
        <Carousel className="w-full mb-12 shadow-soft-lg rounded-lg overflow-hidden">
          <CarouselContent>
            {galleryImages.map((img, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-video w-full">
                  <Image
                    src={img || `https://picsum.photos/seed/${project.id}-${index}/1200/800`}
                    alt={`${project.title} - image ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 md:left-8 border-0 bg-background/50 text-foreground hover:bg-background/80" />
          <CarouselNext className="right-4 md:right-8 border-0 bg-background/50 text-foreground hover:bg-background/80" />
        </Carousel>
      ) : (
        <div className="relative mb-12 h-96 w-full overflow-hidden rounded-lg shadow-soft-lg">
          <Image
            src={project.imageUrl || `https://picsum.photos/seed/${project.id}/1200/800`}
            alt={project.title}
            fill
            className="object-cover"
            data-ai-hint="web app"
            unoptimized
          />
        </div>
      )}

      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">{project.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{project.shortDescription}</p>
      </header>

      <div className="mb-12 flex flex-wrap justify-center gap-3">
        {project.techStack.map((tech) => (
          <Badge key={tech} variant="secondary" className="px-4 py-2 text-sm">{tech}</Badge>
        ))}
      </div>

      <article className="prose prose-invert mx-auto max-w-prose text-lg leading-relaxed">
        <p>{project.detailedDescription}</p>
      </article>

      <div className="mt-16 flex flex-wrap justify-center gap-4">
        {project.liveDemoUrl && (
          <Button asChild size="lg">
            <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
              <Globe /> Live Demo
            </a>
          </Button>
        )}
        {project.githubUrl && (
          <Button asChild variant="secondary" size="lg">
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github /> View on GitHub
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
