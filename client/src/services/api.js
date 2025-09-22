// API base URL - update this to match your backend
const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

    /**
   * Upload HTML file and get parsed job data
   * @param {File} file - The HTML file to upload
   * @returns {Promise<Array>} - Array of parsed job postings
   */
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${this.baseURL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload and process file. Please check your backend connection.');
    }
  }

  /**
   * Download CSV file of parsed job data
   * @returns {Promise<Blob>} - CSV file as blob
   */
  async downloadCSV() {
    try {
      const response = await fetch(`${this.baseURL}/api/download`, {
        method: 'GET',
        headers: {
          'Accept': 'text/csv',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error downloading CSV:', error);
      throw new Error('Failed to download CSV file. Please try again.');
    }
  }

  /**
   * Download CSV file and trigger browser download
   * @param {string} filename - Name for the downloaded file
   */
  async downloadCSVFile(filename = 'job_postings.csv') {
    try {
      const blob = await this.downloadCSV();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CSV file:', error);
      throw error;
    }
  }

  /**
   * Download Excel file with enhanced job data
   * @returns {Promise<Blob>} - Excel file as blob
   */
  async downloadExcel() {
    try {
      const response = await fetch(`${this.baseURL}/api/download/excel`, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error downloading Excel:', error);
      throw new Error('Failed to download Excel file. Please try again.');
    }
  }

  /**
   * Download Excel file and trigger browser download
   * @param {string} filename - Name for the downloaded file
   */
  async downloadExcelFile(filename = 'telegram_jobs.xlsx') {
    try {
      const blob = await this.downloadExcel();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading Excel file:', error);
      throw error;
    }
  }

  /**
   * Download contacts-only Excel file
   * @returns {Promise<Blob>} - Contacts Excel file as blob
   */
  async downloadContacts() {
    try {
      const response = await fetch(`${this.baseURL}/api/download/contacts`, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error downloading contacts:', error);
      throw new Error('Failed to download contacts file. Please try again.');
    }
  }

  /**
   * Download contacts Excel file and trigger browser download
   * @param {string} filename - Name for the downloaded file
   */
  async downloadContactsFile(filename = 'telegram_contacts.xlsx') {
    try {
      const blob = await this.downloadContacts();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading contacts file:', error);
      throw error;
    }
  }

  /**
   * Analyze contact information in current job data
   * @returns {Promise<Object>} - Contact analysis data
   */
  async analyzeContacts() {
    try {
      const response = await fetch(`${this.baseURL}/api/analyze/contacts`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error analyzing contacts:', error);
      throw new Error('Failed to analyze contact information. Please try again.');
    }
  }

  /**
   * Check if backend is available
   * @returns {Promise<boolean>} - True if backend is available
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseURL}/`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }
}

// Create a singleton instance
const apiService = new ApiService();

export default apiService;