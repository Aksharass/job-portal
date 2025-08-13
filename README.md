# Job Portal System
HireHub – Job Posting &amp; Recruitment Platform

## Overview
A full-stack job portal connecting **Employers** and **Job Seekers**.  
Employers can post and manage jobs; Job Seekers can search and apply.  
Admin oversees moderation.

## Tech Stack
- Backend: Node.js, Express, MongoDB  
- Frontend: React.js, Tailwind CSS  
- Auth: JWT-based role management  
- Deployment: Render.com, Vercel/Netlify

## Features
- User registration & login with roles (Admin, Employer, Job Seeker)  
- Employers create/edit/delete jobs with details (title, location, salary, type)  
- Job Seekers search jobs, apply with resume/cover letter, manage profile  
- Admin moderates jobs and users  
- Filters, pagination, and sorting on job listings

## Setup

### Backend
1. `npm install`  
2. Create `.env` with `PORT`, `MONGO_URI`, `JWT_SECRET`  
3. Run: `npm run dev`

### Frontend
1. `npm install`  
2. Create `.env` with `VITE_API_URL=http://localhost:5000/api`  
3. Run: `npm run dev`

## API Highlights
- `POST /api/auth/register` — Register user  
- `POST /api/auth/login` — Login  
- `GET /api/jobs` — List jobs  
- `POST /api/employer/jobs` — Post job (Employer)  
- `PUT /api/employer/jobs/:id` — Edit job (Employer)  
- `GET /api/user/profile` — Get profile  
- `PUT /api/user/profile` — Update profile  
- `GET /api/admin/jobs` — Admin job management

## Future Work
- Social login  
- Notifications  
- Advanced search  
- Admin analytics

---

Thanks for checking out the project! Contact for questions.
