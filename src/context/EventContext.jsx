import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const EventContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState({ createdEvents: [], invitedEvents: [] });
  const [loading, setLoading] = useState(false);

  // Fetch all user events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/event`);
      setEvents(response.data.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch events'
      };
    } finally {
      setLoading(false);
    }
  };

  // Fetch single event
  const fetchEvent = async (id) => {
    try {
      const response = await axios.get(`${API_BASE}/event/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch event'
      };
    }
  };

  // Create new event
  const createEvent = async (eventData) => {
    try {
      const response = await axios.post(`${API_BASE}/event`, eventData);
      await fetchEvents(); 
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create event'
      };
    }
  };

  // Update event
  const updateEvent = async (id, eventData) => {
    try {
      const response = await axios.put(`${API_BASE}/event/${id}`, eventData);
      await fetchEvents(); // Refresh events list
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update event'
      };
    }
  };

  // Delete event
  const deleteEvent = async (id) => {
    try {
      await axios.delete(`${API_BASE}/event/${id}`);
      await fetchEvents(); // Refresh events list
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete event'
      };
    }
  };

  // Invite user to event
  const inviteUser = async (eventId, email) => {
    try {
      const response = await axios.post(`${API_BASE}/event/${eventId}/invite`, {
        userEmail: email
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send invitation'
      };
    }
  };

  const voteOnPoll = async (eventId, optionIndex) => {
    try {
      console.log('🗳️ Submitting vote:', { eventId, optionIndex }); // DEBUG
      const response = await axios.post(`${API_BASE}/event/${eventId}/vote`, {
        optionIndex: parseInt(optionIndex) // Ensure it's a number
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Vote error:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to submit vote'
      };
    }
  };

  const getPollResults = async (eventId) => {
    try {
      const response = await axios.get(`${API_BASE}/event/${eventId}/poll`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Get poll results error:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get poll results'
      };
    }
  };

  const closePoll = async (eventId) => {
    try {
      const response = await axios.post(`${API_BASE}/event/${eventId}/poll/close`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Close poll error:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to close poll'
      };
    }
  };

  const value = {
    events,
    loading,
    fetchEvents,
    fetchEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    inviteUser,
    voteOnPoll,
    getPollResults,
    closePoll
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};
