import { useState } from 'react';

const FilterControls = ({ 
  originalJobs, 
  filteredJobs, 
  showFiltered, 
  onToggleFilter,
  statistics 
}) => {
  const [showStats, setShowStats] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        
        {/* Filter Toggle */}
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-800">Data View Options</h3>
          
          <div className="flex items-center space-x-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showFiltered}
                onChange={(e) => onToggleFilter(e.target.checked)}
                className="sr-only"
              />
              <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                showFiltered ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-300'
              }`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  showFiltered ? 'transform translate-x-6' : ''
                }`}></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                Smart Filter (Jobs Only)
              </span>
            </label>
          </div>
        </div>

        {/* Statistics */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowStats(!showStats)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showStats ? 'Hide' : 'Show'} Statistics
          </button>
          
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-600">Showing:</span>
            <span className="font-semibold text-gray-800">
              {showFiltered ? filteredJobs.length : originalJobs.length} rows
            </span>
          </div>
        </div>
      </div>

      {/* Filter Description */}
      <div className="mt-4 text-sm text-gray-600">
        {showFiltered ? (
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Showing only job postings. Group activities and irrelevant messages are hidden.</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>Showing all extracted data including group activities and system messages.</span>
          </div>
        )}
      </div>

      {/* Detailed Statistics */}
      {showStats && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{statistics.totalRows}</div>
              <div className="text-xs text-gray-500">Total Rows</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{statistics.jobRows}</div>
              <div className="text-xs text-gray-500">Job Postings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{statistics.filteredOut}</div>
              <div className="text-xs text-gray-500">Filtered Out</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{statistics.filterPercentage}%</div>
              <div className="text-xs text-gray-500">Noise Removed</div>
            </div>
          </div>

          {/* Filter Effectiveness */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Filter Effectiveness</span>
              <span>{statistics.filterPercentage}% noise removed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${statistics.filterPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;