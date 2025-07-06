// Configuration file for environment-specific settings
const config = {
  // Backend API URL - defaults to localhost for development
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080",

  // API endpoints
  API_ENDPOINTS: {
    AUTH: "/api/auth",
    ORGANIZATIONS: "/api/organizations",
    URLS: "/api/urls",
  },

  // Environment
  ENV: process.env.NODE_ENV || "development",

  // App settings
  APP_NAME: "URL Shortener",
  APP_VERSION: "1.0.0",
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${config.API_BASE_URL}${endpoint}`;
};

// Helper function to get environment-specific config
export const getConfig = () => {
  return config;
};

export default config;
