import { getProfile } from "@/lib/firestore";
import { ContactForm } from "./ContactForm";
import { Mail, MapPin, Linkedin, Github } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { SocialLink } from "@/lib/types";

const SocialIcon = ({ platform }: { platform: string }) => {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return <Linkedin className="h-5 w-5" />;
    case 'github':
      return <Github className="h-5 w-5" />;
    default:
      return null;
  }
};

const ContactDetail = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="flex gap-6 items-start">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-secondary">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {children}
        </div>
    </div>
)

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <div className="container mx-auto max-w-7xl space-y-24 px-4 py-24 md:px-8 md:py-32">
      <header className="text-center">
        <h1 className="text-4xl font-bold md:text-5xl">
          Get In Touch
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
          {profile.contactSubtitle}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-5 lg:gap-16">
        <div className="lg:col-span-3">
          <ContactForm />
        </div>

        <aside className="space-y-12 lg:col-span-2">
            <div className="space-y-8">
                <ContactDetail icon={<Mail className="h-6 w-6 text-primary" />} title="Email">
                     <a href={`mailto:${profile.email}`} className="text-muted-foreground hover:text-primary transition-colors">{profile.email}</a>
                    <p className="text-sm text-muted-foreground/80 mt-1">Typical response time: {profile.responseTime}</p>
                </ContactDetail>

                <ContactDetail icon={<MapPin className="h-6 w-6 text-primary" />} title="Location">
                    <p className="text-muted-foreground">{profile.location}</p>
                    <p className="text-sm text-muted-foreground/80 mt-1">{profile.availability}</p>
                </ContactDetail>
            </div>
            
            <Separator />

            <div>
                <h3 className="mb-4 text-lg font-semibold">Connect Socially</h3>
                <div className="flex gap-4">
                    {profile.socialLinks?.map((link: SocialLink) => (
                        <Button asChild key={link.id} variant="outline" size="icon" className="rounded-full">
                            <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.platform}>
                                <SocialIcon platform={link.platform} />
                            </a>
                        </Button>
                    ))}
                </div>
            </div>
        </aside>
      </div>
    </div>
  );
}
