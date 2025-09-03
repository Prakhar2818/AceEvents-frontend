import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useEvents } from '../context/EventContext';
import PollComponent from '../components/PollComponent';
import EditEventModal from '../components/EditEventModal';
import LoadingSpinner from '../components/LoadingSpinner';

const EventPage = () => {
  const { id } = useParams();
  const { fetchEvent, inviteUser } = useEvents();
  const [event, setEvent] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchEvent(id);

      if (result.success) {
        setEvent(result.data.event);
        setUserRole(result.data.userRole);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to load event');
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
      loadEvent();
    } else {
      alert(result.message);
    }

    setInviting(false);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    loadEvent();
  };

  if (loading) {
    return <LoadingSpinner message="Loading event details..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">❌ Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-500">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-500">
            ← Back to Dashboard
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
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-500 mb-4 inline-flex items-center gap-2">
            ← Back to Dashboard
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <p className="text-gray-600">
                by {event.creator.username} • {format(new Date(event.createdAt), 'MMM dd, yyyy')}
              </p>
            </div>
            <div className="flex items-center gap-3">

              {isCreator && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
                >
                  <span className="text-lg">✏️</span>
                  Edit Event
                </button>
              )}

              <span className={`px-4 py-2 rounded-full text-sm font-medium ${event.status === 'active' ? 'bg-green-100 text-green-800' :
                event.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                {event.status}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-xl">📋</span>
                Event Description
              </h2>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </div>

            {/* Interactive Poll Component */}
            {event.poll && (
              <PollComponent
                event={event}
                userRole={userRole}
                onUpdate={loadEvent}
              />
            )}

            {/* Date Options */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">📅</span>
                Date & Time Options
              </h2>
              <div className="space-y-3">
                {event.dateOptions.map((option, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📅</span>
                      <div>
                        <p className="font-medium text-gray-900">
                          {format(new Date(option.date), 'EEEE, MMMM dd, yyyy')}
                        </p>
                        <p className="text-sm text-gray-600">{option.time}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                      {option.votes.length} votes
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 flex items-center gap-2">
                  <span className="text-lg">✨</span>
                  <span>
                    <strong>Stage 3 Complete!</strong> Interactive polling system is now live.
                    Use the poll above to make collaborative decisions in real-time!
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">📊</span>
                Event Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Participants</span>
                  <span className="font-semibold text-gray-900">{event.participants.length + 1}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Date Options</span>
                  <span className="font-semibold text-gray-900">{event.dateOptions.length}</span>
                </div>
                {event.poll && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Poll Options</span>
                      <span className="font-semibold text-gray-900">{event.poll.options?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Poll Status</span>
                      <span className={`font-semibold ${event.poll.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {event.poll.isActive ? 'Active' : 'Closed'}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-gray-600">Event Status</span>
                  <span className="font-semibold text-gray-900 capitalize">{event.status}</span>
                </div>
              </div>
            </div>

            {/* Invite Users (Creator Only) */}
            {isCreator && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-xl">👥</span>
                  Invite Participants
                </h3>
                <form onSubmit={handleInvite} className="space-y-3">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter participant's email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={inviting}
                  />
                  <button
                    type="submit"
                    disabled={inviting || !inviteEmail.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {inviting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sending...
                      </span>
                    ) : (
                      '📧 Send Invitation'
                    )}
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-3">
                  💡 Invited users can participate in voting and see poll results in real-time
                </p>
              </div>
            )}

            {/* Participants List */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">👥</span>
                Participants ({event.participants.length + 1})
              </h3>
              <div className="space-y-3">
                {/* Creator */}
                <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {event.creator.username[0].toUpperCase()}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="font-medium text-gray-900">{event.creator.username}</p>
                    <p className="text-xs text-gray-500">{event.creator.email}</p>
                  </div>
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                    Creator
                  </span>
                </div>

                {/* Participants */}
                {event.participants.map((participant) => (
                  <div key={participant._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                        {participant.user.username[0].toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{participant.user.username}</p>
                        <p className="text-xs text-gray-500">{participant.user.email}</p>
                      </div>
                    </div>
                    <div className="text-xs">
                      {participant.status === 'accepted' && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">✅ Joined</span>
                      )}
                      {participant.status === 'declined' && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">❌ Declined</span>
                      )}
                      {participant.status === 'invited' && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">⏳ Invited</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Event modal */}
      {showEditModal && (
        <EditEventModal
          event={event}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default EventPage;
