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

  const createdEvents = events?.createdEvents || [];
  const invitedEvents = events?.invitedEvents || [];

  if (loading) {
    return <LoadingSpinner message="Loading your events..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                <span className="text-xl font-bold text-white">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AceEvents</h1>
                <p className="text-sm text-gray-500">Collaborative Event & Polling Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200 shadow-lg flex items-center gap-2"
              >
                <span className="text-lg">+</span>
                New Event
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.username[0].toUpperCase()}
                </div>
                <span className="text-sm text-gray-600 hidden sm:block">
                  Welcome, <span className="font-semibold">{user?.username}</span>
                </span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200 text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">📅</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Created Events</h3>
                <p className="text-3xl font-bold text-blue-600">{createdEvents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Event Invitations</h3>
                <p className="text-3xl font-bold text-green-600">{invitedEvents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🗳️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Active Polls</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {[...createdEvents, ...invitedEvents].filter(e => e.poll?.isActive).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('created')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition duration-200 ${activeTab === 'created'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              My Events ({createdEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('invited')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition duration-200 ${activeTab === 'invited'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Invitations ({invitedEvents.length})
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'created' ? (
            createdEvents.length > 0 ? (
              createdEvents.map((event) => (
                <EventCard key={event._id} event={event} isCreator={true} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">📅</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No events created yet</h3>
                <p className="text-gray-600 mb-4">Create your first event to get started!</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
                >
                  Create Event
                </button>
              </div>
            )
          ) : (
            invitedEvents.length > 0 ? (
              invitedEvents.map((event) => (
                <EventCard key={event._id} event={event} isCreator={false} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">📋</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No invitations yet</h3>
                <p className="text-gray-600">You'll see event invitations here when you receive them.</p>
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
