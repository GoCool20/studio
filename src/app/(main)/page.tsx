import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Download, Mail, Github, ExternalLink } from 'lucide-react';

import { getProfile, getProjects, getSkills } from '@/lib/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

async function HeroSection() {
  const profile = await getProfile();
  const profileImage = PlaceHolderImages.find(p => p.id === 'profile');

  return (
    <section className="w-full py-24 md:py-32 lg:py-40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 text-center md:grid-cols-2 md:px-8 md:text-left">
        <div className="order-2 flex flex-col items-center gap-6 md:order-1 md:items-start">
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
            {profile.name}
          </h1>
          <p className="text-2xl font-medium text-primary">{profile.title}</p>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            {profile.bio}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 md:justify-start">
            <Button asChild size="lg">
              <Link href="/projects">
                View Projects <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                Download Resume <Download />
              </a>
            </Button>
          </div>
        </div>
        <div className="order-1 mx-auto h-80 w-80 overflow-hidden rounded-full shadow-soft-lg md:order-2 md:h-96 md:w-96 relative">
          {profileImage && (
            <Image
              src={profile.avatarUrl || profileImage.imageUrl}
              alt={profile.name}
              fill
              className="object-cover"
              data-ai-hint={profileImage.imageHint}
              priority
              unoptimized
            />
          )}
        </div>
      </div>
    </section>
  );
}

async function FeaturedProjects() {
  const featuredProjects = await getProjects({ featured: true });

  return (
    <section className="w-full bg-secondary/20 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Featured Projects
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A selection of my best work.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.slice(0, 3).map((project) => (
            <Card key={project.id} className="group flex flex-col overflow-hidden">
              <Link href={`/projects/${project.id}`} aria-label={`View details for ${project.title}`}>
                <CardHeader className="p-0">
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={project.imageUrl || `https://picsum.photos/seed/${project.id}/600/400`}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint="web app"
                      unoptimized
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
          ))}
        </div>
      </div>
    </section>
  );
}

async function SkillsArsenal() {
  const skills = await getSkills();

  return (
    <section className="w-full py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Technical Arsenal
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Languages, frameworks, and tools I work with.
          </p>
        </div>
        <div className="mx-auto max-w-4xl">
            <div className="flex flex-wrap justify-center gap-4">
              {skills.map((skill, index) => (
                <Badge key={index} className="px-4 py-2 text-sm" variant="secondary">{skill.name}</Badge>
              ))}
            </div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturedProjects />
      <SkillsArsenal />
    </div>
  );
}
