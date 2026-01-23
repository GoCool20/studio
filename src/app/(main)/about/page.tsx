import Image from "next/image";
import { getProfile, getEducation, getSkills } from "@/lib/firestore";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap } from "lucide-react";

async function AboutPage() {
  const profile = await getProfile();
  const education = await getEducation();
  const skills = await getSkills();

  const profileImage = PlaceHolderImages.find((p) => p.id === "profile");
  const technicalSkills = skills.filter((s) => s.category === "Technical");
  const toolSkills = skills.filter((s) => s.category === "Tools");

  return (
    <div className="container py-12 md:py-16">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
          About Me
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          A little more about my journey, skills, and qualifications.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="relative mx-auto mb-4 h-48 w-48 overflow-hidden rounded-full shadow-lg">
                {profileImage && (
                  <Image
                    src={profile.avatarUrl || profileImage.imageUrl}
                    alt={profile.name}
                    fill
                    className="object-cover"
                    data-ai-hint={profileImage.imageHint}
                  />
                )}
              </div>
              <h2 className="font-headline text-2xl font-semibold">{profile.name}</h2>
              <p className="text-primary">{profile.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{profile.location}</p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <h3 className="font-headline text-2xl font-bold">Bio</h3>
          <p className="mt-4 max-w-prose text-muted-foreground">{profile.bio}</p>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <section>
          <h3 className="mb-6 flex items-center gap-3 font-headline text-2xl font-bold">
            <GraduationCap className="h-7 w-7 text-primary" />
            Education
          </h3>
          <div className="space-y-6">
            {education.map((edu) => (
              <Card key={edu.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{edu.degree}</CardTitle>
                  <p className="text-sm font-medium text-primary">{edu.institution}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{edu.duration}</span>
                    <span>{edu.score}</span>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-6 flex items-center gap-3 font-headline text-2xl font-bold">
            <Briefcase className="h-7 w-7 text-primary" />
            Skills
          </h3>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Technical Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {technicalSkills.map((skill) => (
                    <Badge key={skill.name}>{skill.name}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tools & Platforms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {toolSkills.map((skill) => (
                    <Badge variant="secondary" key={skill.name}>{skill.name}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
