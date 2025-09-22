import { useState, useEffect } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import JobTable from './components/JobTable';
import FilterControls from './components/FilterControls';
import DownloadOptions from './components/DownloadOptions';
import apiService from './services/api';
import { filterJobPostings, getJobStatistics } from './utils/dataFilter';

function App() {
  const [originalJobs, setOriginalJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showFiltered, setShowFiltered] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Update filtered jobs when original jobs change
  useEffect(() => {
    if (originalJobs.length > 0) {
      const filtered = filterJobPostings(originalJobs);
      setFilteredJobs(filtered);
    }
  }, [originalJobs]);

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    try {
      const parsedJobs = await apiService.uploadFile(file);
      setOriginalJobs(parsedJobs);
    } catch (error) {
      console.error('Error processing file:', error);
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleFilter = (enabled) => {
    setShowFiltered(enabled);
  };

  const handleDownload = async () => {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `telegram_jobs_${timestamp}.csv`;
      await apiService.downloadCSVFile(filename);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  };

  // Get current jobs to display
  const currentJobs = showFiltered ? filteredJobs : originalJobs;
  
  // Get statistics
  const statistics = getJobStatistics(originalJobs, filteredJobs);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            📱 Telegram Job Extractor
          </h1>
          <p className="text-gray-600 mt-2">
            Extract and organize job postings from Telegram HTML exports
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Upload Your File
              </h2>
              <p className="text-gray-600">
                Upload the HTML export from your Telegram chat to extract job postings
              </p>
            </div>
            <FileUpload onFileUpload={handleFileUpload} isUploading={isUploading} />
          </section>

          {(originalJobs.length > 0 || isUploading) && (
            <FilterControls
              originalJobs={originalJobs}
              filteredJobs={filteredJobs}
              showFiltered={showFiltered}
              onToggleFilter={handleToggleFilter}
              statistics={statistics}
            />
          )}

          {currentJobs.length > 0 && (
            <section>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  {showFiltered 
                    ? `Filtered Jobs (${filteredJobs.length})` 
                    : `All Extracted Entries (${originalJobs.length})`
                  }
                </h2>
                <p className="text-gray-600">
                  {showFiltered 
                    ? `${statistics.filteredOut} non-job entries hidden`
                    : 'Showing all extracted data including non-job entries'
                  }
                </p>
              </div>
              <JobTable jobs={currentJobs} />
            </section>
          )}

          {currentJobs.length > 0 && (
            <section>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Step 3: Download Your Data
                </h2>
                <p className="text-gray-600">
                  Export your {showFiltered ? 'filtered' : 'complete'} job data in multiple formats
                </p>
              </div>
              
              <DownloadOptions 
                jobs={currentJobs} 
                onDownload={handleDownload}
                disabled={isUploading}
              />
            </section>
          )}

          {showFiltered && filteredJobs.length === 0 && originalJobs.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">No Job Postings Found</h3>
              <p className="text-orange-700 mb-4">
                The smart filter didn't find any job-related content in your file. 
                Try toggling off the smart filter to see all extracted data.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
