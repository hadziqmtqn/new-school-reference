# School Reference Monorepo

Aplikasi Master Data Sekolah Indonesia dengan Express.js, React (Vite), dan Neon PostgreSQL. Aplikasi ini mengelola data lebih dari 400.000 sekolah dengan fitur filter wilayah bertingkat (Cascading Filters).

## 🚀 Struktur Project

```text
.
├── api/             # Express.js Backend
│   ├── scripts/     # Tools migrasi (Export/Import CSV)
│   └── index.js     # Entry point API
├── frontend/        # React + Tailwind Dashboard
│   ├── src/
│   │   ├── components/  # UI Components (Navbar, Table, Docs)
│   │   └── hooks/       # Custom hook useSchoolData
└── vercel.json      # Konfigurasi deployment Vercel
```

## 🛠 Persiapan (Setup)

Pastikan Anda sudah menginstal Node.js. Karena project ini menggunakan struktur monorepo tanpa npm-workspaces (untuk stabilitas deployment), Anda perlu menginstal dependensi di kedua folder:

### 1. Instalasi Backend
```bash
cd api
npm install
```

### 2. Instalasi Frontend
```bash
cd frontend
npm install
```

## 🔑 Environment Variables

Buat file `.env` di dalam folder `/api` dengan konfigurasi berikut:

```env
DATABASE_URL=postgres://user:password@hostname/neondb?sslmode=require
PORT=3001
```

## 💻 Menjalankan Aplikasi (Lokal)

Anda bisa menjalankan kedua aplikasi sekaligus dari folder root menggunakan perintah:

```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **API**: [http://localhost:3001](http://localhost:3001)

## 📦 Deployment ke Vercel

Project ini sudah dikonfigurasi untuk deployment instan ke Vercel:

1. Hubungkan repository GitHub Anda ke Vercel.
2. Di **Vercel Dashboard Settings**:
   - **Root Directory**: `.` (Biarkan default / titik).
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
3. Tambahkan **Environment Variable** `DATABASE_URL` di dashboard Vercel.
4. Klik **Deploy**.

## 📖 API Documentation

Aplikasi ini dilengkapi dengan halaman dokumentasi API internal yang bisa diakses langsung melalui menu **API Docs** di Navbar aplikasi.

---
Dikembangkan oleh Antigravity untuk School Reference Migration Project.
