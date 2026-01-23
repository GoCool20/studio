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
    <section className="w-full py-24 md:py-32 lg:py-40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 md:grid-cols-2 md:px-8">
        <div className="order-2 flex flex-col items-center gap-6 text-center md:order-1 md:items-start md:text-left">
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
              <CardFooter className='p-6'>
                 <Button asChild className="w-full" variant="secondary">
                   <Link href={`/projects/${project.id}`}>
                      View Details <ArrowRight />
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
  const technicalSkills = skills.filter(s => s.category === 'Technical');
  const toolSkills = skills.filter(s => s.category === 'Tools');

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
