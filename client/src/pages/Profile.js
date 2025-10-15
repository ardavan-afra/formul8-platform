import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { User, Mail, Building, GraduationCap, Star, Tag, Heart, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    skills: user?.skills || [],
    interests: user?.interests || [],
    gpa: user?.gpa || '',
    year: user?.year || ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const updateProfileMutation = useMutation(
    (profileData) => api.put('/users/profile', profileData),
    {
      onSuccess: (response) => {
        updateUser(response.data.user);
        setIsEditing(false);
      }
    }
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interestToRemove) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const profileData = {
      ...formData,
      gpa: formData.gpa ? parseFloat(formData.gpa) : undefined,
      year: formData.year || undefined
    };

    updateProfileMutation.mutate(profileData);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      skills: user?.skills || [],
      interests: user?.interests || [],
      gpa: user?.gpa || '',
      year: user?.year || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-600">
              Manage your profile information and preferences.
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="input-field pl-10"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  className="input-field pl-10 bg-gray-50"
                  value={user?.email}
                  disabled
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="input-field pl-10 bg-gray-50 capitalize"
                  value={user?.role}
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="input-field pl-10 bg-gray-50"
                  value={user?.department}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              className="input-field"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Student-specific fields */}
        {user?.role === 'student' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Year
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GraduationCap className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="year"
                    name="year"
                    className="input-field pl-10"
                    value={formData.year}
                    onChange={handleChange}
                    disabled={!isEditing}
                  >
                    <option value="">Select year</option>
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="gpa" className="block text-sm font-medium text-gray-700 mb-2">
                  GPA
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Star className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="gpa"
                    name="gpa"
                    step="0.01"
                    min="0"
                    max="4"
                    className="input-field pl-10"
                    placeholder="3.5"
                    value={formData.gpa}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Skills */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Tag className="h-5 w-5 mr-2" />
            Skills
          </h2>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
              >
                {skill}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 hover:text-primary-600"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>

          {isEditing && (
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add a skill"
                className="input-field flex-1"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <button
                type="button"
                onClick={addSkill}
                className="btn-secondary"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Interests (for students) */}
        {user?.role === 'student' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Research Interests
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.interests.map((interest, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {interest}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="ml-2 hover:text-gray-600"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>

            {isEditing && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add a research interest"
                  className="input-field flex-1"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                />
                <button
                  type="button"
                  onClick={addInterest}
                  className="btn-secondary"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        )}

        {/* Save Button */}
        {isEditing && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {updateProfileMutation.error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                {updateProfileMutation.error.response?.data?.message || 'Failed to update profile'}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
                disabled={updateProfileMutation.isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateProfileMutation.isLoading}
                className="btn-primary flex items-center space-x-2"
              >
                {updateProfileMutation.isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;


