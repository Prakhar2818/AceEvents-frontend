import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';

const CreateEventModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    dateOptions: [{ date: '', time: '' }]
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate all date options are filled
    const hasEmptyOptions = form.dateOptions.some(option => !option.date || !option.time);
    if (hasEmptyOptions) {
      alert('Please fill in all date and time options');
      setLoading(false);
      return;
    }

    const result = await createEvent(form);
    
    if (result.success) {
      alert('Event created successfully!');
      onSuccess();
    } else {
      alert(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Create New Event</h2>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
              <span className="text-sm font-bold text-blue-600">A</span>
            </div>
            <span className="text-sm text-gray-600">AceEvents</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a descriptive event title"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">{form.title.length}/100 characters</p>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your event, its purpose, and any important details"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{form.description.length}/500 characters</p>
            </div>
          </div>

          {/* Date Options */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-700">
                📅 Date & Time Options * 
                <span className="text-xs text-gray-500 ml-1">(Participants will vote on these)</span>
              </label>
              <button
                type="button"
                onClick={addDateOption}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                ➕ Add Option
              </button>
            </div>
            
            <div className="space-y-3">
              {form.dateOptions.map((option, index) => (
                <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={option.date}
                      onChange={(e) => updateDateOption(index, 'date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      min={new Date().toISOString().split('T')[0]} // Prevent past dates
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
                        className="text-red-600 hover:text-red-700 p-2"
                        title="Remove this option"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              💡 Add multiple date/time options so participants can vote on their preferred schedule
            </p>
          </div>

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
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
            >
              {loading ? 'Creating Event...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
