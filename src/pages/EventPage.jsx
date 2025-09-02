import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useEvents } from '../context/EventContext';
import LoadingSpinner from '../components/LoadingSpinner';

const EventPage = () => {
  const { id } = useParams();
  const { fetchEvent, inviteUser } = useEvents();
  const [event, setEvent] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    setLoading(true);
    const result = await fetchEvent(id);
    
    if (result.success) {
      setEvent(result.data.event);
      setUserRole(result.data.userRole);
    } else {
      alert(result.message);
    }
    
    setLoading(false);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInviting(true);
    const result = await inviteUser(event._id, inviteEmail.trim());
    
    if (result.success) {
      setInviteEmail('');
      alert('Invitation sent successfully!');
      loadEvent(); // Refresh event data
    } else {
      alert(result.message);
    }
    
    setInviting(false);
  };

  if (loading) return <LoadingSpinner message="Loading event details..." />;

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-500">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isCreator = userRole === 'creator';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-500 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
              <p className="text-gray-600 mt-1">
                by {event.creator.username} • {format(new Date(event.createdAt), 'MMM dd, yyyy')}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              event.status === 'active' ? 'bg-green-100 text-green-800' :
              event.status === 'completed' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {event.status}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Event Description</h2>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </div>

            {/* Date Options */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📅 Date & Time Options</h2>
              <div className="space-y-3">
                {event.dateOptions.map((option, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📅</span>
                      <div>
                        <p className="font-medium text-gray-900">
                          {format(new Date(option.date), 'EEEE, MMMM dd, yyyy')}
                        </p>
                        <p className="text-sm text-gray-600">{option.time}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {option.votes.length} votes
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  📊 <strong>Next Stage:</strong> Participants will be able to vote on these date options in Stage 4: Polling System
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Info</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <span className="text-2xl mr-3">👥</span>
                  <span>{event.participants.length} participants</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-2xl mr-3">📅</span>
                  <span>{event.dateOptions.length} date options</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-2xl mr-3">📊</span>
                  <span>Status: <span className="capitalize font-medium">{event.status}</span></span>
                </div>
              </div>
            </div>

            {/* Invite Users (Creator Only) */}
            {isCreator && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Invite Participants</h3>
                <form onSubmit={handleInvite} className="space-y-3">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter participant's email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={inviting}
                  />
                  <button
                    type="submit"
                    disabled={inviting || !inviteEmail.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition disabled:opacity-50"
                  >
                    {inviting ? 'Sending...' : 'Send Invitation'}
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-2">
                  Invited users will see this event in their dashboard and can participate in voting
                </p>
              </div>
            )}

            {/* Participants */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                👥 Participants ({event.participants.length + 1})
              </h3>
              <div className="space-y-3">
                {/* Creator */}
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {event.creator.username[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {event.creator.username}
                      <span className="text-xs text-blue-600 ml-2">Creator</span>
                    </p>
                    <p className="text-xs text-gray-500">{event.creator.email}</p>
                  </div>
                </div>

                {/* Participants */}
                {event.participants.map((participant) => (
                  <div key={participant._id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {participant.user.username[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {participant.user.username}
                        </p>
                        <p className="text-xs text-gray-500">{participant.user.email}</p>
                      </div>
                    </div>
                    <div className="text-xs">
                      {participant.status === 'accepted' && (
                        <span className="text-green-600">✅ Joined</span>
                      )}
                      {participant.status === 'declined' && (
                        <span className="text-red-600">❌ Declined</span>
                      )}
                      {participant.status === 'invited' && (
                        <span className="text-yellow-600">⏳ Invited</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">🚧 Coming in Stage 4</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Poll voting functionality</li>
                <li>• Real-time vote counting</li>
                <li>• Visual vote results</li>
                <li>• Invitation responses</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventPage;
