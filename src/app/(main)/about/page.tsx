import Image from "next/image";
import { getProfile, getExperience, getEducation, getSkills } from "@/lib/firestore";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, Code } from "lucide-react";

export default async function AboutPage() {
  const profile = await getProfile();
  const experience = await getExperience();
  const education = await getEducation();
  const skills = await getSkills();

  const profileImage = PlaceHolderImages.find((p) => p.id === "profile");
  const technicalSkills = skills.filter((s) => s.category === "Technical");
  const toolSkills = skills.filter((s) => s.category === "Tools");

  return (
    <div className="container mx-auto max-w-7xl space-y-24 px-4 py-24 md:px-8 md:py-32">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          About Me
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          My journey, my skills, and my passion for building great software.
        </p>
      </header>

      <section className="grid grid-cols-1 items-center gap-12 text-center md:grid-cols-3 md:text-left">
        <div className="order-1 md:order-2 md:col-span-1">
          <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-full shadow-soft-lg">
            {profileImage && (
              <Image
                src={profile.avatarUrl || profileImage.imageUrl}
                alt={profile.name}
                fill
                className="object-cover"
                data-ai-hint={profileImage.imageHint}
                unoptimized
              />
            )}
          </div>
        </div>
        <div className="order-2 space-y-4 md:order-1 md:col-span-2">
          <h2 className="text-3xl font-bold">{profile.name}</h2>
          <p className="text-xl font-medium text-primary">{profile.title}</p>
          <p className="max-w-prose text-lg leading-relaxed text-muted-foreground md:mx-0 mx-auto">{profile.bio}</p>
        </div>
      </section>

      <section>
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">My Journey</h2>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <h3 className="mb-8 flex items-center gap-3 text-2xl font-bold">
              <Briefcase className="h-8 w-8 text-primary" />
              Work Experience
            </h3>
            <div className="space-y-8">
              {experience.map((exp) => (
                <Card key={exp.id} className="bg-card">
                  <CardHeader>
                    <CardTitle className="text-xl">{exp.role}</CardTitle>
                    <p className="text-md font-medium text-primary">{exp.company}</p>
                    <p className="pt-1 text-sm text-muted-foreground">{exp.duration}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{exp.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-8 flex items-center gap-3 text-2xl font-bold">
              <GraduationCap className="h-8 w-8 text-primary" />
              Education
            </h3>
            <div className="space-y-8">
              {education.map((edu) => (
                <Card key={edu.id} className="bg-card">
                  <CardHeader>
                    <CardTitle className="text-xl">{edu.degree}</CardTitle>
                    <p className="text-md font-medium text-primary">{edu.institution}</p>
                    <div className="flex justify-between pt-2 text-sm text-muted-foreground">
                      <span>{edu.duration}</span>
                      <span>{edu.score}</span>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Skills & Expertise</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Technical Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {technicalSkills.map((skill) => (
                  <Badge variant="secondary" key={skill.name} className="px-4 py-2 text-sm">{skill.name}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Tools & Platforms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {toolSkills.map((skill) => (
                  <Badge variant="secondary" key={skill.name} className="px-4 py-2 text-sm">{skill.name}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

    </div>
  );
}
