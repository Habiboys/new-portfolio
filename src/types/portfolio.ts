export type PersonalInfo = {
  name: string;
  title: string;
  description: string;
  photo: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
};

export type AboutMe = {
  paragraphs: string[];
};

export type ExperienceItem = {
  title: string;
  organization: string;
  period: string;
  description: string;
  image: string;
};

export type ProjectItem = {
  id: number | string;
  title: string;
  slug?: string;
  description: string;
  tech: string[];
  previewImage: string;
  detailedDescription: string;
  features: string[];
  images: string[];
  liveDemo: string;
  sourceCode: string;
};

export type BlogPost = {
  id: number | string;
  slug?: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  tags: string[];
};

export type ContactInfo = {
  title: string;
  description: string;
  socialLinks: Array<{
    name: string;
    url: string;
    icon: string;
  }>;
};

export type GalleryItem = {
  id: number | string;
  title: string;
  description?: string | null;
  thumbnail: string;
  imageAlt?: string | null;
};

export type PortfolioData = {
  personalInfo: PersonalInfo;
  aboutMe: AboutMe;
  techStack: string[];
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  blogPosts: BlogPost[];
  contactInfo: ContactInfo;
  galleryItems: GalleryItem[];
};
