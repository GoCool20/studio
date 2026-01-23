import { ContactForm } from "./ContactForm";

export default function ContactPage() {
  return (
    <div className="container py-12 md:py-16">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
          Get In Touch
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Have a question or want to work together?
        </p>
      </header>
      <div className="mx-auto max-w-xl">
        <ContactForm />
      </div>
    </div>
  );
}
