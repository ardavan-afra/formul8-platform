import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Tag, 
  DollarSign,
  FileText,
  ExternalLink,
  Edit,
  Trash2,
  Send
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ApplicationModal from '../components/ApplicationModal';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  // Fetch project details
  const { data: project, isLoading, error } = useQuery(
    ['project', id],
    () => api.get(`/projects/${id}`).then(res => res.data),
    { enabled: !!id }
  );

  // Check if user has already applied
  const { data: existingApplication } = useQuery(
    ['application', id],
    () => api.get(`/applications/student/my-applications`).then(res => 
      res.data.find(app => app.project._id === id)
    ),
    { 
      enabled: !!user && user.role === 'student' && !!id,
      staleTime: 2 * 60 * 1000 
    }
  );

  // Delete project mutation
  const deleteProjectMutation = useMutation(
    () => api.delete(`/projects/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('projects');
        navigate('/my-projects');
      }
    }
  );

  const formatDate = (date) => {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'paused':
        return 'badge-warning';
      case 'completed':
        return 'badge-primary';
      case 'cancelled':
        return 'badge-danger';
      default:
        return 'badge-primary';
    }
  };

  const getCompensationText = (compensation, amount) => {
    switch (compensation) {
      case 'unpaid':
        return 'Unpaid';
      case 'stipend':
        return `Stipend: ${amount || 'TBD'}`;
      case 'course_credit':
        return 'Course Credit';
      case 'hourly':
        return `$${amount || 'TBD'}/hour`;
      default:
        return 'TBD';
    }
  };

  const canApply = () => {
    if (!user || user.role !== 'student') return false;
    if (existingApplication) return false;
    if (project?.status !== 'active') return false;
    if (project?.currentStudents >= project?.maxStudents) return false;
    if (project?.applicationDeadline && new Date() > new Date(project.applicationDeadline)) return false;
    return true;
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      deleteProjectMutation.mutate();
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" className="mt-20" />;
  }

  if (error || !project) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Project not found or error loading project.</p>
        <Link to="/projects" className="btn-primary mt-4">
          Back to Projects
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === project.professor._id;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
              <span className={`badge ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{project.department}</span>
            </div>
          </div>
          
          {isOwner && (
            <div className="flex space-x-2">
              <Link
                to={`/edit-project/${project._id}`}
                className="btn-secondary flex items-center space-x-1"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleteProjectMutation.isLoading}
                className="btn-danger flex items-center space-x-1"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        <p className="text-gray-700 leading-relaxed">{project.description}</p>
      </div>

      {/* Project Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Requirements */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
            <div className="space-y-4">
              {project.requirements?.gpa && (
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 w-24">GPA:</span>
                  <span className="text-sm text-gray-600">{project.requirements.gpa}+</span>
                </div>
              )}
              
              {project.requirements?.year && project.requirements.year.length > 0 && (
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 w-24">Year:</span>
                  <span className="text-sm text-gray-600">
                    {project.requirements.year.join(', ')}
                  </span>
                </div>
              )}
              
              {project.requirements?.prerequisites && project.requirements.prerequisites.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Prerequisites:</span>
                  <ul className="mt-1 list-disc list-inside text-sm text-gray-600">
                    {project.requirements.prerequisites.map((prereq, index) => (
                      <li key={index}>{prereq}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {project.skills && project.skills.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Materials */}
          {project.materials && project.materials.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Materials</h2>
              <div className="space-y-3">
                {project.materials.map((material, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{material.name}</h4>
                      {material.description && (
                        <p className="text-sm text-gray-600">{material.description}</p>
                      )}
                    </div>
                    <a
                      href={material.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h2>
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-3 text-gray-400" />
                <span className="text-gray-700">
                  {project.currentStudents}/{project.maxStudents} students
                </span>
              </div>
              
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-3 text-gray-400" />
                <span className="text-gray-700">{project.timeCommitment}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                <span className="text-gray-700">{project.duration}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <DollarSign className="h-4 w-4 mr-3 text-gray-400" />
                <span className="text-gray-700">
                  {getCompensationText(project.compensation, project.compensationAmount)}
                </span>
              </div>
              
              {project.startDate && (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="text-gray-700">Starts: {formatDate(project.startDate)}</span>
                </div>
              )}
              
              {project.applicationDeadline && (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="text-gray-700">
                    Deadline: {formatDate(project.applicationDeadline)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Professor Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Professor</h2>
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium">
                  {project.professor.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{project.professor.name}</h3>
                <p className="text-sm text-gray-600">{project.professor.department}</p>
              </div>
            </div>
            {project.professor.bio && (
              <p className="text-sm text-gray-600 mt-3">{project.professor.bio}</p>
            )}
          </div>

          {/* Application Button */}
          {user?.role === 'student' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {existingApplication ? (
                <div className="text-center">
                  <h3 className="font-medium text-gray-900 mb-2">Application Status</h3>
                  <span className={`badge ${
                    existingApplication.status === 'pending' ? 'badge-warning' :
                    existingApplication.status === 'accepted' ? 'badge-success' :
                    existingApplication.status === 'rejected' ? 'badge-danger' :
                    'badge-primary'
                  }`}>
                    {existingApplication.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-2">
                    Applied on {formatDate(existingApplication.applicationDate)}
                  </p>
                </div>
              ) : canApply() ? (
                <button
                  onClick={() => setShowApplicationModal(true)}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Apply to Project</span>
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {project.status !== 'active' 
                      ? 'This project is not currently accepting applications.'
                      : project.currentStudents >= project.maxStudents
                      ? 'This project has reached maximum capacity.'
                      : project.applicationDeadline && new Date() > new Date(project.applicationDeadline)
                      ? 'The application deadline has passed.'
                      : 'You must be logged in as a student to apply.'
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <ApplicationModal
          project={project}
          onClose={() => setShowApplicationModal(false)}
        />
      )}
    </div>
  );
};

export default ProjectDetail;


