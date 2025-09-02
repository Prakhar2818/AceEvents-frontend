import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useEvents } from '../context/EventContext';

const EventCard = ({ event, isCreator }) => {
  const { deleteEvent, fetchEvents } = useEvents();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const result = await deleteEvent(event._id);
      if (result.success) {
        alert('Event deleted successfully!');
      } else {
        alert(result.message);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 mr-2">
          {event.title}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${event.status === 'active' ? 'bg-green-100 text-green-800' :
            event.status === 'completed' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
          }`}>
          {event.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {event.description}
      </p>

      {/* Stats */}
      <div className="flex justify-between text-sm text-gray-500 mb-4">
        <span className="flex items-center">
          <span className="mr-1">👥</span>
          {event.participants.length} participants
        </span>
        <span className="flex items-center">
          <span className="mr-1">📅</span>
          {event.dateOptions.length} date options
        </span>
      </div>

      {/* Date Options Preview */}
      {event.dateOptions.length > 0 && (
        <div className="bg-gray-50 rounded p-3 mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">
            📅 First Option: {format(new Date(event.dateOptions[0].date), 'MMM dd, yyyy')} at {event.dateOptions[0].time}
          </p>
          {event.dateOptions.length > 1 && (
            <p className="text-xs text-gray-500">
              +{event.dateOptions.length - 1} more options
            </p>
          )}
        </div>
      )}

      {/* Creator Info */}
      <p className="text-xs text-gray-500 mb-4">
        Created by {event.creator.username} • {format(new Date(event.createdAt), 'MMM dd, yyyy')}
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          to={`/event/${event._id}`}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition"
        >
          {isCreator ? 'Manage Event' : 'View Details'}
        </Link>

        {isCreator && (
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition"
            title="Delete Event"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
