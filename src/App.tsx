import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Experience from './pages/Experience';
import Projects from './pages/Projects';
import BlogPage from './pages/BlogPage';
import BlogDetail from './pages/BlogDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProfile from './pages/admin/AdminProfile';
import AdminAbout from './pages/admin/AdminAbout';
import AdminTechStack from './pages/admin/AdminTechStack';
import AdminExperiences from './pages/admin/AdminExperiences';
import AdminProjects from './pages/admin/AdminProjects';
import AdminBlog from './pages/admin/AdminBlog';
import AdminGallery from './pages/admin/AdminGallery';
import AdminSocial from './pages/admin/AdminSocial';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;