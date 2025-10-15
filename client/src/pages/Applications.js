import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Eye, 
  Check, 
  X, 
  User, 
  Calendar, 
  FileText,
  MessageSquare,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ApplicationDetailModal from '../components/ApplicationDetailModal';

const Applications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filter, setFilter] = useState('all');

  // Fetch applications based on user role
  const { data: applications, isLoading, error } = useQuery(
    'user-applications',
    () => {
      if (user?.role === 'student') {
        return api.get('/applications/student/my-applications').then(res => res.data);
      } else {
        return api.get('/applications/professor/my-project-applications').then(res => res.data);
      }
    },
    { 
      enabled: !!user,
      staleTime: 2 * 60 * 1000 
    }
  );

  // Update application status mutation
  const updateStatusMutation = useMutation(
    ({ applicationId, status, notes }) => 
      api.put(`/applications/${applicationId}/status`, { status, professorNotes: notes }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user-applications');
        setSelectedApplication(null);
      }
    }
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'accepted':
        return 'badge-success';
      case 'rejected':
        return 'badge-danger';
      case 'withdrawn':
        return 'badge-primary';
      default:
        return 'badge-primary';
    }
  };

  const filteredApplications = applications?.filter(application => {
    if (filter === 'all') return true;
    return application.status === filter;
  }) || [];

  const handleStatusUpdate = (applicationId, status, notes = '') => {
    updateStatusMutation.mutate({ applicationId, status, notes });
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" className="mt-20" />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading applications. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {user?.role === 'professor' ? 'Project Applications' : 'My Applications'}
        </h1>
        <p className="text-gray-600">
          {user?.role === 'professor' 
            ? 'Review and manage applications for your research projects.'
            : 'Track the status of your research project applications.'
          }
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex space-x-1">
          {[
            { key: 'all', label: 'All Applications' },
            { key: 'pending', label: 'Pending' },
            { key: 'accepted', label: 'Accepted' },
            { key: 'rejected', label: 'Rejected' },
            { key: 'withdrawn', label: 'Withdrawn' }
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

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {filteredApplications.length > 0 ? (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div key={application._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user?.role === 'professor' 
                          ? `${application.student?.name} - ${application.project?.title}`
                          : application.project?.title
                        }
                      </h3>
                      <span className={`badge ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Applied {new Date(application.applicationDate).toLocaleDateString()}</span>
                      </div>
                      
                      {user?.role === 'professor' && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>{application.student?.year} • {application.student?.department}</span>
                        </div>
                      )}
                      
                      {user?.role === 'student' && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>{application.professor?.name}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 line-clamp-2">
                      {application.coverLetter}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="btn-secondary flex items-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                    
                    {user?.role === 'professor' && application.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(application._id, 'accepted')}
                          disabled={updateStatusMutation.isLoading}
                          className="btn-primary flex items-center space-x-1"
                        >
                          <Check className="h-4 w-4" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(application._id, 'rejected')}
                          disabled={updateStatusMutation.isLoading}
                          className="btn-danger flex items-center space-x-1"
                        >
                          <X className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Student Skills (for professors) */}
                {user?.role === 'professor' && application.student?.skills && application.student.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {application.student.skills.slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {skill}
                      </span>
                    ))}
                    {application.student.skills.length > 5 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{application.student.skills.length - 5} more
                      </span>
                    )}
                  </div>
                )}

                {/* Professor Notes */}
                {application.professorNotes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-1">
                      <MessageSquare className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Professor Notes:</span>
                    </div>
                    <p className="text-sm text-gray-600">{application.professorNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {filter === 'all' 
                ? user?.role === 'professor' 
                  ? "No applications have been submitted to your projects yet."
                  : "You haven't applied to any projects yet."
                : `No ${filter} applications found.`
              }
            </p>
            {filter === 'all' && user?.role === 'student' && (
              <Link
                to="/projects"
                className="btn-primary"
              >
                Browse Projects
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onStatusUpdate={handleStatusUpdate}
          userRole={user?.role}
        />
      )}
    </div>
  );
};

export default Applications;


