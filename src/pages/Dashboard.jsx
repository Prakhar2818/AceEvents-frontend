import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/EventCard';
import CreateEventModal from '../components/CreateEventModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { events, loading, fetchEvents } = useEvents();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('created');

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) return <LoadingSpinner message="Loading your events..." />;

  const { createdEvents, invitedEvents } = events;

  // ✅ Calculate poll statistics
  const pollStats = {
    totalPolls: [...createdEvents, ...invitedEvents].filter(event => event.poll).length,
    activePolls: [...createdEvents, ...invitedEvents].filter(event => event.poll?.isActive).length,
    totalVotes: [...createdEvents, ...invitedEvents]
      .filter(event => event.poll)
      .reduce((total, event) => {
        return total + (event.poll.options?.reduce((eventTotal, option) => 
          eventTotal + (option.votes?.length || 0), 0) || 0);
      }, 0),
    myVotes: invitedEvents.filter(event => 
      event.poll?.options?.some(option => 
        option.votes?.some(vote => vote.user === user?.id)
      )
    ).length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* AceEvents Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mr-3">
              <span className="text-lg font-bold text-white">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                <span className="text-blue-600">Ace</span>Events
              </h1>
              <p className="text-xs text-gray-500">Collaborative Event & Polling Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition flex items-center gap-2"
            >
              <span className="text-lg">➕</span>
              New Event
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user?.username}</span>! 👋
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* ✅ Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Created Events</p>
                <p className="text-2xl font-bold text-gray-900">{createdEvents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">📨</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Invitations</p>
                <p className="text-2xl font-bold text-gray-900">{invitedEvents.length}</p>
              </div>
            </div>
          </div>

          {/* ✅ NEW: Poll Stats Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">🗳️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Polls</p>
                <p className="text-2xl font-bold text-gray-900">{pollStats.activePolls}</p>
                <p className="text-xs text-purple-600">of {pollStats.totalPolls} total</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Votes</p>
                <p className="text-2xl font-bold text-gray-900">{pollStats.totalVotes}</p>
                <p className="text-xs text-orange-600">across all polls</p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Enhanced Tabs with Poll Info */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('created')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition flex items-center gap-2 ${
                  activeTab === 'created'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="text-lg">📋</span>
                My Events ({createdEvents.length})
                {createdEvents.filter(e => e.poll?.isActive).length > 0 && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    {createdEvents.filter(e => e.poll?.isActive).length} active polls
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('invited')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition flex items-center gap-2 ${
                  activeTab === 'invited'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="text-lg">📨</span>
                Invitations ({invitedEvents.length})
                {invitedEvents.filter(e => e.poll?.isActive).length > 0 && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                    {invitedEvents.filter(e => e.poll?.isActive).length} to vote
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'created' ? (
            createdEvents.length > 0 ? (
              createdEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  isCreator={true}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events created yet</h3>
                <p className="text-gray-500 mb-6">Start by creating your first collaborative event with interactive polling</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  🚀 Create Your First Event
                </button>
              </div>
            )
          ) : (
            invitedEvents.length > 0 ? (
              invitedEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  isCreator={false}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">📬</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No invitations yet</h3>
                <p className="text-gray-500">Event invitations from other users will appear here. You'll be able to vote on their polls!</p>
              </div>
            )
          )}
        </div>

        {/* ✅ NEW: Quick Poll Overview */}
        {pollStats.activePolls > 0 && (
          <div className="mt-8 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              Active Polls Requiring Your Attention
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...createdEvents, ...invitedEvents]
                .filter(event => event.poll?.isActive)
                .slice(0, 4)
                .map(event => (
                  <Link
                    key={event._id}
                    to={`/event/${event._id}`}
                    className="bg-white rounded-lg p-4 border border-purple-200 hover:border-purple-400 transition-all hover:shadow-md"
                  >
                    <h4 className="font-medium text-gray-900 mb-2">{event.title}</h4>
                    <p className="text-sm text-purple-800 mb-2">"{event.poll.question}"</p>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{event.poll.options?.reduce((total, opt) => total + (opt.votes?.length || 0), 0) || 0} votes</span>
                      <span>{event.poll.options?.length || 0} options</span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </main>

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchEvents();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
