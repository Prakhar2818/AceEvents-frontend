import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';

const CreateEventModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    dateOptions: [{ date: '', time: '' }],
    poll: {
      question: '',
      options: ['', ''],
      allowMultiple: false
    }
  });
  const [loading, setLoading] = useState(false);
  const { createEvent } = useEvents();

  const updateDateOption = (index, field, value) => {
    const newDateOptions = [...form.dateOptions];
    newDateOptions[index][field] = value;
    setForm({ ...form, dateOptions: newDateOptions });
  };

  const addDateOption = () => {
    setForm({
      ...form,
      dateOptions: [...form.dateOptions, { date: '', time: '' }]
    });
  };

  const removeDateOption = (index) => {
    if (form.dateOptions.length > 1) {
      const newDateOptions = form.dateOptions.filter((_, i) => i !== index);
      setForm({ ...form, dateOptions: newDateOptions });
    }
  };

  const updatePollOption = (index, value) => {
    const newOptions = [...form.poll.options];
    newOptions[index] = value;
    setForm({
      ...form,
      poll: { ...form.poll, options: newOptions }
    });
  };

  const addPollOption = () => {
    setForm({
      ...form,
      poll: {
        ...form.poll,
        options: [...form.poll.options, '']
      }
    });
  };

  const removePollOption = (index) => {
    if (form.poll.options.length > 2) {
      const newOptions = form.poll.options.filter((_, i) => i !== index);
      setForm({
        ...form,
        poll: { ...form.poll, options: newOptions }
      });
    }
  };

  const isFormValid = () => {
    const validPollOptions = form.poll.options.filter(opt => opt.trim()).length;
    return (
      form.title.trim() &&
      form.description.trim() &&
      form.poll.question.trim() &&
      validPollOptions >= 2 &&
      form.dateOptions.every(opt => opt.date && opt.time)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    const cleanedPollOptions = form.poll.options.filter(option => option.trim());
    
    const eventData = {
      ...form,
      poll: {
        ...form.poll,
        options: cleanedPollOptions
      }
    };

    console.log('🚀 Creating event with data:', eventData); // DEBUG

    const result = await createEvent(eventData);
    
    if (result.success) {
      alert('🎉 Event created successfully with interactive poll!');
      onSuccess();
    } else {
      alert(result.message || 'Failed to create event');
    }
    
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div>
            <h2 className="text-2xl font-bold">Create New Event</h2>
            <p className="text-blue-100">Set up your collaborative event with interactive polling</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Event Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">📝</span>
              Event Information
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                    !form.title.trim() ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter a descriptive event title"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {form.title.length}/100 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                    !form.description.trim() ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describe your event, its purpose, and any important details"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {form.description.length}/500 characters
                </p>
              </div>
            </div>
          </div>

          {/* Date Options */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">📅</span>
                Date & Time Options *
              </h3>
              <button
                type="button"
                onClick={addDateOption}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
              >
                ➕ Add Option
              </button>
            </div>
            
            <div className="space-y-3">
              {form.dateOptions.map((option, index) => (
                <div key={index} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={option.date}
                      onChange={(e) => updateDateOption(index, 'date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">Time</label>
                    <input
                      type="time"
                      required
                      value={option.time}
                      onChange={(e) => updateDateOption(index, 'time', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {form.dateOptions.length > 1 && (
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeDateOption(index)}
                        className="text-red-600 hover:text-red-700 p-2 text-lg"
                        title="Remove this option"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Poll Section */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">🗳️</span>
              Interactive Poll *
            </h3>
            
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-800 mb-4">
                <span className="font-medium">✨ New Feature:</span> Create an interactive poll for collaborative decision-making. 
                Participants can vote in real-time and see live results!
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poll Question *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.poll.question}
                    onChange={(e) => setForm({
                      ...form,
                      poll: { ...form.poll, question: e.target.value }
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 transition ${
                      !form.poll.question.trim() ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="What would you like participants to decide on?"
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {form.poll.question.length}/200 characters
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-gray-700">
                      Poll Options * (minimum 2)
                    </label>
                    <button
                      type="button"
                      onClick={addPollOption}
                      className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1"
                    >
                      ➕ Add Option
                    </button>
                  </div>
                  
                  {form.poll.options.map((option, index) => (
                    <div key={index} className="flex gap-3 mb-3">
                      <input
                        type="text"
                        required
                        value={option}
                        onChange={(e) => updatePollOption(index, e.target.value)}
                        className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 transition ${
                          !option.trim() ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder={`Option ${index + 1} *`}
                        maxLength={100}
                      />
                      {form.poll.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removePollOption(index)}
                          className="text-red-600 hover:text-red-700 px-3 text-lg"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowMultiple"
                    checked={form.poll.allowMultiple}
                    onChange={(e) => setForm({
                      ...form,
                      poll: { ...form.poll, allowMultiple: e.target.checked }
                    })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allowMultiple" className="ml-2 text-sm text-gray-700">
                    Allow multiple selections
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Validation Summary */}
          {!isFormValid() && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-red-800 font-medium mb-2">Please complete the following:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {!form.title.trim() && <li>• Event title is required</li>}
                {!form.description.trim() && <li>• Event description is required</li>}
                {!form.poll.question.trim() && <li>• Poll question is required</li>}
                {form.poll.options.filter(opt => opt.trim()).length < 2 && <li>• At least 2 poll options are required</li>}
                {!form.dateOptions.every(opt => opt.date && opt.time) && <li>• All date and time options must be filled</li>}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className={`flex-1 py-3 rounded-lg font-medium transition ${
                isFormValid() && !loading
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Event...
                </span>
              ) : (
                '🚀 Create Event with Poll'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
