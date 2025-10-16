# Formul8 - Research Project Platform

A comprehensive web application that connects professors with undergraduate students for research projects. Professors can create and manage research opportunities, while students can search, discover, and apply to projects that match their interests and skills.

## Features

### For Professors
- Create and manage research projects with detailed descriptions
- Set requirements (GPA, academic year, prerequisites)
- Add project materials and resources
- Review and manage student applications
- Accept or reject applications with notes
- Track project capacity and student enrollment

### For Students
- Browse and search research projects
- Filter projects by department, skills, and other criteria
- View detailed project information and requirements
- Apply to projects with cover letters and motivation statements
- Track application status
- Manage profile with skills and research interests

### General Features
- User authentication and role-based access
- Responsive design for desktop and mobile
- Real-time search and filtering
- Modern, intuitive user interface
- Secure API with data validation

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

### Frontend
- **React** with functional components and hooks
- **React Router** for navigation
- **React Query** for data fetching and caching
- **Tailwind CSS** for styling
- **Lucide React** for icons

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SelfDirectedResearch
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/research-platform
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

### Alternative Setup

If you prefer to run the servers separately:

1. **Start the backend server**
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Start the frontend server** (in a new terminal)
   ```bash
   cd client
   npm install
   npm start
   ```

## Usage

### First Time Setup

1. **Access the application** at `http://localhost:3000`

2. **Create an account** as either a professor or student

3. **Complete your profile** with relevant information

### For Professors

1. **Create a project**:
   - Click "Create New Project" from the dashboard
   - Fill in project details, requirements, and materials
   - Set application deadlines and student capacity

2. **Manage applications**:
   - View applications in the "Applications" section
   - Review student profiles and application materials
   - Accept or reject applications with optional notes

### For Students

1. **Browse projects**:
   - Use the search and filter options to find relevant projects
   - View detailed project information and requirements

2. **Apply to projects**:
   - Click "Apply to Project" on project detail pages
   - Write a compelling cover letter and motivation statement
   - Track your application status

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects (with search/filter)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project (professor only)
- `PUT /api/projects/:id` - Update project (owner only)
- `DELETE /api/projects/:id` - Delete project (owner only)
- `GET /api/projects/professor/my-projects` - Get professor's projects

### Applications
- `POST /api/applications` - Submit application (student only)
- `GET /api/applications/student/my-applications` - Get student's applications
- `GET /api/applications/professor/my-project-applications` - Get project applications
- `PUT /api/applications/:id/status` - Update application status (professor only)
- `DELETE /api/applications/:id` - Withdraw application (student only)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/departments` - Get all departments
- `GET /api/users/skills` - Get all skills

## Database Schema

### User Model
- Basic info (name, email, password, role, department)
- Student-specific fields (GPA, year, skills, interests)
- Professor-specific fields (bio, research areas)

### Project Model
- Project details (title, description, department)
- Requirements (GPA, year, prerequisites, skills)
- Logistics (duration, time commitment, compensation)
- Materials and resources
- Capacity and status tracking

### Application Model
- Student and project references
- Application content (cover letter, experience, motivation)
- Status tracking and professor notes
- Timestamps for application and response dates

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@formul8.app or create an issue in the repository.


