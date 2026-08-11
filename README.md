# GFG SVEC Hiring 2026 Website

This is a production-ready recruitment web application for the GeeksforGeeks student community chapter at Sri Vasavi Engineering College (SVEC). It includes a public portal with Chapter 1 carousel details, a real-time countdown, a multi-step application form with secure private resume storage, and a fully featured admin evaluation panel.

---

## 🚀 Key Features

### Public Portal
- **Hero & Landing Page**: Modern dark technical design tailored for a student tech community.
- **Chapter 1 Carousel**: Touch-swipe and arrow-key responsive slide view presenting recruitment division details.
- **Clock Sync Countdown**: Updates every second, automatically switching the button to "Apply Now" when reaching the opening time (**12 August 2026 — 7:30 PM IST**).
- **Enforcement**: Submissions are strictly verified server-side against UTC opening time (`2026-08-12T14:00:00.000Z`).

### Multi-Step Application Form
- **Form State Preservation**: Progress is maintained across steps without data loss.
- **Validation**: Fields validation (Roll number, year, section) and URL check for portfolio/work links.
- **Private Resume Storage**: PDFs (up to 10MB) are stored in `storage/resumes` outside the web root.
- **Atomic ID Generation**: Sequence-backed sequential IDs (`GFG-SVEC-2026-0001` onwards) to prevent submission race conditions.

### Admin Dashboard (`/admin`)
- **Metrics & Filters**: High-impact metrics showing total counts and filters (`All`, `Presented`, `Not Presented`, `Rated`, `Not Rated`).
- **Secure Authentication**: HttpOnly Lax session cookies containing JWT. All admin API endpoints are protected.
- **Private Resume Streamer**: Stream candidate PDFs securely via `/api/admin/applications/[id]/resume`.
- **Evaluation console**: Attended status toggle, 5-star rating (locked when absent), notes, and selection status dropdowns.
- **Save & Next Loop**: Queue-based sequential evaluation:
  - *All Applicants*
  - *Presented + Not Rated* (Interview Panel queue)
  - *Not Presented*
- **Excel Export**: Generates `GFG_SVEC_HIRING_2026.xlsx` using SheetJS directly on the server.

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL binaries installed (accessible command paths)

### 1. Initialize User-Space PostgreSQL Cluster
Initialize and run your own PostgreSQL server on port `5433` (isolated from system configurations and does not require Administrator privileges):

```powershell
# 1. Initialize the database cluster directory
& "C:\Program Files\PostgreSQL\18\bin\initdb.exe" -D "db-data" -U postgres -A trust

# 2. Start the server
& "C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" -D "db-data" -o "-p 5433" -l "db-data/postgres.log" start

# 3. Create the database
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h 127.0.0.1 -p 5433 -U postgres -d postgres -c "CREATE DATABASE gfg_svec_hiring;"

# 4. Create the atomic Application ID sequence
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h 127.0.0.1 -p 5433 -U postgres -d gfg_svec_hiring -c "CREATE SEQUENCE IF NOT EXISTS application_id_seq START WITH 1;"
```

### 2. Environment Configurations
Create `.env` inside the root directory:
```env
DATABASE_URL="postgresql://postgres@localhost:5433/gfg_svec_hiring"
AUTH_SECRET="gfg_svec_hiring_auth_secret_2026_super_secure"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Install Packages & Migrate Database
Install dependencies, apply schemas, and populate sample seeds:
```bash
# Install node packages
npm install

# Run database migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Populate initial seed data (includes default admin and 4 test applicants)
npx prisma db seed
```

### 4. Run Development Server
Start the Next.js server locally:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the recruitment site.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to view the administration panel.

---

## 🔑 Default Credentials

- **Admin Email**: `admin@gfgsvec.in`
- **Admin Password**: `adminpassword123`

---

## 🔒 Production Guidelines
- **Database**: Supply a managed PostgreSQL connection URL (e.g. Supabase, Neon) inside `DATABASE_URL`.
- **Upload Storage**: Set up an AWS S3/Cloudinary bucket. In `app/api/apply/route.ts` and `app/api/admin/applications/[id]/resume/route.ts`, replace the filesystem `fs` storage logic with standard AWS SDK uploads/streams.
- **Cookies**: In production, `NEXT_PUBLIC_APP_URL` should match your domain, and JWT cookies are marked `secure: true` automatically by Next.js.
