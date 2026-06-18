import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type {
  PortfolioData,
  PersonalInfo,
  AboutMe,
  ExperienceItem,
  ProjectItem,
  BlogPost,
  ContactInfo,
  GalleryItem,
} from "@/types/portfolio";
import {
  personalInfo as localPersonalInfo,
  aboutMe as localAboutMe,
  techStack as localTechStack,
  experiences as localExperiences,
  projects as localProjects,
  blogPosts as localBlogPosts,
  contactInfo as localContactInfo,
} from "@/data/portfolioData";

// ---------- helpers ----------

function resolveImage(value: string | null | undefined): string {
  if (!value || value.startsWith("https://")) return value ?? "";
  // base64 data URL or empty
  return value ?? "";
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---------- supabase fetchers ----------

async function fetchProfileFromSupabase(): Promise<PersonalInfo | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_active", true)
    .limit(1)
    .single();
  if (error || !data) return null;
  return {
    name: data.name,
    title: data.title,
    description: data.description,
    photo: resolveImage(data.photo_base64),
    email: data.email,
    phone: data.phone,
    location: data.location,
    linkedin: "",
    github: "",
    instagram: "",
  };
}

async function fetchSocialLinks(profileId?: string): Promise<{
  linkedin?: string;
  github?: string;
  instagram?: string;
}> {
  if (!supabase || !profileId) return {};
  const { data } = await supabase
    .from("social_links")
    .select("platform, url")
    .eq("profile_id", profileId)
    .eq("is_visible", true)
    .order("sort_order");
  if (!data) return {};
  const result: Record<string, string> = {};
  for (const link of data) {
    result[link.platform.toLowerCase()] = link.url;
  }
  return result;
}

async function fetchAboutFromSupabase(
  profileId?: string
): Promise<AboutMe | null> {
  if (!supabase || !profileId) return null;
  const { data } = await supabase
    .from("about_paragraphs")
    .select("body")
    .eq("profile_id", profileId)
    .eq("is_visible", true)
    .order("sort_order");
  if (!data || data.length === 0) return null;
  return { paragraphs: data.map((r) => r.body) };
}

async function fetchTechStackFromSupabase(
  profileId?: string
): Promise<string[] | null> {
  if (!supabase || !profileId) return null;
  const { data } = await supabase
    .from("tech_stack")
    .select("icon_slug")
    .eq("profile_id", profileId)
    .eq("is_visible", true)
    .order("sort_order");
  if (!data || data.length === 0) return null;
  return data.map((r) => r.icon_slug);
}

async function fetchExperiencesFromSupabase(
  profileId?: string
): Promise<ExperienceItem[] | null> {
  if (!supabase || !profileId) return null;
  const { data } = await supabase
    .from("experiences")
    .select("*")
    .eq("profile_id", profileId)
    .eq("is_visible", true)
    .order("sort_order");
  if (!data || data.length === 0) return null;
  return data.map((r) => ({
    title: r.title,
    organization: r.organization,
    period: r.period_label,
    description: r.description,
    image: resolveImage(r.image_base64),
  }));
}

async function fetchProjectsFromSupabase(
  profileId?: string
): Promise<ProjectItem[] | null> {
  if (!supabase || !profileId) return null;
  const { data: projects } = await supabase
    .from("projects")
    .select("id")
    .eq("profile_id", profileId)
    .eq("is_visible", true)
    .order("sort_order");
  if (!projects || projects.length === 0) return null;

  // fetch full project details with joins
  const ids = projects.map((p) => p.id);

  const [
    { data: full },
    { data: images },
    { data: features },
    { data: tech },
  ] = await Promise.all([
    supabase.from("projects").select("*").in("id", ids),
    supabase
      .from("project_images")
      .select("project_id, image_base64, image_alt, sort_order")
      .in("project_id", ids)
      .order("sort_order"),
    supabase
      .from("project_features")
      .select("project_id, feature, sort_order")
      .in("project_id", ids)
      .order("sort_order"),
    supabase
      .from("project_technologies")
      .select("project_id, technology_name, sort_order")
      .in("project_id", ids)
      .order("sort_order"),
  ]);

  if (!full) return null;

  const imageMap: Record<string, string[]> = {};
  for (const img of images ?? []) {
    if (!imageMap[img.project_id]) imageMap[img.project_id] = [];
    imageMap[img.project_id].push(resolveImage(img.image_base64));
  }
  const featureMap: Record<string, string[]> = {};
  for (const f of features ?? []) {
    if (!featureMap[f.project_id]) featureMap[f.project_id] = [];
    featureMap[f.project_id].push(f.feature);
  }
  const techMap: Record<string, string[]> = {};
  for (const t of tech ?? []) {
    if (!techMap[t.project_id]) techMap[t.project_id] = [];
    techMap[t.project_id].push(t.technology_name);
  }

  return full.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    tech: techMap[p.id] ?? [],
    previewImage: resolveImage(p.preview_image_base64),
    detailedDescription: p.detailed_description ?? p.description,
    features: featureMap[p.id] ?? [],
    images: imageMap[p.id] ?? [],
    liveDemo: p.live_demo_url ?? "",
    sourceCode: p.source_code_url ?? "",
  }));
}

