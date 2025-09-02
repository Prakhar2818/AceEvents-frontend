import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/EventCard';
import CreateEventModal from '../components/CreateEventModal';
import LoadingSpinner from '../components/LoadingSpinner';

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* AceEvents Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full mr-3">
              <span className="text-lg font-bold text-white">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                <span className="text-blue-600">Ace</span>Events
              </h1>
              <p className="text-xs text-gray-500">Collaborative Event Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition flex items-center gap-2"
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">
                  {createdEvents.length + invitedEvents.length-1}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('created')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition ${activeTab === 'created'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                📋 My Events ({createdEvents.length})
              </button>
              <button
                onClick={() => setActiveTab('invited')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition ${activeTab === 'invited'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                📨 Invitations ({invitedEvents.length})
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
                <p className="text-gray-500 mb-6">Start by creating your first collaborative event</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  Create Your First Event
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
                <p className="text-gray-500">Event invitations from other users will appear here</p>
              </div>
            )
          )}
        </div>
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
