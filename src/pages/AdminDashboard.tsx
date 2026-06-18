import React from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import {
  User,
  FileText,
  Cpu,
  Briefcase,
  FolderKanban,
  Newspaper,
  Image,
  Share2,
} from "lucide-react";

const sections = [
  {
    label: "Profile",
    path: "/admin/profile",
    desc: "Edit nama, title, deskripsi, foto",
    icon: User,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "About",
    path: "/admin/about",
    desc: "Kelola paragraf about",
    icon: FileText,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Tech Stack",
    path: "/admin/tech-stack",
    desc: "Skill icons",
    icon: Cpu,
    color: "bg-purple-50 text-purple-600",
  },
  {
    label: "Experiences",
    path: "/admin/experiences",
    desc: "CRUD pengalaman",
    icon: Briefcase,
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "Projects",
    path: "/admin/projects",
    desc: "CRUD project + gambar",
    icon: FolderKanban,
    color: "bg-rose-50 text-rose-600",
  },
  {
    label: "Blog",
    path: "/admin/blog",
    desc: "CRUD blog posts dengan rich editor",
    icon: Newspaper,
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    label: "Gallery",
    path: "/admin/gallery",
    desc: "CRUD gallery items",
    icon: Image,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    label: "Social Links",
    path: "/admin/social",
    desc: "Kelola social media",
    icon: Share2,
    color: "bg-orange-50 text-orange-600",
  },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Kelola semua data portfolio dari sini
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.path}
              to={s.path}
              className="group block p-5 bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                {s.label}
              </h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                {s.desc}
              </p>
            </Link>
          );
        })}
      </div>
    </AdminLayout>
  );
}
