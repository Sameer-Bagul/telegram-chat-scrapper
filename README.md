# Telegram Job Scraper

A comprehensive web application for extracting and organizing job postings from Telegram HTML exports. This tool processes Telegram chat exports to identify, filter, and extract meaningful job-related content while automatically removing irrelevant messages and system notifications.

## Features

### Core Functionality
- **HTML Export Processing**: Parse Telegram HTML chat exports to extract job postings
- **Smart Filtering**: Intelligent algorithms to distinguish job postings from general chat messages
- **Data Extraction**: Automatic extraction of company names, job roles, and location information
- **CSV Export**: Clean, structured data export for further analysis
- **Real-time Processing**: Instant feedback during file upload and processing

### User Interface
- **Drag & Drop Upload**: Intuitive file upload interface
- **Filter Controls**: Toggle between filtered and raw data views
- **Statistics Display**: Real-time metrics showing filtering effectiveness
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern UI**: Clean, professional interface built with Tailwind CSS

### Data Quality
- **Noise Removal**: Automatically filters out group join notifications, system messages, and irrelevant content
- **Content Validation**: Identifies legitimate job postings using multiple validation criteria
- **Data Sanitization**: Cleans and standardizes extracted information
- **Export Options**: Choose between filtered job data or complete raw extracts

## Technology Stack

### Frontend
- **React 19**: Modern React framework with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **JavaScript ES6+**: Modern JavaScript features and syntax

### Backend
- **Python 3.8+**: Core programming language
- **FastAPI**: High-performance web framework for APIs
- **BeautifulSoup4**: HTML parsing and data extraction
- **Pandas**: Data manipulation and CSV export functionality
- **Uvicorn**: ASGI server for FastAPI applications

## Installation

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Git

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python -m uvicorn app.main:app --reload
```

### Frontend Setup
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

## Usage

### Basic Workflow
1. **Export Telegram Chat**: Export your Telegram job channel/group as HTML
2. **Upload File**: Use the web interface to upload the HTML file
3. **Review Results**: Browse extracted job postings with smart filtering applied
4. **Toggle Filtering**: Switch between filtered and raw data views as needed
5. **Export Data**: Download processed job data as CSV for further use

### Filtering System
The application employs sophisticated filtering algorithms to identify and remove:
- Group join/leave notifications
- System messages and metadata
- Non-job related conversations
- Duplicate or irrelevant entries
- Bot commands and automated messages

### Data Extraction
For each identified job posting, the system attempts to extract:
- **Company Name**: Employer or recruiting organization
- **Job Title/Role**: Position being offered
- **Location**: Work location or remote indicators
- **Job Description**: Full posting content
- **Contact Information**: Relevant contact details when available

## API Documentation

### Endpoints

#### POST /api/upload
Upload and process Telegram HTML export file.

**Request**: Multipart form data with HTML file
**Response**: JSON array of extracted job postings
```json
[
  {
    "company": "Tech Corp",
    "role": "Software Engineer",
    "location": "Remote",
    "description": "Full job posting content...",
    "timestamp": "2024-01-15T10:30:00Z"
  }
]
```

#### GET /api/download/{filename}
Download processed job data as CSV file.

**Parameters**: 
- `filename`: Name of the CSV file to download

**Response**: CSV file download

#### GET /api/health
Health check endpoint for backend status.

**Response**: JSON status object

## Configuration

### Environment Variables
Create a `.env` file in the backend directory:
```
# Backend Configuration
HOST=localhost
PORT=8000
DEBUG=true

# CORS Settings
CORS_ORIGINS=http://localhost:5173
```

### Filtering Configuration
Customize filtering behavior by modifying `client/src/utils/dataFilter.js`:
- Add new noise patterns
- Adjust job validation criteria
- Customize company/role extraction logic

## Development

### Project Structure
```
telegram-chat-scrapper/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── controllers/         # API route handlers
│   │   ├── services/            # Business logic
│   │   ├── models/              # Data models
│   │   └── views/               # API routes
│   └── requirements.txt
├── client/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── services/            # API services
│   │   ├── utils/               # Utility functions
│   │   └── App.jsx              # Main application
│   ├── package.json
│   └── vite.config.js
└── README.md
```

### Code Quality
- **ESLint**: JavaScript linting and code style enforcement
- **Prettier**: Code formatting (if configured)
- **Type Safety**: PropTypes validation for React components
- **Error Handling**: Comprehensive error handling throughout the application

### Testing
```bash
# Run frontend tests
cd client
npm test

# Run backend tests
cd backend
python -m pytest
```

## Deployment

### Production Build
```bash
# Build frontend
cd client
npm run build

# The built files will be in client/dist/
```

### Docker Deployment (Optional)
```bash
# Build and run with Docker
docker-compose up --build
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add tests for new functionality
- Update documentation for API changes
- Ensure all tests pass before submitting PRs

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

For questions, issues, or feature requests:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include relevant error messages and system information

## Changelog

### Version 1.0.0
- Initial release with core functionality
- Smart filtering system implementation
- Modern React frontend with Tailwind CSS
- FastAPI backend with comprehensive data processing
- CSV export functionality
- Real-time filtering statistics

---

**Note**: This application is designed for processing legitimate job-related content from Telegram channels. Ensure you have appropriate permissions to export and process chat data according to Telegram's terms of service and applicable privacy regulations.