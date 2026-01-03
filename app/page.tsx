/**
 * Mrror - A Daily Accountability App
 * 
 * This is a client-side component that asks two reflective questions:
 * 1. "What does a day in the life of the person you want to become look like?"
 * 2. "Did you lie to yourself today?" (yes/no)
 * 
 * Responses are saved in browser's localStorage with timestamps.
 */

// Mark this as a client component since we're using hooks and localStorage
'use client';

import { useState, useEffect } from 'react';

// Define the structure for a single response entry
interface Response {
  dayVision: string;           // Answer to the first question
  liedToSelf: boolean | null;  // Answer to yes/no question (null if not answered)
  timestamp: string;           // ISO timestamp of when the response was saved
}

export default function Home() {
  // State to hold the current form inputs
  const [dayVision, setDayVision] = useState('');
  const [liedToSelf, setLiedToSelf] = useState<boolean | null>(null);
  
  // State to track if we've successfully saved the response
  const [saved, setSaved] = useState(false);
  
  // State to hold the history of past responses
  const [history, setHistory] = useState<Response[]>([]);

  /**
   * Load saved responses from localStorage when component mounts
   * This runs once when the page loads
   * 
   * Note: Setting state here is intentional and safe - we're initializing state
   * from localStorage on mount, which is a common pattern for data persistence.
   */
  useEffect(() => {
    // Get the stored responses from localStorage
    const storedResponses = localStorage.getItem('mrror-responses');
    
    // If responses exist, parse them from JSON and update state
    if (storedResponses) {
      try {
        const parsed = JSON.parse(storedResponses);
        setHistory(parsed);
      } catch (error) {
        console.error('Error parsing stored responses:', error);
      }
    }
  }, []); // Empty dependency array means this runs once on mount

  /**
   * Handle form submission
   * Saves the current response to localStorage and updates the history
   */
  const handleSubmit = (e: React.FormEvent) => {
    // Prevent default form submission behavior (page reload)
    e.preventDefault();
    
    // Validate that both questions are answered
    if (!dayVision.trim() || liedToSelf === null) {
      alert('Please answer both questions before submitting.');
      return;
    }

    // Create a new response object with current timestamp
    const newResponse: Response = {
      dayVision,
      liedToSelf,
      timestamp: new Date().toISOString(), // ISO format: "2024-01-03T12:30:45.123Z"
    };

    // Add the new response to the beginning of the history array
    const updatedHistory = [newResponse, ...history];
    
    // Save the updated history to localStorage as JSON
    localStorage.setItem('mrror-responses', JSON.stringify(updatedHistory));
    
    // Update the state with the new history
    setHistory(updatedHistory);
    
    // Show success message
    setSaved(true);
    
    // Reset the form fields
    setDayVision('');
    setLiedToSelf(null);
  };

  /**
   * Hide the success message after 3 seconds
   * Uses useEffect to handle cleanup properly
   */
  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 3000);
      // Cleanup function: clear timeout if component unmounts or saved changes
      return () => clearTimeout(timer);
    }
  }, [saved]); // Re-run effect when saved state changes

  /**
   * Format a timestamp into a readable date and time string
   */
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    // Main container: dark background, full screen height, centered content
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-8 sm:px-6 lg:px-8">
      {/* Content wrapper: centered with max width for readability */}
      <div className="max-w-2xl mx-auto">
        
        {/* Header Section */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Mrror
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base">
            A simple accountability tool keeping you aligned
          </p>
        </header>

        {/* Success notification - only visible after saving */}
        {saved && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-300 text-center animate-fade-in">
            ✓ Response saved successfully
          </div>
        )}

        {/* Main Form Section */}
        <form onSubmit={handleSubmit} className="space-y-8 mb-12">
          
          {/* Question 1: Vision of future self */}
          <div className="space-y-3">
            <label 
              htmlFor="dayVision" 
              className="block text-lg sm:text-xl font-medium text-zinc-200"
            >
              What does a day in the life of the person you want to become look like?
            </label>
            <textarea
              id="dayVision"
              value={dayVision}
              onChange={(e) => setDayVision(e.target.value)}
              placeholder="Describe your ideal day..."
              className="w-full h-40 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg 
                         text-zinc-100 placeholder-zinc-600 
                         focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent
                         resize-none transition-all"
              required
            />
          </div>

          {/* Question 2: Yes/No question */}
          <div className="space-y-3">
            <label className="block text-lg sm:text-xl font-medium text-zinc-200">
              Did you lie to yourself today?
            </label>
            
            {/* Yes/No button group */}
            <div className="flex gap-4">
              {/* Yes Button */}
              <button
                type="button"
                onClick={() => setLiedToSelf(true)}
                className={`flex-1 py-4 px-6 rounded-lg font-medium transition-all
                  ${liedToSelf === true
                    ? 'bg-red-900 border-2 border-red-700 text-red-100' // Selected state
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700' // Default state
                  }`}
              >
                Yes
              </button>
              
              {/* No Button */}
              <button
                type="button"
                onClick={() => setLiedToSelf(false)}
                className={`flex-1 py-4 px-6 rounded-lg font-medium transition-all
                  ${liedToSelf === false
                    ? 'bg-green-900 border-2 border-green-700 text-green-100' // Selected state
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700' // Default state
                  }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 bg-zinc-100 text-zinc-900 rounded-lg font-semibold
                       hover:bg-zinc-200 transition-all transform hover:scale-[1.02]
                       active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-zinc-500"
          >
            Save Response
          </button>
        </form>

        {/* History Section - Shows past responses */}
        {history.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-200 mb-4">
              Past Reflections
            </h2>
            
            {/* Map through history and display each response */}
            {history.map((response, index) => (
              <div 
                key={index} 
                className="p-5 bg-zinc-900 border border-zinc-800 rounded-lg space-y-3"
              >
                {/* Timestamp */}
                <div className="text-sm text-zinc-500">
                  {formatDate(response.timestamp)}
                </div>
                
                {/* Question 1 Answer */}
                <div>
                  <div className="text-xs text-zinc-500 mb-1">
                    Vision of ideal day:
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    {response.dayVision}
                  </p>
                </div>
                
                {/* Question 2 Answer */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">
                    Lied to self:
                  </span>
                  <span 
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${response.liedToSelf 
                        ? 'bg-red-900/40 text-red-300' 
                        : 'bg-green-900/40 text-green-300'
                      }`}
                  >
                    {response.liedToSelf ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
