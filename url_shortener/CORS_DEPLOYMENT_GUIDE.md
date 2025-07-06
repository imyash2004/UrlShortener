# CORS Configuration Deployment Guide

This guide explains how to configure CORS settings for different deployment environments without changing the code.

## Overview

The application now supports environment-specific CORS configuration through properties files. This eliminates the need to modify code during deployment.

## Configuration Files

### 1. Development (Default)

- **File**: `src/main/resources/application.properties`
- **Usage**: Default configuration for local development
- **CORS Origins**: `http://localhost:4200`, `http://localhost:3000`, `http://localhost:5173`

### 2. Staging

- **File**: `src/main/resources/application-staging.properties`
- **Usage**: For staging/testing environments
- **CORS Origins**: `https://staging.your-domain.com`, `http://localhost:4200`, `http://localhost:3000`

### 3. Production

- **File**: `src/main/resources/application-prod.properties`
- **Usage**: For production deployment
- **CORS Origins**: `https://your-production-domain.com`, `https://www.your-production-domain.com`

## Deployment Instructions

### For Staging Deployment

```bash
# Set the active profile to staging
export SPRING_PROFILES_ACTIVE=staging

# Set environment variables for database
export DB_USERNAME=your_staging_username
export DB_PASSWORD=your_staging_password

# Run the application
java -jar url-shortener.jar
```

### For Production Deployment

```bash
# Set the active profile to production
export SPRING_PROFILES_ACTIVE=prod

# Set environment variables for database
export DB_USERNAME=your_production_username
export DB_PASSWORD=your_production_password

# Run the application
java -jar url-shortener.jar
```

### Using Docker

```bash
# For staging
docker run -e SPRING_PROFILES_ACTIVE=staging \
           -e DB_USERNAME=your_staging_username \
           -e DB_PASSWORD=your_staging_password \
           your-app-image

# For production
docker run -e SPRING_PROFILES_ACTIVE=prod \
           -e DB_USERNAME=your_production_username \
           -e DB_PASSWORD=your_production_password \
           your-app-image
```

## Customizing CORS Settings

### Adding New Origins

To add new allowed origins, modify the `cors.allowed-origins` property in the appropriate properties file:

```properties
# For production
cors.allowed-origins=https://your-production-domain.com,https://www.your-production-domain.com,https://new-domain.com

# For staging
cors.allowed-origins=https://staging.your-domain.com,http://localhost:4200,http://localhost:3000,https://new-staging-domain.com
```

### Other CORS Settings

You can also customize other CORS settings:

```properties
# Allowed HTTP methods
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS

# Allowed headers
cors.allowed-headers=*

# Whether to allow credentials
cors.allow-credentials=true

# Exposed headers
cors.exposed-headers=Authorization

# Max age for preflight requests
cors.max-age=3600
```

## Environment Variables

The following environment variables can be used to override database settings:

- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `PORT`: Server port (default: 8080)

## Benefits

1. **No Code Changes**: CORS settings are now externalized to properties files
2. **Environment-Specific**: Different settings for development, staging, and production
3. **Easy Deployment**: Simply change the active profile and environment variables
4. **Security**: Production settings are more restrictive
5. **Flexibility**: Easy to add new origins or modify settings

## Troubleshooting

### CORS Errors

If you encounter CORS errors:

1. Check that the frontend origin is included in `cors.allowed-origins`
2. Verify the active profile is set correctly
3. Ensure the properties file is being loaded

### Configuration Not Loading

If configuration is not loading:

1. Verify `SPRING_PROFILES_ACTIVE` is set correctly
2. Check that the properties file exists in `src/main/resources/`
3. Ensure the application is restarted after changing profiles
