import React, { useState, useEffect } from 'react';
import { useEvents } from '../context/EventContext';

const PollComponent = ({ event, userRole, onUpdate }) => {
  const [pollData, setPollData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [voting, setVoting] = useState(false);
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [userVotedOption, setUserVotedOption] = useState(null);
  const { voteOnPoll, getPollResults, closePoll } = useEvents();

  const isCreator = userRole === 'creator';

  useEffect(() => {
    if (event?.poll) {
      loadPollResults();
    }
  }, [event?._id]);

  const loadPollResults = async () => {
    setLoading(true);
    const result = await getPollResults(event._id);
    
    if (result.success) {
      setPollData(result.data.results);
      
      // Check if user has already voted
      const votedOptions = result.data.results.userVotes?.filter(vote => vote.hasVoted);
      if (votedOptions && votedOptions.length > 0) {
        setUserHasVoted(true);
        setUserVotedOption(votedOptions[0].optionIndex);
      } else {
        setUserHasVoted(false);
        setUserVotedOption(null);
      }
    }
    
    setLoading(false);
  };

  const handleVote = async (optionIndex) => {
    if (voting || !pollData?.isActive || (userHasVoted && !pollData.allowMultiple)) {
      if (userHasVoted && !pollData.allowMultiple) {
        alert('You have already voted! Only one vote per person is allowed.');
      }
      return;
    }

    setVoting(true);
    const result = await voteOnPoll(event._id, optionIndex);
    
    if (result.success) {
      // Refresh poll results
      await loadPollResults();
      if (onUpdate) onUpdate();
    } else {
      alert(result.message || 'Failed to submit vote');
    }
    
    setVoting(false);
  };

  const handleClosePoll = async () => {
    if (window.confirm('Are you sure you want to close this poll? This action cannot be undone.')) {
      const result = await closePoll(event._id);
      
      if (result.success) {
        alert('Poll closed successfully!');
        await loadPollResults();
        if (onUpdate) onUpdate();
      } else {
        alert(result.message || 'Failed to close poll');
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event?.poll || !pollData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">No poll available for this event</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Poll Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-2xl">🗳️</span>
            {pollData.question}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {pollData.totalVotes} total votes
            </span>
            {!pollData.isActive && (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                Closed
              </span>
            )}
          </div>
        </div>

        {/* Vote Status Message */}
        {userHasVoted && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span>
                <strong>You have voted!</strong> 
                {!pollData.allowMultiple && ' Only one vote per person is allowed.'}
                {pollData.isActive && pollData.allowMultiple && ' You can select additional options if needed.'}
              </span>
            </p>
          </div>
        )}

        {/* Poll Instructions */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Instructions:</span> 
            {pollData.isActive ? (
              <>
                {pollData.allowMultiple 
                  ? ' Select one or more options below.' 
                  : ' Select one option below. You can only vote once.'
                }
              </>
            ) : (
              ' This poll has been closed. Final results are shown below.'
            )}
          </p>
        </div>
      </div>

      {/* Voting Section */}
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cast Your Vote</h3>
        <div className="space-y-3">
          {pollData.options.map((option, index) => {
            const isUserVote = userVotedOption === index;
            const isDisabled = !pollData.isActive || voting || (userHasVoted && !pollData.allowMultiple);
            
            return (
              <button
                key={index}
                onClick={() => handleVote(index)}
                disabled={isDisabled}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  isUserVote 
                    ? 'border-green-500 bg-green-50 shadow-md' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                } ${
                  isDisabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isUserVote 
                        ? 'border-green-500 bg-green-500 text-white' 
                        : 'border-gray-300'
                    }`}>
                      {isUserVote && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">{option.text}</span>
                    {isUserVote && (
                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                        Your Vote
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">Click to vote</span>
                </div>
                
                {/* Loading Overlay */}
                {voting && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Poll result section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">📊 Live Results</h3>
          <button
            onClick={loadPollResults}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>

        <div className="space-y-4">
          {pollData.options.map((option, index) => {
            const percentage = option.percentage || 0;
            const isUserVote = userVotedOption === index;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">{option.text}</h4>
                    {isUserVote && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        ✓ Your Vote
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">{percentage}%</span>
                    <span className="text-sm text-gray-500 ml-2">({option.voteCount} votes)</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      isUserVote ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                {/* Voters List (if not too many) */}
                {option.voters && option.voters.length > 0 && option.voters.length <= 8 && (
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Voted by:</span> {option.voters.join(', ')}
                  </div>
                )}
                
                {option.voters && option.voters.length > 8 && (
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Voted by:</span> {option.voters.slice(0, 5).join(', ')} 
                    <span className="italic"> and {option.voters.length - 5} others</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Results Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <span className="text-lg">📈</span>
              Total Responses: <strong>{pollData.totalVotes}</strong>
            </span>
            
            <span className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              Poll Status: 
              <span className={`ml-1 font-medium ${pollData.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {pollData.isActive ? 'Active' : 'Closed'}
              </span>
            </span>
          </div>
          
          {pollData.allowMultiple && (
            <div className="mt-2 text-xs text-purple-600">
              Multiple selections allowed
            </div>
          )}
        </div>

        {/* Creator Controls */}
        {isCreator && pollData.isActive && (
          <div className="mt-4 pt-4 border-t">
            <button
              onClick={handleClosePoll}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
            >
              <span>🔒</span>
              Close Poll
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollComponent;
