// Portfolio Data Configuration
// Edit file ini untuk mengupdate informasi portofolio

export const personalInfo = {
  name: "Muhammad Nouval Habibie",
  title: "System Development Enthusiast",
  description: "Information Systems student passionate about building innovative web and mobile solutions",
  photo: "/src/assets/images/habibie.png",
  email: "your.email@example.com",
  phone: "+62 123 4567 8900",
  location: "Padang, Indonesia",
  linkedin: "https://linkedin.com/in/yourprofile",
  github: "https://github.com/habiboys",
  instagram: "https://instagram.com/yourusername"
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
    location: "Jakarta, Indonesia",
    type: "Full Time",
    period: "2023 - Present",
    description: "Led development of web applications using modern technologies.",
    detailedDescription: "As a Full Stack Developer, I was responsible for developing and maintaining web applications using React, Node.js, and PostgreSQL. Led a team of 3 developers and implemented agile methodologies.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop",
    companyLogo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop",
    responsibilities: [
      "Developed and maintained web applications using React and Node.js",
      "Implemented RESTful APIs and database design",
      "Led team meetings and code reviews",
      "Optimized application performance and user experience",
      "Mentored junior developers and conducted technical interviews"
    ],
    technologies: ["React", "Node.js", "PostgreSQL", "TypeScript", "AWS"],
    achievements: [
      "Reduced application load time by 40%",
      "Implemented automated testing, achieving 85% coverage",
      "Successfully delivered 5 major features ahead of schedule",
      "Received Employee of the Month award for outstanding performance"
    ],
    projects: [
      "E-commerce Platform Revamp",
      "Real-time Analytics Dashboard",
      "Customer Management System"
    ],
    skills: {
      technical: ["Frontend Development", "Backend Development", "Database Design", "Cloud Services", "API Development"],
      soft: ["Leadership", "Problem Solving", "Team Collaboration", "Communication", "Agile Methodologies"]
    }
  },
  {
    title: "Software Engineer Intern",
    organization: "Startup X",
    location: "Bandung, Indonesia",
    type: "Internship",
    period: "Jan 2023 - Jun 2023",
    description: "Contributed to the development of innovative mobile applications.",
    detailedDescription: "During my internship, I worked on developing mobile applications using React Native and participated in the complete software development lifecycle. Gained hands-on experience in modern development practices and agile methodologies.",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=400&fit=crop",
    companyLogo: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=200&h=200&fit=crop",
    responsibilities: [
      "Developed mobile application features using React Native",
      "Collaborated with the design team for UI/UX implementation",
      "Participated in code reviews and testing",
      "Assisted in API integration and documentation"
    ],
    technologies: ["React Native", "JavaScript", "Firebase", "Git"],
    achievements: [
      "Developed key features that increased user engagement by 25%",
      "Contributed to reducing app crash rate by 60%",
      "Received recognition for best intern performance"
    ],
    projects: [
      "Food Delivery App",
      "Social Media Integration",
      "Push Notification System"
    ],
    skills: {
      technical: ["Mobile Development", "Version Control", "UI/UX Implementation", "Testing"],
      soft: ["Time Management", "Quick Learning", "Teamwork", "Attention to Detail"]
    }
  }
];

export const projects = [
  {
    id: 1,
    title: "Web-based Asset Management System",
    description: "A comprehensive system for tracking and managing digital and physical assets with real-time monitoring.",
    tech: ["Laravel", "MySQL", "Bootstrap"],
    previewImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop",
    detailedDescription: "This comprehensive asset management system provides organizations with powerful tools to track, monitor, and manage both digital and physical assets. The system features real-time asset tracking, automated depreciation calculations, maintenance scheduling, and detailed reporting capabilities. Built with Laravel for robust backend functionality and Bootstrap for responsive design.",
    features: [
      "Real-time asset tracking and monitoring",
      "Automated depreciation calculations",
      "Maintenance scheduling and alerts",
      "Comprehensive reporting dashboard",
      "Multi-user access control",
      "Asset lifecycle management"
    ],
    images: [
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
    ]
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
    ]
  },
  {
    id: 3,
    title: "Smart Project Planner",
    description: "Intelligent project management tool with automated task scheduling and team collaboration features.",
    tech: ["React", "Express", "PostgreSQL"],
    previewImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
    detailedDescription: "An intelligent project management solution that combines AI-powered task scheduling with comprehensive team collaboration tools. The system automatically optimizes project timelines, allocates resources efficiently, and provides real-time project insights to ensure successful project delivery.",
    features: [
      "AI-powered task scheduling",
      "Resource allocation optimization",
      "Team collaboration tools",
      "Real-time project tracking",
      "Gantt chart visualization",
      "Performance analytics and reporting"
    ],
    images: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1"
    ]
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