async function fetchBlogPostsFromSupabase(): Promise<BlogPost[] | null> {
  if (!supabase) return null;
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, content, image_base64, image_alt, published_at, read_time, category_id")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (!posts || posts.length === 0) return null;
  const ids = (posts ?? []).map((p) => p.id);

  const [{ data: cats }, { data: tags }] = await Promise.all([
    supabase.from("blog_categories").select("id, name"),
    supabase
      .from("blog_post_tags")
      .select("blog_post_id, tag_id")
      .in("blog_post_id", ids),
  ]);

  const tagNames: Record<string, string[]> = {};

  if (tags && tags.length > 0) {
    const tagIds = [...new Set(tags.map((t) => t.tag_id))];
    const { data: tagData } = await supabase
      .from("blog_tags")
      .select("id, name")
      .in("id", tagIds);
    if (tagData) {
      const tagNameMap = Object.fromEntries(tagData.map((t) => [t.id, t.name]));
      for (const t of tags) {
        if (!tagNames[t.blog_post_id]) tagNames[t.blog_post_id] = [];
        const name = tagNameMap[t.tag_id];
        if (name) tagNames[t.blog_post_id].push(name);
      }
    }
  }

  const catMap = Object.fromEntries(
    (cats ?? []).map((c) => [c.id, c.name])
  );

  return (posts ?? []).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    date: p.published_at ?? "",
    readTime: p.read_time ?? "",
    category: catMap[p.category_id] ?? "Uncategorized",
    image: resolveImage(p.image_base64),
    tags: tagNames[p.id] ?? [],
  }));
}

async function fetchContactFromSupabase(
  profileId?: string
): Promise<ContactInfo | null> {
  if (!supabase || !profileId) return null;
  const { data: section } = await supabase
    .from("contact_sections")
    .select("title, description")
    .eq("profile_id", profileId)
    .eq("is_active", true)
    .limit(1)
    .single();
  if (!section) return null;
  const { data: links } = await supabase
    .from("social_links")
    .select("platform, url, icon")
    .eq("profile_id", profileId)
    .eq("is_visible", true)
    .order("sort_order");
  return {
    title: section.title,
    description: section.description,
    socialLinks: (links ?? []).map((l) => ({
      name: l.platform,
      url: l.url,
      icon: l.icon,
    })),
  };
}

async function fetchGalleryFromSupabase(): Promise<GalleryItem[] | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from("gallery_items")
    .select("id, title, description, image_base64, image_alt, class_name")
    .eq("is_visible", true)
    .order("sort_order");
  if (!data || data.length === 0) return null;
  return data.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    thumbnail: resolveImage(r.image_base64),
    className: r.class_name,
  }));
}

// ---------- aggregated fetch ----------

export async function fetchPortfolioData(): Promise<PortfolioData> {
  if (!isSupabaseConfigured) {
    return getLocalFallback();
  }

  try {
    const profile = await fetchProfileFromSupabase();
    if (!profile) return getLocalFallback();

    const profileId = undefined; // we don't expose UUID in output, but all fetchers need it

    // We need profile id for child tables — re-fetch it
    const { data: profileRow } = await supabase!
      .from("profiles")
      .select("id")
      .eq("is_active", true)
      .limit(1)
      .single();

    const pid = profileRow?.id;

    const social = pid ? await fetchSocialLinks(pid) : {};

    const [about, tech, experiences, projects, blog, contact, gallery] =
      await Promise.all([
        pid ? fetchAboutFromSupabase(pid) : null,
        pid ? fetchTechStackFromSupabase(pid) : null,
        pid ? fetchExperiencesFromSupabase(pid) : null,
        pid ? fetchProjectsFromSupabase(pid) : null,
        fetchBlogPostsFromSupabase(),
        pid ? fetchContactFromSupabase(pid) : null,
        fetchGalleryFromSupabase(),
      ]);

    return {
      personalInfo: {
        ...profile,
        linkedin: social.linkedin ?? "",
        github: social.github ?? "",
        instagram: social.instagram ?? "",
      },
      aboutMe: about ?? localAboutMe,
      techStack: tech ?? localTechStack,
      experiences: experiences ?? localExperiences,
      projects: projects ?? localProjects,
      blogPosts: blog ?? localBlogPosts,
      contactInfo: contact ?? localContactInfo,
      galleryItems: gallery ?? localGallery,
    };
  } catch {
    return getLocalFallback();
  }
}

export async function fetchProjectsData(): Promise<ProjectItem[]> {
  if (!isSupabaseConfigured) return localProjects;
  try {
    const { data: profileRow } = await supabase!
      .from("profiles")
      .select("id")
      .eq("is_active", true)
      .limit(1)
      .single();
    if (!profileRow) return localProjects;
    const result = await fetchProjectsFromSupabase(profileRow.id);
    return result ?? localProjects;
  } catch {
    return localProjects;
  }
}

export async function fetchExperiencesData(): Promise<ExperienceItem[]> {
  if (!isSupabaseConfigured) return localExperiences;
  try {
    const { data: profileRow } = await supabase!
      .from("profiles")
      .select("id")
      .eq("is_active", true)
      .limit(1)
      .single();
    if (!profileRow) return localExperiences;
    const result = await fetchExperiencesFromSupabase(profileRow.id);
    return result ?? localExperiences;
  } catch {
    return localExperiences;
  }
}

export async function fetchBlogPostsData(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured) return localBlogPosts;
  try {
    const result = await fetchBlogPostsFromSupabase();
    return result ?? localBlogPosts;
  } catch {
    return localBlogPosts;
  }
}

export async function fetchBlogPostById(
  id: string | number
): Promise<BlogPost | undefined> {
  const posts = await fetchBlogPostsData();
  return posts.find(
    (p) => String(p.id) === String(id) || p.slug === String(id)
  );
}

export async function fetchGalleryData(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured) return localGallery;
  try {
    const result = await fetchGalleryFromSupabase();
    return result ?? localGallery;
  } catch {
    return localGallery;
  }
}

// ---------- local fallback data for gallery ----------

const localGallery: GalleryItem[] = [
  {
    id: 1,
    title: "Neo Telemetri",
    description: null,
    thumbnail: "/images/neo.webp",
    className: "md:col-span-2",
  },
  {
    id: 2,
    title: "Impact National Hackhaton By Maxy Academy 2024",
    description: null,
    thumbnail: "/images/blog/maxy.webp",
    className: "col-span-1",
  },
  {
    id: 3,
    title: "Bukit Bintang",
    description: null,
    thumbnail: "/images/blog/solo.jpg",
    className: "col-span-1",
  },
  {
    id: 4,
    title: "Hackathon CyberTech PNP 2024",
    description: null,
    thumbnail: "/images/blog/wincybertech.webp",
    className: "md:col-span-2",
  },
];

function getLocalFallback(): PortfolioData {
  return {
    personalInfo: {
      ...localPersonalInfo,
      linkedin: localPersonalInfo.linkedin,
      github: localPersonalInfo.github,
      instagram: localPersonalInfo.instagram,
    },
    aboutMe: localAboutMe,
    techStack: localTechStack,
    experiences: localExperiences,
    projects: localProjects,
    blogPosts: localBlogPosts,
    contactInfo: localContactInfo,
    galleryItems: localGallery,
  };
}
