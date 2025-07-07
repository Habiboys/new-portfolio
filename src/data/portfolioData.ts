                                // Portfolio Data Configuration
// Edit file ini untuk mengupdate informasi portofolio

export const personalInfo = {
  name: "Muhammad Nouval Habibie",
  title: "System Development Enthusiast",
  description: "Information Systems student passionate about building innovative web and mobile solutions",
  photo: "/src/assets/images/habibie.png",
  email: "nouvalhabibie18@gmail.com",
  phone: "+62 123 4567 8900",
  location: "Padang, Indonesia",
  linkedin: "https://www.linkedin.com/in/nouvalhabibie/",
  github: "https://github.com/habiboys",
  instagram: "https://www.instagram.com/nuval18_/"
};

export const aboutMe = {
  paragraphs: [
    "I'm currently a 6th-semester Information Systems student at Universitas Andalas, deeply passionate about system development and cloud computing. My journey in technology has been driven by curiosity and a desire to create meaningful digital solutions.",
    "With hands-on experience in both web and mobile development, I enjoy tackling complex problems and transforming ideas into functional, user-friendly applications. My interests span across modern development practices, cloud technologies, and building scalable systems."
  ]
};

export const techStack = [
  "nodejs", "express", "react", "laravel", "git", "docker", 
  "mysql", "javascript", "typescript", "gcp",  "java", "php", "mysql", 
  "postgresql", "docker", "git", 
  "figma","postman", "tailwind", "bootstrap", 
];

export const experiences = [
  {
    title: "Full Stack Developer",
    organization: "Tech Company",
    period: "2023 - Present",
    description: "Led development of web applications using modern technologies including React, Node.js, and PostgreSQL.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop"
  },
  {
    title: "Software Engineer Intern",
    organization: "Startup X",
    period: "Jan 2023 - Jun 2023",
    description: "Contributed to the development of innovative mobile applications using React Native and participated in the complete software development lifecycle.",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=400&fit=crop"
  },
  {
    title: "Frontend Developer",
    organization: "Digital Agency",
    period: "Jun 2022 - Dec 2022",
    description: "Developed responsive web interfaces and collaborated with design teams to create engaging user experiences.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop"
  }
];

export const projects = [
  {
    id: 1,
    title: "Sistem Informasi Peminjaman Sarana & Prasarana Universitas Andalas",
    description: "Sistem Informasi untuk mengelola peminjaman sarana dan prasarana dilingkungan Universitas Andalas.",
    tech: ["Laravel", "MySQL", "Pusher", "Flowbite"],
    previewImage: "/src/assets/images/project/simsapras/cover.png",
    detailedDescription: "Sistem informasi komprehensif untuk mengelola peminjaman sarana dan prasarana di lingkungan Universitas Andalas. Sistem ini menyediakan fitur peminjaman real-time, manajemen admin, dan pelaporan yang detail untuk memudahkan pengelolaan aset universitas.",
    features: [
      "Peminjaman Sarana & Prasarana",
      "Manajemen Admin",
      "Pengelolaan Peminjaman",
      "Dashboard & Pelaporan",
      "Pengelolaan Sarana & Prasarana",
      "Notifikasi Real-time"
    ],
    images: [
      "/src/assets/images/project/simsapras/cover.png",
      "/src/assets/images/project/simsapras/peminjaman.png",
      "/src/assets/images/project/simsapras/dashboard.png",
      "/src/assets/images/project/simsapras/kalenderadmin.png",
      "/src/assets/images/project/simsapras/sarana.png",
      "/src/assets/images/project/simsapras/detailgedung.png"
    ],
    liveDemo: "https://simsapras.unand.ac.id/",
    // sourceCode: "https://github.com/habiboys/simsapras-unand"
  },
  {
    id: 3,
    title: "PLANMAX",
    description: "AI Based Project Management For Smarter Collaboration.",
    tech: ["React", "Nextjs","FastAPI", "PostgreSQL"],
    previewImage: "src/assets/images/project/planmax/landing-page.png",
    detailedDescription: "An intelligent project management solution that combines AI-powered task scheduling with comprehensive team collaboration tools. The system automatically optimizes project timelines, allocates resources efficiently, and provides real-time project insights to ensure successful project delivery.",
features: [
  "AI-powered task scheduling",
  "Resource allocation optimization",
  "Team collaboration tools",
  "Real-time project tracking",
  "Gantt chart visualization",
  "Performance analytics and reporting",
  "Machine learning for blocker detection and timeline prediction",
  "Interactive Gantt-based timeline builder with AI prompts",
  "Collaborative task management with team communication",
  "Integrated project and task dependency mapping"
],

    images: [
      "src/assets/images/project/planmax/landing-page.png",
      "src/assets/images/project/planmax/all-project.png",
      "src/assets/images/project/planmax/detail-project.png",
      "src/assets/images/project/planmax/all-task.png",
      "src/assets/images/project/planmax/gantt-chart.png",
       "src/assets/images/project/planmax/ai-creator.png",
     
    ],
    liveDemo: "https://project-planner-demo.com",
    sourceCode: ""
  },
  {
    id: 2,
    title: "Financial Tracking App",
    description: "Personal finance management application with budget tracking and expense categorization.",
    tech: ["React", "Node.js", "MongoDB"],
    previewImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=250&fit=crop",
    detailedDescription: "A modern personal finance management application designed to help users take control of their financial health. The app provides intuitive expense tracking, budget planning, and financial goal setting with beautiful data visualizations and insightful analytics.",
    features: [
      "Expense tracking and categorization",
      "Budget planning and monitoring",
      "Financial goal setting",
      "Interactive charts and analytics",
      "Receipt scanning and storage",
      "Bill reminder notifications"
    ],
    images: [
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
    ],
    liveDemo: "",
    sourceCode: "https://github.com/habiboys/financial-tracker"
  }
];

