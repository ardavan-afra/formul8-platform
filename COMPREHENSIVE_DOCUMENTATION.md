# Formul8 - Research Project Platform
## Comprehensive Technical Documentation

### Table of Contents
1. [Application Overview](#application-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Database Schema & Data Models](#database-schema--data-models)
4. [API Endpoints & Backend Structure](#api-endpoints--backend-structure)
5. [Frontend Components & UI Structure](#frontend-components--ui-structure)
6. [Authentication & Authorization](#authentication--authorization)
7. [User Flows & Functionality](#user-flows--functionality)
8. [Deployment & Configuration](#deployment--configuration)
9. [Implementation Guide for Next.js](#implementation-guide-for-nextjs)

---

## Application Overview

**Formul8** is a comprehensive web platform that connects professors with undergraduate students for research projects. The application facilitates the discovery, application, and management of research opportunities in an academic setting.

### Core Functionality
- **For Professors**: Create and manage research projects, review student applications, manage project capacity
- **For Students**: Browse and search projects, apply to opportunities, track application status
- **General**: User authentication, role-based access, responsive design, real-time search

### Key Features
- Multi-role user system (Professor/Student)
- Advanced project search and filtering
- Application management system
- Real-time status tracking
- Responsive design for all devices
- Secure authentication with JWT

---

## Architecture & Technology Stack

### Backend Architecture
```
server/
├── index.js                 # Main server entry point
├── middleware/
│   └── auth.js             # JWT authentication middleware
├── models/
│   ├── User.js             # User data model
│   ├── Project.js          # Project data model
│   └── Application.js      # Application data model
└── routes/
    ├── auth.js             # Authentication routes
    ├── projects.js         # Project management routes
    ├── applications.js    # Application management routes
    └── users.js           # User profile routes
```

### Frontend Architecture
```
client/src/
├── App.js                  # Main app component with routing
├── contexts/
│   └── AuthContext.js      # Authentication state management
├── components/
│   ├── Navbar.js           # Navigation component
│   ├── ProjectCard.js        # Project display component
│   ├── ApplicationModal.js   # Application submission modal
│   ├── ApplicationDetailModal.js # Application review modal
│   └── LoadingSpinner.js    # Loading state component
├── pages/
│   ├── Dashboard.js         # Main dashboard
│   ├── Projects.js         # Project browsing
│   ├── ProjectDetail.js    # Individual project view
│   ├── CreateProject.js    # Project creation form
│   ├── EditProject.js      # Project editing
│   ├── MyProjects.js       # Professor's projects
│   ├── Applications.js     # Application management
│   ├── Profile.js          # User profile
│   ├── Login.js            # Login form
│   └── Register.js         # Registration form
└── utils/
    └── api.js              # API client configuration
```

### Technology Stack

#### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **CORS** for cross-origin requests

#### Frontend
- **React 18** with functional components and hooks
- **React Router v6** for navigation
- **React Query** for data fetching and caching
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for HTTP requests

---

## Database Schema & Data Models

### User Model
```javascript
{
  name: String (required, min: 2 chars),
  email: String (required, unique, lowercase),
  password: String (required, min: 6 chars, hashed),
  role: String (enum: ['professor', 'student'], required),
  department: String (required),
  bio: String (max: 500 chars),
  skills: [String],
  interests: [String],
  gpa: Number (min: 0, max: 4.0), // Student only
  year: String (enum: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate']), // Student only
  avatar: String (default: ''),
  timestamps: true
}
```

### Project Model
```javascript
{
  title: String (required, min: 5 chars),
  description: String (required, min: 50 chars, max: 2000 chars),
  professor: ObjectId (ref: 'User', required),
  department: String (required),
  skills: [String],
  requirements: {
    gpa: Number (min: 0, max: 4.0),
    year: [String] (enum: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate']),
    prerequisites: [String]
  },
  duration: String (required),
  timeCommitment: String (required),
  compensation: String (enum: ['unpaid', 'stipend', 'course_credit', 'hourly'], default: 'unpaid'),
  compensationAmount: String,
  status: String (enum: ['active', 'paused', 'completed', 'cancelled'], default: 'active'),
  maxStudents: Number (default: 1, min: 1),
  currentStudents: Number (default: 0, min: 0),
  materials: [{
    name: String (required),
    type: String (enum: ['document', 'image', 'video', 'link', 'other'], required),
    url: String (required),
    description: String
  }],
  tags: [String],
  applicationDeadline: Date,
  startDate: Date,
  endDate: Date,
  timestamps: true
}
```

### Application Model
```javascript
{
  student: ObjectId (ref: 'User', required),
  project: ObjectId (ref: 'Project', required),
  professor: ObjectId (ref: 'User', required),
  coverLetter: String (required, max: 1000 chars),
  relevantExperience: String (max: 1000 chars),
  motivation: String (required, max: 1000 chars),
  status: String (enum: ['pending', 'accepted', 'rejected', 'withdrawn'], default: 'pending'),
  professorNotes: String (max: 1000 chars),
  applicationDate: Date (default: Date.now),
  responseDate: Date,
  timestamps: true
}
```

### Database Indexes
- **Projects**: Text search index on title, description, department, skills, tags
- **Applications**: Unique compound index on student + project (one application per student per project)

---

## API Endpoints & Backend Structure

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
  - Body: `{ name, email, password, role, department, bio?, skills?, interests?, gpa?, year? }`
  - Response: `{ token, user }`
- `POST /login` - User login
  - Body: `{ email, password }`
  - Response: `{ token, user }`
- `GET /me` - Get current user (protected)
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ user }`

### Project Routes (`/api/projects`)
- `GET /` - Get all projects with search/filter
  - Query params: `search?, department?, skills?, status?, page?, limit?`
  - Response: `{ projects, totalPages, currentPage, total }`
- `GET /:id` - Get single project
  - Response: `{ project }`
- `POST /` - Create project (professor only)
  - Body: `{ title, description, department, skills?, requirements?, duration, timeCommitment, compensation?, compensationAmount?, maxStudents?, materials?, tags?, applicationDeadline?, startDate?, endDate? }`
  - Response: `{ project }`
- `PUT /:id` - Update project (owner only)
  - Body: `{ title?, description?, ... }`
  - Response: `{ project }`
- `DELETE /:id` - Delete project (owner only)
  - Response: `{ message }`
- `GET /professor/my-projects` - Get professor's projects (professor only)
  - Response: `[projects]`

### Application Routes (`/api/applications`)
- `POST /` - Submit application (student only)
  - Body: `{ projectId, coverLetter, relevantExperience?, motivation }`
  - Response: `{ application }`
- `GET /student/my-applications` - Get student's applications (student only)
  - Response: `[applications]`
- `GET /professor/my-project-applications` - Get project applications (professor only)
  - Response: `[applications]`
- `PUT /:id/status` - Update application status (professor only)
  - Body: `{ status, professorNotes? }`
  - Response: `{ application }`
- `DELETE /:id` - Withdraw application (student only)
  - Response: `{ message }`

### User Routes (`/api/users`)
- `GET /profile` - Get user profile (protected)
  - Response: `{ user }`
- `PUT /profile` - Update user profile (protected)
  - Body: `{ name?, bio?, skills?, interests?, gpa?, year?, avatar? }`
  - Response: `{ user }`
- `GET /departments` - Get all departments
  - Response: `[departments]`
- `GET /skills` - Get all skills
  - Response: `[skills]`

### Middleware
- **auth.js**: JWT token validation and user authentication
- **requireRole**: Role-based access control (professor/student)

---

## Frontend Components & UI Structure

### Core Components

#### App.js
- Main application component with routing
- Protected and public route components
- React Query client setup
- Authentication context provider

#### AuthContext.js
- Global authentication state management
- Login/logout functionality
- User data persistence
- Error handling for auth operations

#### Navbar.js
- Responsive navigation bar
- Role-based menu items
- User profile dropdown
- Mobile menu toggle

### Page Components

#### Dashboard.js
- Role-specific dashboard content
- Quick action buttons
- Statistics display
- Recent projects/applications overview

#### Projects.js
- Project browsing with search and filters
- Pagination support
- Real-time search functionality
- Filter management

#### ProjectCard.js
- Individual project display
- Status indicators
- Skills and requirements display
- Action buttons

#### CreateProject.js
- Comprehensive project creation form
- Dynamic skill/prerequisite/tag management
- Material attachment system
- Form validation

#### Applications.js
- Application management interface
- Status filtering
- Professor review capabilities
- Student application tracking

### UI Design System

#### Styling
- **Tailwind CSS** for utility-first styling
- Custom component classes for consistency
- Responsive design patterns
- Dark/light theme support ready

#### Component Patterns
- Card-based layouts
- Modal dialogs for forms
- Loading states with spinners
- Error handling with user feedback
- Form validation with real-time feedback

#### Color Scheme
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Danger: Red (#EF4444)
- Neutral: Gray scale

---

## Authentication & Authorization

### Authentication Flow
1. **Registration**: User provides details, password is hashed with bcrypt
2. **Login**: Credentials validated, JWT token generated (7-day expiry)
3. **Token Storage**: JWT stored in localStorage
4. **Request Authentication**: Token sent in Authorization header
5. **Token Validation**: Middleware validates token and attaches user to request

### Authorization Levels
- **Public Routes**: Login, Register
- **Authenticated Routes**: Dashboard, Projects, Applications, Profile
- **Role-Based Routes**: 
  - Professor: Create Project, My Projects, Edit Project
  - Student: Apply to Projects, My Applications

### Security Features
- Password hashing with bcrypt (salt rounds: 10)
- JWT token expiration (7 days)
- Input validation with express-validator
- CORS configuration
- SQL injection prevention (MongoDB)
- XSS protection through input sanitization

---

## User Flows & Functionality

### Professor Workflow
1. **Registration**: Create account with professor role
2. **Profile Setup**: Add bio, research areas, skills
3. **Project Creation**: 
   - Fill project details, requirements, materials
   - Set capacity, deadlines, compensation
   - Add skills and prerequisites
4. **Application Management**:
   - Review incoming applications
   - Accept/reject with notes
   - Track project capacity
5. **Project Management**:
   - Edit project details
   - Update status (active/paused/completed)
   - Monitor student enrollment

### Student Workflow
1. **Registration**: Create account with student role
2. **Profile Setup**: Add academic info, skills, interests, GPA
3. **Project Discovery**:
   - Browse and search projects
   - Filter by department, skills, status
   - View detailed project information
4. **Application Process**:
   - Submit application with cover letter
   - Provide relevant experience
   - Explain motivation
5. **Status Tracking**:
   - Monitor application status
   - View professor feedback
   - Withdraw applications if needed

### Application States
- **Pending**: Awaiting professor review
- **Accepted**: Student accepted to project
- **Rejected**: Application declined
- **Withdrawn**: Student withdrew application

---

## Deployment & Configuration

### Environment Variables
```env
# Server
MONGODB_URI=mongodb://localhost:27017/research-platform
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=development

# Client
REACT_APP_API_URL=http://localhost:5000/api
```

### Build Process
```bash
# Install dependencies
npm run install-all

# Development
npm run dev          # Start both servers
npm run server       # Backend only
npm run client       # Frontend only

# Production
npm run build        # Build client
npm start           # Start production server
```

### Database Setup
- MongoDB instance required
- Collections created automatically on first use
- Indexes applied for search optimization

---

## Implementation Guide for Next.js

### Project Structure for Next.js
```
nextjs-app/
├── app/                    # App Router (Next.js 13+)
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   ├── projects/
│   │   └── [id]/
│   ├── applications/
│   ├── profile/
│   └── layout.tsx
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── forms/              # Form components
│   ├── modals/             # Modal components
│   └── layout/             # Layout components
├── lib/
│   ├── auth.ts            # Authentication utilities
│   ├── api.ts             # API client
│   ├── validations.ts     # Form validations
│   └── utils.ts           # Utility functions
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript definitions
├── middleware.ts           # Next.js middleware
└── prisma/                 # Database schema (if using Prisma)
```

### Key Implementation Considerations

#### 1. Authentication
```typescript
// lib/auth.ts
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!)
}

export function getTokenFromRequest(request: NextRequest) {
  return request.headers.get('authorization')?.replace('Bearer ', '')
}
```

#### 2. API Routes
```typescript
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  
  // Validate user and password
  const user = await findUserByEmail(email)
  const isValid = await bcrypt.compare(password, user.password)
  
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
  
  return NextResponse.json({ token, user })
}
```

#### 3. Database Integration
```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

#### 4. Form Handling
```typescript
// components/forms/CreateProjectForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const projectSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(50),
  department: z.string().min(2),
  // ... other fields
})

export function CreateProjectForm() {
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema)
  })
  
  // Form implementation
}
```

#### 5. State Management
```typescript
// contexts/AuthContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Implementation
}
```

### Migration Checklist

#### Backend Migration
- [ ] Set up Next.js API routes
- [ ] Implement authentication middleware
- [ ] Create database models (Prisma/Supabase)
- [ ] Set up environment variables
- [ ] Implement input validation
- [ ] Add error handling
- [ ] Set up CORS configuration

#### Frontend Migration
- [ ] Set up Next.js app structure
- [ ] Implement authentication context
- [ ] Create reusable components
- [ ] Set up routing (App Router)
- [ ] Implement form handling
- [ ] Add loading states
- [ ] Set up error boundaries
- [ ] Implement responsive design

#### Database Migration
- [ ] Set up database connection
- [ ] Create schema definitions
- [ ] Set up indexes for search
- [ ] Implement data validation
- [ ] Set up migrations
- [ ] Add seed data

#### Deployment
- [ ] Set up hosting (Vercel/Netlify)
- [ ] Configure environment variables
- [ ] Set up database (MongoDB Atlas/Supabase)
- [ ] Configure domain and SSL
- [ ] Set up monitoring and logging

### Performance Optimizations
- Server-side rendering for SEO
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Caching strategies with React Query
- Database query optimization
- CDN integration for static assets

### Security Considerations
- Input sanitization and validation
- CSRF protection
- Rate limiting
- Secure headers
- Environment variable protection
- Database connection security

This comprehensive documentation provides everything needed to understand, maintain, or rebuild the Formul8 application using any modern web framework, with Next.js being the recommended approach for a modern implementation.
