import { resolveImage } from "@/lib/imageUtils";
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

type FetchOptions = {
  includeImages?: boolean;
  includeContent?: boolean;
};

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
  profileId?: string,
  options: FetchOptions = {}
): Promise<ExperienceItem[] | null> {
  if (!supabase || !profileId) return null;
  const includeImages = options.includeImages ?? true;
  const { data } = await supabase
    .from("experiences")
    .select(
      includeImages
        ? "*"
        : "title, organization, period_label, description, sort_order"
    )
    .eq("profile_id", profileId)
    .eq("is_visible", true)
    .order("sort_order");
  if (!data || data.length === 0) return null;
  return data.map((r) => ({
    title: r.title,
    organization: r.organization,
    period: r.period_label,
    description: r.description,
    image: includeImages ? resolveImage(r.image_base64) : "",
  }));
}

async function fetchProjectsFromSupabase(
  profileId?: string,
  options: FetchOptions = {}
): Promise<ProjectItem[] | null> {
  if (!supabase || !profileId) return null;
  const includeImages = options.includeImages ?? true;

  const { data: projects } = await supabase
    .from("projects")
    .select("id")
    .eq("profile_id", profileId)
    .eq("is_visible", true)
    .order("sort_order");
  if (!projects || projects.length === 0) return null;

  const ids = projects.map((p) => p.id);

  const fullPromise = supabase.from("projects").select("*").in("id", ids);
  const featuresPromise = supabase
    .from("project_features")
    .select("project_id, feature, sort_order")
    .in("project_id", ids)
    .order("sort_order");
  const techPromise = supabase
    .from("project_technologies")
    .select("project_id, technology_name, sort_order")
    .in("project_id", ids)
    .order("sort_order");
  const imagesPromise = includeImages
    ? supabase
        .from("project_images")
        .select("project_id, image_base64, image_alt, sort_order")
        .in("project_id", ids)
        .order("sort_order")
    : Promise.resolve({ data: null, error: null });

  const [{ data: full }, { data: images }, { data: features }, { data: tech }] =
    await Promise.all([fullPromise, imagesPromise, featuresPromise, techPromise]);

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
    images: includeImages ? imageMap[p.id] ?? [] : [],
    liveDemo: p.live_demo_url ?? "",
    sourceCode: p.source_code_url ?? "",
  }));
}

async function fetchProjectByIdFromSupabase(
  id: string | number
): Promise<ProjectItem | null> {
  if (!supabase) return null;

  const { data: p } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("is_visible", true)
    .maybeSingle();

  if (!p) return null;

  const [{ data: images }, { data: features }, { data: tech }] = await Promise.all([
    supabase
      .from("project_images")
      .select("image_base64, sort_order")
      .eq("project_id", p.id)
      .order("sort_order"),
    supabase
      .from("project_features")
      .select("feature, sort_order")
      .eq("project_id", p.id)
      .order("sort_order"),
    supabase
      .from("project_technologies")
      .select("technology_name, sort_order")
      .eq("project_id", p.id)
      .order("sort_order"),
  ]);

  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    tech: (tech ?? []).map((t) => t.technology_name),
    previewImage: resolveImage(p.preview_image_base64),
    detailedDescription: p.detailed_description ?? p.description,
    features: (features ?? []).map((f) => f.feature),
    images: (images ?? []).map((img) => resolveImage(img.image_base64)),
    liveDemo: p.live_demo_url ?? "",
    sourceCode: p.source_code_url ?? "",
  };
}

async function fetchBlogPostsFromSupabase(
  options: FetchOptions = {}
): Promise<BlogPost[] | null> {
  if (!supabase) return null;
  const includeContent = options.includeContent ?? true;
  const selectFields = includeContent
    ? "id, title, slug, excerpt, content, image_base64, image_alt, published_at, read_time, category_id"
    : "id, title, slug, excerpt, image_base64, image_alt, published_at, read_time, category_id";

  const { data: posts } = await supabase
    .from("blog_posts")
    .select(selectFields)
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
    content: includeContent ? p.content ?? "" : "",
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
    .select("id, title, description, image_base64, image_alt")
    .eq("is_visible", true)
    .order("sort_order");
  if (!data || data.length === 0) return null;
  return data.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    thumbnail: resolveImage(r.image_base64),
    imageAlt: r.image_alt ?? r.title,
  }));
}

// ---------- aggregated fetch ----------

export async function fetchPortfolioData(): Promise<PortfolioData> {
  const landingOptions: FetchOptions = {
    includeImages: false,
    includeContent: false,
  };

  if (!isSupabaseConfigured) {
    return getLocalFallback(landingOptions);
  }

  try {
    const profile = await fetchProfileFromSupabase();
    if (!profile) return getLocalFallback(landingOptions);

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
        pid ? fetchExperiencesFromSupabase(pid, { includeImages: false }) : null,
        pid ? fetchProjectsFromSupabase(pid, { includeImages: false }) : null,
        fetchBlogPostsFromSupabase({ includeContent: false }),
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
    return getLocalFallback(landingOptions);
  }
}

