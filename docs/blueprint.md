# **App Name**: DevFolio

## Core Features:

- Admin Authentication: Secure admin dashboard access using Firebase Authentication.
- Theme Management: Allows the admin to modify primaryColor, backgroundColor, surfaceColor, and textPrimaryColor via the admin panel and stores these values in Firestore. Theme must load before UI renders.
- Profile Management: Admin can modify profile details (name, title, bio, location, email, resume URL) via the admin panel; data is stored in Firestore.
- Projects Management: Admin can create, edit, and delete projects (title, shortDescription, detailedDescription, techStack, githubUrl, liveDemoUrl, featured) via the admin panel; data is stored in Firestore.
- Skills Management: Admin can manage skills (name, category) within Technical and Tools categories via the admin panel; data is stored in Firestore.
- Contact Form Submission: Saves contact form submissions (name, email, message) to Firestore and displays success/error feedback.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to evoke professionalism and trust.
- Background color: Very light blue (#F0F4FF), a desaturated version of the primary color to offer a calm backdrop.
- Accent color: Purple (#7E57C2), an analogous hue to the primary to highlight interactive elements and calls to action.
- Body font: 'PT Sans', a modern and readable sans-serif font for the main content.
- Headline font: 'Playfair', an elegant serif font to add sophistication to the headings.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use FontAwesome for icons to maintain a consistent and professional appearance.
- Responsive layout adapting to different screen sizes for optimal viewing experience.