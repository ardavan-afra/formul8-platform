import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { X, Send } from 'lucide-react';
import api from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

const ApplicationModal = ({ project, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    coverLetter: '',
    relevantExperience: '',
    motivation: ''
  });

  const submitApplicationMutation = useMutation(
    (applicationData) => api.post('/applications', applicationData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user-applications');
        queryClient.invalidateQueries('applications');
        onClose();
      }
    }
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const applicationData = {
      projectId: project._id,
      ...formData
    };

    submitApplicationMutation.mutate(applicationData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Apply to {project.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Project Summary</h3>
            <p className="text-sm text-gray-600 mb-2">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.skills?.slice(0, 5).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter *
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              rows="4"
              required
              className="input-field"
              placeholder="Write a cover letter explaining why you're interested in this project and what you can contribute..."
              value={formData.coverLetter}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 50 characters. Explain your interest and relevant background.
            </p>
          </div>

          {/* Relevant Experience */}
          <div>
            <label htmlFor="relevantExperience" className="block text-sm font-medium text-gray-700 mb-2">
              Relevant Experience
            </label>
            <textarea
              id="relevantExperience"
              name="relevantExperience"
              rows="3"
              className="input-field"
              placeholder="Describe any relevant coursework, projects, internships, or work experience..."
              value={formData.relevantExperience}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional. Highlight experience that relates to this project.
            </p>
          </div>

          {/* Motivation */}
          <div>
            <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-2">
              Motivation *
            </label>
            <textarea
              id="motivation"
              name="motivation"
              rows="3"
              required
              className="input-field"
              placeholder="What motivates you to work on this project? What do you hope to learn or achieve?"
              value={formData.motivation}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 50 characters. Explain your motivation and learning goals.
            </p>
          </div>

          {/* Error Display */}
          {submitApplicationMutation.error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {submitApplicationMutation.error.response?.data?.message || 'Failed to submit application'}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={submitApplicationMutation.isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitApplicationMutation.isLoading || !formData.coverLetter.trim() || !formData.motivation.trim()}
              className="btn-primary flex items-center space-x-2"
            >
              {submitApplicationMutation.isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;


