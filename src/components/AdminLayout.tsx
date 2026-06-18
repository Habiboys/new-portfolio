import React from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { logoutAdmin } from "@/lib/auth";
import {
  LayoutDashboard,
  User,
  FileText,
  Cpu,
  Briefcase,
  FolderKanban,
  Newspaper,
  Image,
  Share2,
  LogOut,
  ExternalLink,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Profile", path: "/admin/profile", icon: User },
  { label: "About", path: "/admin/about", icon: FileText },
  { label: "Tech Stack", path: "/admin/tech-stack", icon: Cpu },
  { label: "Experiences", path: "/admin/experiences", icon: Briefcase },
  { label: "Projects", path: "/admin/projects", icon: FolderKanban },
  { label: "Blog", path: "/admin/blog", icon: Newspaper },
  { label: "Gallery", path: "/admin/gallery", icon: Image },
  { label: "Social Links", path: "/admin/social", icon: Share2 },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const handleLogout = async () => {
    await logoutAdmin();
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-100">
          <Link
            to="/"
            className="text-lg font-bold text-gray-900 tracking-tight"
          >
            Admin Panel
          </Link>
          <p className="text-xs text-gray-400 mt-1 truncate">
            {session.user.email}
          </p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-100 space-y-1">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            Lihat Portfolio
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6 md:p-8 lg:p-10 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
