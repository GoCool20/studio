import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Download, Mail } from 'lucide-react';

import { getProfile, getProjects, getSkills } from '@/lib/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

async function HeroSection() {
  const profile = await getProfile();
  const profileImage = PlaceHolderImages.find(p => p.id === 'profile');

  return (
    <section className="container grid grid-cols-1 items-center gap-8 py-12 md:grid-cols-2 lg:py-24">
      <div className="flex flex-col items-start gap-4">
        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
          {profile.name}
        </h1>
        <p className="text-2xl text-primary font-medium">{profile.title}</p>
        <p className="max-w-prose text-muted-foreground">
          {profile.bio}
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Button asChild size="lg">
            <Link href="/projects">
              View Projects <ArrowRight className="ml-2" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
              Download Resume <Download className="ml-2" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">
              Contact Me <Mail className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="relative mx-auto h-80 w-80 overflow-hidden rounded-full border-4 border-primary shadow-lg lg:h-96 lg:w-96">
        {profileImage && (
          <Image
            src={profile.avatarUrl || profileImage.imageUrl}
            alt={profile.name}
            fill
            className="object-cover"
            data-ai-hint={profileImage.imageHint}
            priority
          />
        )}
      </div>
    </section>
  );
}

async function FeaturedProjects() {
  const featuredProjects = await getProjects({ featured: true });

  return (
    <section className="bg-secondary/50 py-16 lg:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight lg:text-4xl">
            Featured Projects
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            A selection of my best work.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.slice(0, 3).map((project) => (
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
      </div>
    </section>
  );
}

async function SkillsArsenal() {
  const skills = await getSkills();
  const technicalSkills = skills.filter(s => s.category === 'Technical').slice(0, 10);
  const toolSkills = skills.filter(s => s.category === 'Tools').slice(0, 10);

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight lg:text-4xl">
            Technical Arsenal
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Languages, frameworks, and tools I work with.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-center text-xl font-semibold">Technical Skills</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {technicalSkills.map((skill, index) => (
                <Badge key={index} className="px-4 py-2 text-sm">{skill.name}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-center text-xl font-semibold">Tools & Platforms</h3>
             <div className="flex flex-wrap justify-center gap-3">
              {toolSkills.map((skill, index) => (
                <Badge key={index} variant="outline" className="px-4 py-2 text-sm">{skill.name}</Badge>
              ))}
            </div>
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
