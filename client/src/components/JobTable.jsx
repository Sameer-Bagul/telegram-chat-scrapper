import { cleanJobDescription } from '../utils/dataFilter';

const JobTable = ({ jobs }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-gray-500">
          <svg className="mx-auto w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg">No job data to display</p>
          <p className="text-sm">Upload an HTML file to see parsed job postings here</p>
        </div>
      </div>
    );
  }

  // Helper function to extract company name from job description if not in company field
  const extractCompany = (job) => {
    if (job.company && job.company.trim()) {
      return job.company.trim();
    }
    
    const description = job.job_description || '';
    const companyMatch = description.match(/Company:\s*([^:]+?)(?:Role:|$)/i);
    if (companyMatch) {
      return companyMatch[1].trim();
    }
    
    return null;
  };

  // Helper function to extract job role from description if not in job_title field
  const extractRole = (job) => {
    if (job.job_title && job.job_title.trim()) {
      return job.job_title.trim();
    }
    
    const description = job.job_description || '';
    const roleMatch = description.match(/Role:\s*([^:]+?)(?:Batch:|Location:|Company:|$)/i);
    if (roleMatch) {
      return roleMatch[1].trim();
    }
    
    return null;
  };

  // Helper function to extract location
  const extractLocation = (job) => {
    if (job.location && job.location.trim()) {
      return job.location.trim();
    }
    
    const description = job.job_description || '';
    const locationMatch = description.match(/Location:\s*([^:]+?)(?:Send|Apply|Batch:|$)/i);
    if (locationMatch) {
      return locationMatch[1].trim();
    }
    
    return null;
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <h2 className="text-2xl font-bold">Parsed Job Postings</h2>
        <p className="text-blue-100 mt-2">Found {jobs.length} job posting{jobs.length !== 1 ? 's' : ''}</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Details</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company & Location</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job, index) => {
              const company = extractCompany(job);
              const role = extractRole(job);
              const location = extractLocation(job);
              const cleanedDescription = cleanJobDescription(job.job_description || '');
              
              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200 table-row-hover">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">{job.name || 'Recruiter'}</div>
                      {job.email && (
                        <div className="flex items-center text-sm text-blue-600">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.44a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <a href={`mailto:${job.email}`} className="hover:underline truncate max-w-40">
                            {job.email}
                          </a>
                        </div>
                      )}
                      {job.phone && (
                        <div className="flex items-center text-sm text-green-600">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <a href={`tel:${job.phone}`} className="hover:underline">{job.phone}</a>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {role || 'Position Not Specified'}
                      </div>
                      {cleanedDescription && (
                        <div className="text-sm text-gray-600 max-w-xs">
                          <div className="line-clamp-3" title={cleanedDescription}>
                            {cleanedDescription.length > 150 
                              ? `${cleanedDescription.substring(0, 150)}...` 
                              : cleanedDescription
                            }
                          </div>
                        </div>
                      )}
                      {/* Show salary/CTC if mentioned */}
                      {cleanedDescription.match(/(ctc|salary|stipend):\s*[^:,]+/i) && (
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          💰 {cleanedDescription.match(/(ctc|salary|stipend):\s*[^:,]+/i)[0]}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {company && (
                        <div className="text-sm font-medium text-gray-900">{company}</div>
                      )}
                      {location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {location}
                        </div>
                      )}
                      {/* Show if remote */}
                      {location && location.toLowerCase().includes('remote') && (
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          🏠 Remote
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {job.date_of_posting && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {new Date(job.date_of_posting).toLocaleDateString()}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {job.link && (
                        <a
                          href={job.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Apply
                        </a>
                      )}
                      {job.email && (
                        <a
                          href={`mailto:${job.email}?subject=Job Application`}
                          className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.44a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Email
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobTable;