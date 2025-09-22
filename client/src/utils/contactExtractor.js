// Utility functions for extracting contact information from job data

// Email patterns to match various email formats
const EMAIL_PATTERNS = [
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  /\b[A-Za-z0-9._%+-]+\s*@\s*[A-Za-z0-9.-]+\s*\.\s*[A-Z|a-z]{2,}\b/g,
  /\b[A-Za-z0-9._%+-]+\(at\)[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  /\b[A-Za-z0-9._%+-]+\s*\(at\)\s*[A-Za-z0-9.-]+\s*\.\s*[A-Z|a-z]{2,}\b/g
];

// Name patterns to identify contact names
const NAME_PATTERNS = [
  /(?:contact|reach out|email|send cv|apply to|hr|recruiter|hiring manager)[\s:]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/gi,
  /(?:contact person|contact|coordinator|manager)[\s:]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
  /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)(?:\s*-\s*(?:hr|recruiter|hiring|manager|coordinator))/gi,
  /(?:for more details|contact|reach)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi
];

/**
 * Extract email addresses from text
 * @param {string} text - Text to search for emails
 * @returns {Array<string>} - Array of unique email addresses
 */
export const extractEmails = (text) => {
  if (!text || typeof text !== 'string') return [];
  
  const emails = new Set();
  
  EMAIL_PATTERNS.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(email => {
        // Clean up the email (remove extra spaces, convert (at) to @)
        const cleanEmail = email
          .replace(/\s+/g, '')
          .replace(/\(at\)/g, '@')
          .toLowerCase();
        
        // Basic validation
        if (cleanEmail.includes('@') && cleanEmail.includes('.')) {
          emails.add(cleanEmail);
        }
      });
    }
  });
  
  return Array.from(emails);
};

/**
 * Extract contact names from text
 * @param {string} text - Text to search for names
 * @returns {Array<string>} - Array of unique contact names
 */
export const extractNames = (text) => {
  if (!text || typeof text !== 'string') return [];
  
  const names = new Set();
  
  NAME_PATTERNS.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        const name = match[1].trim();
        // Filter out common false positives
        if (name.length > 2 && 
            !name.toLowerCase().includes('job') &&
            !name.toLowerCase().includes('work') &&
            !name.toLowerCase().includes('position') &&
            !name.toLowerCase().includes('role') &&
            name.split(' ').length <= 4) { // Reasonable name length
          names.add(name);
        }
      }
    }
  });
  
  return Array.from(names);
};

/**
 * Extract all contact information from job data
 * @param {Array} jobs - Array of job objects
 * @returns {Array} - Array of contact information objects
 */
export const extractContactInfo = (jobs) => {
  const contactInfo = [];
  
  jobs.forEach((job, index) => {
    const text = `${job.description || ''} ${job.company || ''} ${job.role || ''}`;
    const emails = extractEmails(text);
    const names = extractNames(text);
    
    // If we found emails or names, add them
    if (emails.length > 0 || names.length > 0) {
      emails.forEach(email => {
        contactInfo.push({
          jobIndex: index + 1,
          company: job.company || 'Unknown',
          role: job.role || 'Unknown',
          email: email,
          name: names.length > 0 ? names[0] : '', // Take first name if available
          source: 'Extracted from job posting'
        });
      });
      
      // If we have names but no emails, still add them
      if (emails.length === 0 && names.length > 0) {
        names.forEach(name => {
          contactInfo.push({
            jobIndex: index + 1,
            company: job.company || 'Unknown',
            role: job.role || 'Unknown',
            email: '',
            name: name,
            source: 'Extracted from job posting'
          });
        });
      }
    }
  });
  
  return contactInfo;
};

/**
 * Convert job data to Excel-friendly format
 * @param {Array} jobs - Array of job objects
 * @returns {Array} - Array of objects formatted for Excel export
 */
export const formatForExcel = (jobs) => {
  return jobs.map((job, index) => ({
    'S.No': index + 1,
    'Company': job.company || '',
    'Job Role': job.role || '',
    'Location': job.location || '',
    'Description': job.description || '',
    'Timestamp': job.timestamp || '',
    'Emails': extractEmails(job.description || '').join(', '),
    'Contact Names': extractNames(job.description || '').join(', ')
  }));
};

/**
 * Download data as Excel file
 * @param {Array} data - Data to export
 * @param {string} filename - Name of the file
 */
export const downloadAsExcel = (data, filename = 'telegram_jobs.xlsx') => {
  // We'll use a simple CSV format that Excel can open
  // In a real implementation, you might want to use a library like xlsx
  const csvContent = convertToCSV(data);
  downloadAsCSV(csvContent, filename.replace('.xlsx', '.csv'));
};

/**
 * Convert array of objects to CSV format
 * @param {Array} data - Array of objects
 * @returns {string} - CSV string
 */
const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header] || '';
      // Escape commas and quotes in CSV
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

/**
 * Download CSV content as file
 * @param {string} csvContent - CSV content
 * @param {string} filename - Filename
 */
const downloadAsCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};