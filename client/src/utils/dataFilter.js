/**
 * Utility functions for filtering and cleaning job data
 */

// Patterns to identify non-job related entries
const NOISE_PATTERNS = [
  /joined group by link from Group/i,
  /left the group/i,
  /removed .+ from/i,
  /invited .+/i,
  /converted a basic group/i,
  /changed group/i,
  /pinned a message/i,
  /unpinned a message/i,
  /changed the group photo/i,
  /deleted a message/i,
  /forwarded .+ messages/i,
  /^[0-9]+\s+(January|February|March|April|May|June|July|August|September|October|November|December)/i, // Date lines
  /^Photo$/i,
  /^Video$/i,
  /^Document$/i,
  /^Not included, change data exporting settings/i,
  /^In reply to/i,
  /^\d+:\d+$/i, // Time stamps only
  /^~+$/i, // Tilde lines
  /^Read all steps/i,
  /^Hello Everyone/i,
  /^Warning ⚠️/i,
  /^Don't waste your precious time/i,
  /^Most students are telling us/i,
  /^if you have not received any call/i,
  /^we can not do anything/i,
  /^No useless msg/i,
  /^Send msg Format/i,
  /^Everyone do it asap/i,
];

// Patterns that indicate a legitimate job posting
const JOB_INDICATORS = [
  /company/i,
  /role/i,
  /position/i,
  /hiring/i,
  /job/i,
  /intern/i,
  /developer/i,
  /engineer/i,
  /analyst/i,
  /salary/i,
  /ctc/i,
  /stipend/i,
  /location/i,
  /apply/i,
  /resume/i,
  /experience/i,
  /fresher/i,
  /batch/i,
  /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i, // Email addresses
  /https?:\/\/[^\s]+/i, // URLs
];

/**
 * Checks if a row contains meaningful job-related content
 * @param {Object} job - Job object with all fields
 * @returns {boolean} - True if this appears to be a job posting
 */
export const isValidJobPosting = (job) => {
  // If email is present, it's likely a job posting
  if (job.email && job.email.includes('@')) {
    return true;
  }

  // If there's a proper company name
  if (job.company && job.company.length > 2) {
    return true;
  }

  // If there's a job title
  if (job.job_title && job.job_title.length > 3) {
    return true;
  }

  // If there's a link (application link)
  if (job.link && (job.link.startsWith('http') || job.link.includes('forms.google'))) {
    return true;
  }

  // Check job description for job-related content
  const description = job.job_description || '';
  
  // Skip if it matches noise patterns
  for (const pattern of NOISE_PATTERNS) {
    if (pattern.test(description)) {
      return false;
    }
  }

  // Check if description contains job indicators
  let jobIndicatorCount = 0;
  for (const pattern of JOB_INDICATORS) {
    if (pattern.test(description)) {
      jobIndicatorCount++;
    }
  }

  // If multiple job indicators are present, it's likely a job posting
  if (jobIndicatorCount >= 2) {
    return true;
  }

  // Check if description has substantial content (not just short messages)
  if (description.length > 50 && jobIndicatorCount >= 1) {
    return true;
  }

  return false;
};

/**
 * Filters job data to remove non-job related entries
 * @param {Array} jobs - Array of job objects
 * @returns {Array} - Filtered array containing only job postings
 */
export const filterJobPostings = (jobs) => {
  if (!Array.isArray(jobs)) {
    return [];
  }

  return jobs.filter(isValidJobPosting);
};

/**
 * Cleans up job description by removing common noise
 * @param {string} description - Raw job description
 * @returns {string} - Cleaned description
 */
export const cleanJobDescription = (description) => {
  if (!description) return '';

  let cleaned = description;

  // Remove timestamp patterns like "CO14:20Crack Off Campus"
  cleaned = cleaned.replace(/^CO\d{2}:\d{2}[^A-Z]*Crack Off Campus/i, '');
  
  // Remove repeated company name at the beginning
  cleaned = cleaned.replace(/^Company:\s*([^:]+)\s*Company:\s*\1/i, 'Company: $1');
  
  // Remove "Send resume on mention email" duplications
  cleaned = cleaned.replace(/Send resume on mention email[^,]*,([^,]*Send resume on mention email[^,]*)/i, '$1');
  
  // Clean up extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
};

/**
 * Gets statistics about the filtered data
 * @param {Array} originalJobs - Original job array
 * @param {Array} filteredJobs - Filtered job array
 * @returns {Object} - Statistics object
 */
export const getJobStatistics = (originalJobs, filteredJobs) => {
  const totalRows = originalJobs?.length || 0;
  const jobRows = filteredJobs?.length || 0;
  const filteredOut = totalRows - jobRows;
  const filterPercentage = totalRows > 0 ? ((filteredOut / totalRows) * 100).toFixed(1) : 0;

  return {
    totalRows,
    jobRows,
    filteredOut,
    filterPercentage,
  };
};