export async function fetchProjectById(
  id: string | number
): Promise<ProjectItem | undefined> {
  if (!isSupabaseConfigured) {
    return localProjects.find((p) => String(p.id) === String(id));
  }

  try {
    const project = await fetchProjectByIdFromSupabase(id);
    return project ?? undefined;
  } catch {
    return localProjects.find((p) => String(p.id) === String(id));
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
    const result = await fetchProjectsFromSupabase(profileRow.id, {
      includeImages: true,
    });
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

export async function fetchBlogPostsData(
  options: FetchOptions = {}
): Promise<BlogPost[]> {
  const includeContent = options.includeContent ?? false;
  if (!isSupabaseConfigured) {
    return getLocalFallback({ includeContent }).blogPosts;
  }
  try {
    const result = await fetchBlogPostsFromSupabase({ includeContent });
    return result ?? getLocalFallback({ includeContent }).blogPosts;
  } catch {
    return getLocalFallback({ includeContent }).blogPosts;
  }
}

export async function fetchBlogPostById(
  id: string | number
): Promise<BlogPost | undefined> {
  if (!isSupabaseConfigured) {
    return localBlogPosts.find(
      (p) => String(p.id) === String(id) || p.slug === String(id)
    );
  }

  try {
    const isUuid =
      typeof id === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    let query = supabase!
      .from("blog_posts")
      .select(
        "id, title, slug, excerpt, content, image_base64, image_alt, published_at, read_time, category_id"
      )
      .eq("is_published", true);

    query = isUuid ? query.eq("id", id) : query.eq("slug", String(id));

    const { data: post } = await query.maybeSingle();
    if (!post) {
      return localBlogPosts.find(
        (p) => String(p.id) === String(id) || p.slug === String(id)
      );
    }

    const [{ data: cats }, { data: tags }] = await Promise.all([
      supabase!.from("blog_categories").select("id, name"),
      supabase!.from("blog_post_tags").select("tag_id").eq("blog_post_id", post.id),
    ]);

    const catMap = Object.fromEntries((cats ?? []).map((c) => [c.id, c.name]));
    let tagList: string[] = [];
    if (tags && tags.length > 0) {
      const tagIds = tags.map((t) => t.tag_id);
      const { data: tagData } = await supabase!
        .from("blog_tags")
        .select("id, name")
        .in("id", tagIds);
      tagList = (tagData ?? []).map((t) => t.name);
    }

    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content ?? "",
      date: post.published_at ?? "",
      readTime: post.read_time ?? "",
      category: catMap[post.category_id] ?? "Uncategorized",
      image: resolveImage(post.image_base64),
      tags: tagList,
    };
  } catch {
    return localBlogPosts.find(
      (p) => String(p.id) === String(id) || p.slug === String(id)
    );
  }
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
    imageAlt: "Neo Telemetri",
  },
  {
    id: 2,
    title: "Impact National Hackhaton By Maxy Academy 2024",
    description: null,
    thumbnail: "/images/blog/maxy.webp",
    imageAlt: "Impact National Hackhaton By Maxy Academy 2024",
  },
  {
    id: 3,
    title: "Bukit Bintang",
    description: null,
    thumbnail: "/images/blog/solo.jpg",
    imageAlt: "Bukit Bintang",
  },
  {
    id: 4,
    title: "Hackathon CyberTech PNP 2024",
    description: null,
    thumbnail: "/images/blog/wincybertech.webp",
    imageAlt: "Hackathon CyberTech PNP 2024",
  },
];

function stripProjectsForLanding(projects: ProjectItem[]): ProjectItem[] {
  return projects.map((project) => ({ ...project, images: [] }));
}

function getLocalFallback(options: FetchOptions = {}): PortfolioData {
  const includeImages = options.includeImages ?? true;
  const includeContent = options.includeContent ?? true;
  const projects = includeImages
    ? localProjects
    : stripProjectsForLanding(localProjects);

  return {
    personalInfo: {
      ...localPersonalInfo,
      linkedin: localPersonalInfo.linkedin,
      github: localPersonalInfo.github,
      instagram: localPersonalInfo.instagram,
    },
    aboutMe: localAboutMe,
    techStack: localTechStack,
    experiences: localExperiences.map((exp) =>
      includeImages ? exp : { ...exp, image: "" }
    ),
    projects,
    blogPosts: localBlogPosts.map((post) =>
      includeContent ? post : { ...post, content: "" }
    ),
    contactInfo: localContactInfo,
    galleryItems: localGallery,
  };
}