export const blogPosts = [
  {
    id: 1,
    title: "Building Scalable Web Applications with React and Node.js",
    excerpt: "Learn how to create robust, scalable web applications using modern JavaScript technologies and best practices.",
    content: "Full blog content here...",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
    tags: ["React", "Node.js", "JavaScript", "Web Development"]
  },
  {
    id: 2,
    title: "The Future of Cloud Computing in Software Development",
    excerpt: "Exploring how cloud technologies are reshaping the way we build and deploy applications in the modern era.",
    content: "Full blog content here...",
    date: "2024-01-10",
    readTime: "7 min read",
    category: "Cloud Computing",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
    tags: ["Cloud Computing", "AWS", "DevOps", "Technology"]
  },
  {
    id: 3,
    title: "Best Practices for Database Design and Optimization",
    excerpt: "Essential tips and strategies for designing efficient databases that scale with your application's growth.",
    content: "Full blog content here...",
    date: "2024-01-05",
    readTime: "6 min read",
    category: "Database",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop",
    tags: ["Database", "SQL", "Performance", "Optimization"]
  },
  {
    id: 4,
    title: "Introduction to Machine Learning for Web Developers",
    excerpt: "A beginner-friendly guide to understanding and implementing machine learning concepts in web applications.",
    content: "Full blog content here...",
    date: "2023-12-28",
    readTime: "8 min read",
    category: "Machine Learning",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop",
    tags: ["Machine Learning", "AI", "Python", "Web Development"]
  },
  {
    id: 5,
    title: "Modern CSS Techniques for Better User Interfaces",
    excerpt: "Discover the latest CSS features and techniques to create stunning, responsive user interfaces.",
    content: "Full blog content here...",
    date: "2023-12-20",
    readTime: "4 min read",
    category: "Frontend",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
    tags: ["CSS", "Frontend", "UI/UX", "Web Design"]
  }
];

export const contactInfo = {
  title: "Let's Connect",
  description: "I'm always open to discussing new opportunities, interesting projects, or just having a chat about technology.",
  socialLinks: [
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/yourprofile",
      icon: "linkedin"
    },
    {
      name: "GitHub",
      url: "https://github.com/habiboys",
      icon: "github"
    },
    {
      name: "Instagram",
      url: "https://instagram.com/yourusername",
      icon: "instagram"
    }
  ]
}; 