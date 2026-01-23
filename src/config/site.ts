export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  mainNav: NavItem[];
};

export const siteConfig: SiteConfig = {
  name: "DevFolio",
  description: "A personal portfolio website built with Next.js and Firebase.",
  url: "https://devfolio.example.com",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Projects",
      href: "/projects",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ],
};
