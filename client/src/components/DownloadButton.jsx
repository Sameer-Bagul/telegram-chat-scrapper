import { useState } from 'react';

const DownloadButton = ({ jobs, onDownload, disabled }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!jobs || jobs.length === 0) {
      alert('No job data to download');
      return;
    }

    setIsDownloading(true);
    
    try {
      await onDownload();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const canDownload = jobs && jobs.length > 0 && !disabled && !isDownloading;

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={handleDownload}
        disabled={!canDownload}
        className={`inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform ${
          canDownload
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 hover:scale-105 shadow-lg hover:shadow-xl'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isDownloading ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
            Preparing Download...
          </>
        ) : (
          <>
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download CSV
          </>
        )}
      </button>
      
      {jobs && jobs.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Ready to download {jobs.length} job posting{jobs.length !== 1 ? 's' : ''} as CSV
          </p>
          <div className="flex items-center justify-center mt-2 space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              CSV Format
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
              Excel Compatible
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
              All Fields Included
            </div>
          </div>
        </div>
      )}
      
      {(!jobs || jobs.length === 0) && (
        <p className="text-sm text-gray-500 text-center">
          Upload and process a file first to enable download
        </p>
      )}
    </div>
  );
};

export default DownloadButton;