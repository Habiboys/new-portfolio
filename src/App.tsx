import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import BlogPage from "./pages/BlogPage";
import BlogDetail from "./pages/BlogDetail";

const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminProfile = lazy(() => import("./pages/admin/AdminProfile"));
const AdminAbout = lazy(() => import("./pages/admin/AdminAbout"));
const AdminTechStack = lazy(() => import("./pages/admin/AdminTechStack"));
const AdminExperiences = lazy(() => import("./pages/admin/AdminExperiences"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery"));
const AdminSocial = lazy(() => import("./pages/admin/AdminSocial"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/about" element={<AdminAbout />} />
          <Route path="/admin/tech-stack" element={<AdminTechStack />} />
          <Route path="/admin/experiences" element={<AdminExperiences />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
          <Route path="/admin/social" element={<AdminSocial />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
