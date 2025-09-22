# 📱 Telegram Job Extractor - Frontend

A modern, vibrant React frontend for extracting and organizing job postings from Telegram HTML exports.

## ✨ Features

- **Drag & Drop Upload**: Intuitive file upload with visual feedback
- **Real-time Processing**: Live preview of extracted job data  
- **Responsive Design**: Works perfectly on desktop and mobile
- **Vibrant UI**: Modern gradient design with smooth animations
- **CSV Export**: Download processed data for further use
- **Backend Integration**: Seamless API communication with status indicators

## 🚀 Tech Stack

- **React 19** - Latest React with modern hooks
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Modern JavaScript** - ES6+ features and async/await

## 🎨 Design Features

### Vibrant Color Palette
- **Purple Gradients**: `from-purple-500 to-purple-600`
- **Pink Accents**: `from-pink-500 to-pink-600`  
- **Blue Highlights**: `from-blue-500 to-blue-600`
- **Green Success**: `from-green-500 to-emerald-500`

### Interactive Elements
- Drag and drop file upload with hover effects
- Animated loading spinners with custom styles
- Gradient backgrounds and hover transitions
- Responsive table with smooth row interactions

## 📁 Project Structure

```
src/
├── components/
│   ├── FileUpload.jsx      # Drag & drop file upload
│   ├── JobTable.jsx        # Data display table
│   ├── DownloadButton.jsx  # CSV export button
│   ├── LoadingSpinner.jsx  # Loading animations
│   ├── ErrorMessage.jsx    # Error handling
│   └── SuccessMessage.jsx  # Success notifications
├── services/
│   └── api.js             # Backend API integration
├── App.jsx                # Main application component
├── App.css               # Custom styles and animations
├── index.css             # Tailwind imports
└── main.jsx              # Application entry point
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend server running on `localhost:8000`

### Installation

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   ```
   http://localhost:5173
   ```

## 🔧 Configuration

### API Configuration
Update the backend URL in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🎯 Component Overview

### FileUpload Component
- Drag and drop functionality
- File type validation (HTML only)
- Visual upload states
- Progress indicators

### JobTable Component  
- Responsive data display
- Contact information with clickable links
- Job details with truncated descriptions
- Company and location information
- Posted date formatting

### DownloadButton Component
- CSV generation and download
- Download state management
- File naming with timestamps
- Progress feedback

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Friendly**: Excellent tablet experience
- **Desktop Enhanced**: Full-featured desktop layout
- **Cross Browser**: Works on all modern browsers

## 🎨 Custom Animations

- **Gradient Text Animation**: Shifting color gradients
- **Pulse Glow Effects**: For interactive elements
- **Floating Elements**: Subtle background animations
- **Hover Transitions**: Smooth state changes
- **Loading Spinners**: Custom animated loaders

## 🔗 API Integration

The frontend communicates with the backend via:

- `POST /api/upload` - File upload and processing
- `GET /api/download` - CSV file download
- `GET /` - Health check endpoint

## 🐛 Error Handling

- Network error detection
- File validation
- Backend connectivity status
- User-friendly error messages
- Retry mechanisms

## 🚀 Performance Features

- **Fast Refresh**: Instant updates during development
- **Code Splitting**: Optimized bundle sizes
- **Lazy Loading**: Components loaded on demand
- **Optimized Images**: Compressed assets
- **Modern Bundling**: Tree-shaking and minification

## 🎯 Future Enhancements

- [ ] Dark mode support
- [ ] Multiple file upload
- [ ] Data export in multiple formats
- [ ] Advanced filtering and search
- [ ] Real-time collaboration features
- [ ] Offline support with service workers

---

Built with ❤️ using React + Vite + Tailwind CSS

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
