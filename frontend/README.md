# 🔗 Otomatiks URL Shortener Frontend

A modern, responsive React frontend for the Otomatiks URL Shortener platform. This application provides a beautiful, user-friendly interface for managing organizations, creating and managing short URLs, and viewing analytics with a glassmorphism design.

## ✨ Features

### 🔐 Authentication & Security

- **JWT Authentication**: Secure login and signup with token-based authentication
- **Protected Routes**: Automatic redirection to login for unauthenticated users
- **Session Management**: Persistent login state with localStorage
- **Role-based Access**: Organization-based permissions and access control

### 🏢 Organization Management

- **Create Organizations**: Set up new organizations with custom names and descriptions
- **Organization Dashboard**: View and manage all your organizations
- **Multi-tenant Support**: Separate URL management per organization
- **Organization Details**: Detailed view with member and URL statistics

### 🔗 URL Management

- **Create Short URLs**: Custom short codes, titles, descriptions, and expiration dates
- **URL Dashboard**: Comprehensive view of all your shortened URLs
- **Real-time Operations**: Instant create, edit, and delete operations
- **Pagination**: Efficient browsing of large URL collections
- **Copy to Clipboard**: One-click copying of URLs
- **Click Analytics**: Track URL performance and engagement

### 🎨 User Interface

- **Glassmorphism Design**: Modern, translucent UI with blur effects
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Dark Theme**: Eye-friendly dark color scheme
- **Loading States**: Visual feedback for all operations
- **Error Handling**: User-friendly error messages and notifications
- **Smooth Animations**: Hover effects and transitions

### 📊 Analytics & Insights

- **URL Statistics**: Click counts and creation dates
- **Organization Stats**: Member counts and URL totals
- **Performance Metrics**: Real-time dashboard with key metrics

## 🛠️ Tech Stack

- **React 18**: Modern React with hooks and functional components
- **React Router 6**: Client-side routing with protected routes
- **Axios**: HTTP client for API communication
- **Styled Components**: CSS-in-JS for component styling
- **Context API**: Global state management for authentication
- **Local Storage**: Persistent session management

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn
- Backend API running (see backend README)

### 1. Clone and Navigate

```bash
# From the project root
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `frontend/` directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8080/api

# Optional: Custom base URL for development
REACT_APP_BASE_URL=http://localhost:3000
```

### 4. Start Development Server

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets and HTML template
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── CreateOrganizationModal.js
│   │   ├── CreateUrlModal.js
│   │   └── ProtectedRoute.js
│   ├── config/            # Configuration files
│   │   └── config.js
│   ├── context/           # React context providers
│   │   └── AuthContext.js
│   ├── pages/             # Main application pages
│   │   ├── DashboardPage.js
│   │   ├── LoginPage.js
│   │   ├── MyUrlsPage.js
│   │   ├── OrganizationsPage.js
│   │   └── ...
│   ├── services/          # API service modules
│   │   ├── authService.js
│   │   ├── organizationService.js
│   │   └── urlService.js
│   ├── App.js             # Main application component
│   └── index.js           # Application entry point
├── package.json           # Dependencies and scripts
└── README.md             # This documentation
```

## 🔐 Authentication Flow

### Login Process

1. User enters email and password
2. Frontend sends credentials to `/api/auth/signin`
3. Backend validates and returns JWT token
4. Token stored in localStorage
5. User redirected to dashboard

### Protected Routes

- All dashboard routes require authentication
- Unauthenticated users redirected to login
- Token automatically included in API requests
- Session persists across browser restarts

### Logout

- Clears localStorage token
- Redirects to login page
- Invalidates current session

## 🌐 API Integration

### Base Configuration

```javascript
// config/config.js
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080/api";
```

### Authentication Headers

```javascript
// services/authHeader.js
const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
```

### Error Handling

- Network errors show user-friendly messages
- 401 responses trigger automatic logout
- Validation errors displayed inline
- Loading states for all async operations

## 🎨 UI Components

### Dashboard

- **Glassmorphism Cards**: Translucent cards with blur effects
- **Statistics Grid**: Key metrics display
- **Quick Actions**: Create organization and URL buttons
- **Navigation**: Seamless page transitions

### URL Management

- **URL Cards**: Individual URL display with actions
- **Pagination**: Efficient browsing of large collections
- **Search & Filter**: Find specific URLs quickly
- **Bulk Operations**: Select multiple URLs for actions

### Modals

- **Create URL Modal**: Comprehensive URL creation form
- **Create Organization Modal**: Organization setup
- **Edit URL Modal**: In-place URL editing
- **Confirmation Dialogs**: Safe delete operations

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App
npm run eject
```

### Environment Variables

| Variable             | Description          | Default                     |
| -------------------- | -------------------- | --------------------------- |
| `REACT_APP_API_URL`  | Backend API base URL | `http://localhost:8080/api` |
| `REACT_APP_BASE_URL` | Frontend base URL    | `http://localhost:3000`     |

### Development Tips

1. **Hot Reload**: Changes reflect immediately in development
2. **Console Logging**: Detailed error messages in browser console
3. **Network Tab**: Monitor API requests and responses
4. **React DevTools**: Debug component state and props

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Organization creation and management
- [ ] URL creation with custom codes
- [ ] URL editing and deletion
- [ ] Pagination and navigation
- [ ] Responsive design on mobile
- [ ] Error handling and validation
- [ ] Session persistence

### Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Environment Setup

```env
# Production environment
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_BASE_URL=https://your-frontend-domain.com
```

### Deployment Options

- **Netlify**: Drag and drop `build/` folder
- **Vercel**: Connect GitHub repository
- **AWS S3**: Upload static files
- **Nginx**: Serve static files

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**

```
Access to fetch at 'http://localhost:8080/api' from origin 'http://localhost:3000' has been blocked
```

_Solution_: Ensure backend CORS configuration allows frontend origin

**Authentication Errors**

```
401 Unauthorized
```

_Solution_: Check JWT token validity and localStorage

**API Connection Issues**

```
Network Error
```

_Solution_: Verify backend is running and API URL is correct

### Debug Mode

Enable detailed logging:

```javascript
// In browser console
localStorage.setItem("debug", "true");
```

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and test thoroughly
4. Commit changes: `git commit -am 'Add new feature'`
5. Push to branch: `git push origin feature/new-feature`
6. Submit pull request

### Code Style

- Use functional components with hooks
- Follow React best practices
- Maintain consistent naming conventions
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions, issues, or feature requests:

- **GitHub Issues**: [Create an issue](https://github.com/your-repo/issues)
- **Email**: support@otomatiks.com
- **Documentation**: [API Documentation](./API.md)

---

**Built with ❤️ by the Otomatiks Team**
