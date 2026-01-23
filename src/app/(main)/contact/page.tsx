import { ContactForm } from "./ContactForm";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
      <header className="mb-16 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">
          Get In Touch
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Have a question or want to work together? Fill out the form below.
        </p>
      </header>
      <div className="mx-auto max-w-2xl">
        <ContactForm />
      </div>
    </div>
  );
}
