import { useQuery } from "@tanstack/react-query";
import {
  fetchPortfolioData,
  fetchProjectsData,
  fetchExperiencesData,
  fetchBlogPostsData,
  fetchBlogPostById,
  fetchGalleryData,
  fetchProjectById,
} from "@/services/portfolioService";
import type {
  PortfolioData,
  ProjectItem,
  ExperienceItem,
  BlogPost,
  GalleryItem,
} from "@/types/portfolio";

export function usePortfolioData() {
  return useQuery<PortfolioData>({
    queryKey: ["portfolio"],
    queryFn: fetchPortfolioData,
  });
}

export function useProjects() {
  return useQuery<ProjectItem[]>({
    queryKey: ["projects"],
    queryFn: () => fetchProjectsData(),
  });
}

export function useProjectDetails(id: string | number | null | undefined) {
  return useQuery<ProjectItem | undefined>({
    queryKey: ["project", id],
    queryFn: () => fetchProjectById(id!),
    enabled: id != null && id !== "",
    staleTime: 1000 * 60 * 5,
  });
}

export function useExperiences() {
  return useQuery<ExperienceItem[]>({
    queryKey: ["experiences"],
    queryFn: fetchExperiencesData,
  });
}

export function useBlogPosts() {
  return useQuery<BlogPost[]>({
    queryKey: ["blogPosts"],
    queryFn: () => fetchBlogPostsData({ includeContent: false }),
  });
}

export function useBlogPost(id: string | number) {
  return useQuery<BlogPost | undefined>({
    queryKey: ["blogPost", id],
    queryFn: () => fetchBlogPostById(id),
  });
}

export function useGallery() {
  return useQuery<GalleryItem[]>({
    queryKey: ["gallery"],
    queryFn: fetchGalleryData,
  });
}
