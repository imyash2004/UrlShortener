# URL Shortener API

A simple URL shortening service built with Spring Boot.

## Features

- Create short URLs with custom codes
- Organization management
- User authentication
- URL redirection

## Tech Stack

- Spring Boot 3.x
- PostgreSQL
- Spring Security
- Java 17+

## Setup

### 1. Database Setup
```sql
CREATE DATABASE url_shortener_db;
CREATE USER postgres WITH PASSWORD 'postgres';
```

### 2. Configuration
Update `application.properties`:

```properties
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/url_shortener_db
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
```

### 3. Run Application
```bash
mvn spring-boot:run
```

## API Endpoints

### Organizations
- `POST /api/organizations` - Create organization
- `GET /api/organizations` - Get user organizations
- `GET /api/organizations/{id}` - Get organization by ID

### URLs
- `POST /api/urls` - Create short URL
- `GET /api/urls/my-urls` - Get user URLs
- `GET /s/{shortCode}` - Redirect to original URL

### Authentication
All endpoints require authentication headers:
```
Authorization: Bearer <token>
Content-Type: application/json
```

## Usage Example

```bash
# Create organization
curl -X POST http://localhost:8080/api/organizations \
  -H "Content-Type: application/json" \
  -d '{"name": "My Org", "description": "Test org"}'

# Create short URL
curl -X POST http://localhost:8080/api/urls \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://example.com", "organizationId": 1}'
```