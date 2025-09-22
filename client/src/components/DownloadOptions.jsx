import { useState, useEffect } from 'react';
import apiService from '../services/api';

const DownloadOptions = ({ jobs, onDownload, disabled = false }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeDownload, setActiveDownload] = useState(null);
  const [contactAnalysis, setContactAnalysis] = useState(null);

  // Analyze contacts when jobs change
  useEffect(() => {
    const analyzeContacts = async () => {
      if (jobs.length > 0) {
        try {
          const analysis = await apiService.analyzeContacts();
          setContactAnalysis(analysis);
        } catch (error) {
          console.error('Failed to analyze contacts:', error);
          setContactAnalysis(null);
        }
      }
    };

    analyzeContacts();
  }, [jobs]);

  const handleDownload = async (type) => {
    if (disabled || isDownloading) return;
    
    setIsDownloading(true);
    setActiveDownload(type);
    
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      
      switch (type) {
        case 'csv': {
          await onDownload();
          break;
        }
          
        case 'excel': {
          await apiService.downloadExcelFile(`telegram_jobs_${timestamp}.xlsx`);
          break;
        }
          
        case 'contacts': {
          await apiService.downloadContactsFile(`telegram_contacts_${timestamp}.xlsx`);
          break;
        }
          
        default: {
          console.error('Unknown download type:', type);
        }
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
      setActiveDownload(null);
    }
  };

  const hasContacts = contactAnalysis && contactAnalysis.total_contacts_found > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Download Options
        </h3>
        <p className="text-sm text-gray-600">
          Choose your preferred export format
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* CSV Download */}
        <div className="text-center">
          <button
            onClick={() => handleDownload('csv')}
            disabled={disabled || isDownloading}
            className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
              disabled || isDownloading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isDownloading && activeDownload === 'csv' ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Downloading...
              </div>
            ) : (
              <>
                <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download CSV
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Standard CSV format<br/>
            Compatible with all spreadsheet apps
          </p>
        </div>

        {/* Excel Download */}
        <div className="text-center">
          <button
            onClick={() => handleDownload('excel')}
            disabled={disabled || isDownloading}
            className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
              disabled || isDownloading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isDownloading && activeDownload === 'excel' ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Downloading...
              </div>
            ) : (
              <>
                <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Excel
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Enhanced format with extracted emails<br/>
            Perfect for Excel and Google Sheets
          </p>
        </div>

        {/* Contacts Download */}
        <div className="text-center">
          <button
            onClick={() => handleDownload('contacts')}
            disabled={disabled || isDownloading || !hasContacts}
            className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
              disabled || isDownloading || !hasContacts
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isDownloading && activeDownload === 'contacts' ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Downloading...
              </div>
            ) : (
              <>
                <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Contacts Only
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            {hasContacts ? (
              <>
                Emails & names only<br/>
                {contactAnalysis.total_contacts_found} contact{contactAnalysis.total_contacts_found !== 1 ? 's' : ''} found
              </>
            ) : (
              <>
                No contacts found<br/>
                No emails or names detected
              </>
            )}
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{jobs.length}</div>
            <div className="text-xs text-gray-500">Total Jobs</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {contactAnalysis ? contactAnalysis.total_contacts_found : '...'}
            </div>
            <div className="text-xs text-gray-500">Contacts Found</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {contactAnalysis ? contactAnalysis.total_emails : '...'}
            </div>
            <div className="text-xs text-gray-500">Emails</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {contactAnalysis ? contactAnalysis.total_names : '...'}
            </div>
            <div className="text-xs text-gray-500">Names</div>
          </div>
        </div>
        
        {contactAnalysis && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Contact extraction rate: <span className="font-semibold text-green-600">
                {contactAnalysis.contact_extraction_rate}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadOptions;