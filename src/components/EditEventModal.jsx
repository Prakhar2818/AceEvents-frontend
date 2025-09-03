import React, { useState, useEffect } from 'react';
import { useEvents } from '../context/EventContext';

const EditEventModal = ({ event, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    dateOptions: [{ date: '', time: '' }],
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const { updateEvent } = useEvents();

  // Initialize form with existing event data
  useEffect(() => {
    if (event) {
      setForm({
        title: event.title || '',
        description: event.description || '',
        dateOptions: event.dateOptions?.length > 0 
          ? event.dateOptions.map(opt => ({
              date: new Date(opt.date).toISOString().split('T')[0],
              time: opt.time
            }))
          : [{ date: '', time: '' }],
        status: event.status || 'active'
      });
    }
  }, [event]);

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

  const isFormValid = () => {
    return (
      form.title.trim() &&
      form.description.trim() &&
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

    console.log('🔄 Updating event with data:', form);

    const result = await updateEvent(event._id, form);
    
    if (result.success) {
      alert('✅ Event updated successfully!');
      onSuccess();
    } else {
      alert(result.message || 'Failed to update event');
    }
    
    setLoading(false);
  };

  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div>
            <h2 className="text-2xl font-bold">Edit Event</h2>
            <p className="text-green-100">Update your event details and date options</p>
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 transition ${
                    !form.title.trim() ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter event title"
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
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 transition ${
                    !form.description.trim() ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Update event description"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {form.description.length}/500 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Status *
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
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
                className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
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

          {/* Poll Info (Read-only) */}
          {event.poll && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">🗳️</span>
                Current Poll (Read-only)
              </h3>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 mb-2">
                  <span className="font-medium">Question:</span> "{event.poll.question}"
                </p>
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Options:</span> {event.poll.options?.map(opt => opt.text).join(', ')}
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  <span className="font-medium">Status:</span> {event.poll.isActive ? 'Active' : 'Closed'}
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  💡 Poll details cannot be changed after creation. Use the poll management controls on the event page.
                </p>
              </div>
            </div>
          )}

          {/* Form Validation Summary */}
          {!isFormValid() && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-red-800 font-medium mb-2">Please complete the following:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {!form.title.trim() && <li>• Event title is required</li>}
                {!form.description.trim() && <li>• Event description is required</li>}
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
                  ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Updating Event...
                </span>
              ) : (
                '💾 Update Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
