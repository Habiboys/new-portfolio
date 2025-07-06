# Portfolio Data Configuration

File ini berisi semua data untuk website portofolio. Untuk mengupdate informasi portofolio, cukup edit file `portfolioData.ts`.

## Struktur Data

### 1. Personal Info (`personalInfo`)
Informasi pribadi dasar yang ditampilkan di hero section dan contact.

```typescript
export const personalInfo = {
  name: "Muhammad Nouval Habibie",
  title: "System Development Enthusiast", 
  description: "Deskripsi singkat tentang diri Anda",
  photo: "/src/assets/images/habibie.png",
  email: "email@example.com",
  phone: "+62 123 4567 8900",
  location: "Kota, Indonesia",
  linkedin: "https://linkedin.com/in/profile",
  github: "https://github.com/username",
  instagram: "https://instagram.com/username"
};
```

### 2. About Me (`aboutMe`)
Paragraf untuk section About Me.

```typescript
export const aboutMe = {
  paragraphs: [
    "Paragraf pertama tentang latar belakang...",
    "Paragraf kedua tentang minat dan keahlian..."
  ]
};
```

### 3. Tech Stack (`techStack`)
Array berisi teknologi yang dikuasai. Menggunakan icon dari [Skill Icons](https://skillicons.dev/).

```typescript
export const techStack = [
  "nodejs", "express", "react", "laravel", "git", "docker", 
  "mysql", "javascript", "typescript", "gcp"
];
```

### 4. Experiences (`experiences`)
Array berisi pengalaman kerja dengan detail lengkap.

```typescript
export const experiences = [
  {
    title: "Posisi Pekerjaan",
    organization: "Nama Perusahaan",
    location: "Lokasi",
    type: "Full Time / Part Time / Internship",
    period: "Jan 2023 - Present",
    description: "Deskripsi singkat pekerjaan",
    detailedDescription: "Deskripsi detail untuk modal",
    image: "URL gambar featured",
    companyLogo: "URL logo perusahaan",
    responsibilities: ["Tanggung jawab 1", "Tanggung jawab 2"],
    technologies: ["Tech 1", "Tech 2"],
    achievements: ["Pencapaian 1", "Pencapaian 2"],
    projects: ["Project 1", "Project 2"],
    skills: {
      technical: ["Skill teknis 1", "Skill teknis 2"],
      soft: ["Soft skill 1", "Soft skill 2"]
    }
  }
];
```

### 5. Projects (`projects`)
Array berisi project portofolio dengan detail dan gambar.

```typescript
export const projects = [
  {
    id: 1,
    title: "Nama Project",
    description: "Deskripsi singkat project",
    tech: ["Tech 1", "Tech 2"],
    previewImage: "URL gambar preview",
    detailedDescription: "Deskripsi detail untuk modal",
    features: ["Fitur 1", "Fitur 2"],
    images: ["URL gambar 1", "URL gambar 2", "URL gambar 3"]
  }
];
```

### 6. Contact Info (`contactInfo`)
Informasi untuk section contact.

```typescript
export const contactInfo = {
  title: "Let's Connect",
  description: "Deskripsi ajakan untuk berkolaborasi",
  socialLinks: [
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/profile",
      icon: "linkedin"
    }
  ]
};
```

## Cara Mengupdate Data

1. **Edit Personal Info**: Update `personalInfo` dengan informasi pribadi Anda
2. **Update About**: Ganti paragraf di `aboutMe.paragraphs`
3. **Tech Stack**: Tambah/hapus teknologi di array `techStack`
4. **Experiences**: Tambah/edit pengalaman kerja di array `experiences`
5. **Projects**: Tambah/edit project di array `projects`
6. **Contact**: Update informasi kontak di `contactInfo`

## Tips

- Gunakan gambar dengan resolusi tinggi untuk `previewImage` dan `images`
- Pastikan URL gambar dapat diakses publik
- Untuk tech stack, gunakan nama yang sesuai dengan [Skill Icons](https://skillicons.dev/)
- Gunakan format tanggal yang konsisten (contoh: "Jan 2023 - Present")

## Troubleshooting

Jika ada error setelah mengupdate data:
1. Pastikan struktur data sesuai dengan format yang benar
2. Periksa tanda kurung dan koma
3. Pastikan semua string menggunakan tanda kutip
4. Restart development server dengan `npm run dev` 