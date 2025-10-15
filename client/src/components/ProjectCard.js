import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, MapPin, Tag } from 'lucide-react';

const ProjectCard = ({ project }) => {
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

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {project.title}
        </h3>
        <span className={`badge ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {project.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{project.department}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-4 w-4 mr-2" />
          <span>{project.currentStudents}/{project.maxStudents} students</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-2" />
          <span>{project.timeCommitment}</span>
        </div>
        
        {project.startDate && (
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Starts {formatDate(project.startDate)}</span>
          </div>
        )}
      </div>

      {project.skills && project.skills.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Tag className="h-4 w-4 mr-1 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Skills:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {project.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {skill}
              </span>
            ))}
            {project.skills.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                +{project.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          by {project.professor?.name}
        </div>
        <Link
          to={`/projects/${project._id}`}
          className="btn-primary text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;


