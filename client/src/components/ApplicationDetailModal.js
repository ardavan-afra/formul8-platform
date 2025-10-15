import React, { useState } from 'react';
import { X, User, Calendar, FileText, MessageSquare, Check, X as XIcon } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const ApplicationDetailModal = ({ application, onClose, onStatusUpdate, userRole }) => {
  const [notes, setNotes] = useState(application.professorNotes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (status) => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(application._id, status, notes);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Application Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Application Header */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {userRole === 'professor' 
                    ? `${application.student?.name} - ${application.project?.title}`
                    : application.project?.title
                  }
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Applied {formatDate(application.applicationDate)}</span>
                  </div>
                  {application.responseDate && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Responded {formatDate(application.responseDate)}</span>
                    </div>
                  )}
                </div>
              </div>
              <span className={`badge ${
                application.status === 'pending' ? 'badge-warning' :
                application.status === 'accepted' ? 'badge-success' :
                application.status === 'rejected' ? 'badge-danger' :
                'badge-primary'
              }`}>
                {application.status}
              </span>
            </div>
          </div>

          {/* Student Information (for professors) */}
          {userRole === 'professor' && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Student Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Name</p>
                  <p className="text-sm text-gray-600">{application.student?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-600">{application.student?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Department</p>
                  <p className="text-sm text-gray-600">{application.student?.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Academic Year</p>
                  <p className="text-sm text-gray-600">{application.student?.year || 'Not specified'}</p>
                </div>
                {application.student?.gpa && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">GPA</p>
                    <p className="text-sm text-gray-600">{application.student.gpa}</p>
                  </div>
                )}
              </div>
              
              {/* Student Skills */}
              {application.student?.skills && application.student.skills.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {application.student.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Student Interests */}
              {application.student?.interests && application.student.interests.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Research Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {application.student.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Project Information (for students) */}
          {userRole === 'student' && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Project Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Project Title</p>
                  <p className="text-sm text-gray-600">{application.project?.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Department</p>
                  <p className="text-sm text-gray-600">{application.project?.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Professor</p>
                  <p className="text-sm text-gray-600">{application.professor?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Professor Email</p>
                  <p className="text-sm text-gray-600">{application.professor?.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Application Content */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Application Content
            </h4>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Cover Letter</p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{application.coverLetter}</p>
                </div>
              </div>

              {application.relevantExperience && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Relevant Experience</p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{application.relevantExperience}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Motivation</p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{application.motivation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Professor Notes */}
          {application.professorNotes && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Professor Notes
              </h4>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{application.professorNotes}</p>
              </div>
            </div>
          )}

          {/* Professor Actions */}
          {userRole === 'professor' && application.status === 'pending' && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Review Application</h4>
              
              <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  rows="3"
                  className="input-field"
                  placeholder="Add any notes about this application..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={isUpdating}
                  className="btn-danger flex items-center space-x-2"
                >
                  {isUpdating ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <XIcon className="h-4 w-4" />
                      <span>Reject</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleStatusUpdate('accepted')}
                  disabled={isUpdating}
                  className="btn-primary flex items-center space-x-2"
                >
                  {isUpdating ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Accept</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailModal;


