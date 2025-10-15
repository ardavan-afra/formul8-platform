import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Edit, Trash2, Eye, Users, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const MyProjects = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');

  // Fetch professor's projects
  const { data: projects, isLoading, error } = useQuery(
    'my-projects',
    () => api.get('/projects/professor/my-projects').then(res => res.data),
    { 
      enabled: user?.role === 'professor',
      staleTime: 2 * 60 * 1000 
    }
  );

  // Delete project mutation
  const deleteProjectMutation = useMutation(
    (projectId) => api.delete(`/projects/${projectId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('my-projects');
        queryClient.invalidateQueries('projects');
      }
    }
  );

  const handleDelete = (projectId, projectTitle) => {
    if (window.confirm(`Are you sure you want to delete "${projectTitle}"? This action cannot be undone.`)) {
      deleteProjectMutation.mutate(projectId);
    }
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

  const filteredProjects = projects?.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  }) || [];

  if (isLoading) {
    return <LoadingSpinner size="lg" className="mt-20" />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading projects. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Projects</h1>
            <p className="text-gray-600">
              Manage your research projects and track student applications.
            </p>
          </div>
          <Link
            to="/create-project"
            className="btn-primary flex items-center space-x-2"
          >
            <span>Create New Project</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex space-x-1">
          {[
            { key: 'all', label: 'All Projects' },
            { key: 'active', label: 'Active' },
            { key: 'paused', label: 'Paused' },
            { key: 'completed', label: 'Completed' },
            { key: 'cancelled', label: 'Cancelled' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                filter === tab.key
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {filteredProjects.length > 0 ? (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div key={project._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                      <span className={`badge ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{project.currentStudents}/{project.maxStudents} students</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Link
                      to={`/projects/${project._id}`}
                      className="btn-secondary flex items-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </Link>
                    <Link
                      to={`/edit-project/${project._id}`}
                      className="btn-secondary flex items-center space-x-1"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(project._id, project.title)}
                      disabled={deleteProjectMutation.isLoading}
                      className="btn-danger flex items-center space-x-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Skills */}
                {project.skills && project.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.skills.slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {skill}
                      </span>
                    ))}
                    {project.skills.length > 5 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{project.skills.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {filter === 'all' 
                ? "You haven't created any projects yet."
                : `No ${filter} projects found.`
              }
            </p>
            {filter === 'all' && (
              <Link
                to="/create-project"
                className="btn-primary"
              >
                Create Your First Project
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;


