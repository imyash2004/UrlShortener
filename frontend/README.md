# Otomatiks URL Shortener Frontend

A modern, responsive React frontend for the Otomatiks URL Shortener platform. This app allows users to manage organizations, create and manage short URLs, and view analytics, all with a beautiful dashboard UI.

## 🚀 Features

- **Authentication**: Secure login and signup with JWT
- **Dashboard**: Glassmorphism UI, stats, and quick actions
- **Organizations**: Create, view, and manage organizations
- **My URLs**: View, edit, delete, and create short URLs with pagination
- **Short URL Creation**: Custom codes, titles, descriptions, and expiration
- **Responsive Design**: Works on desktop and mobile
- **Protected Routes**: Only authenticated users can access dashboard features
- **Error Handling**: Friendly error messages for all API and auth issues

## 🖥️ Tech Stack

- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [Styled Components](https://styled-components.com/) (for modals)
- [Tailwind CSS](https://tailwindcss.com/) (optional, for utility classes)

## 📦 Getting Started

### 1. Clone the repository

```bash
# From the root of your project
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the `frontend/` directory if you want to override the default API URL:

```
REACT_APP_API_URL=http://localhost:8080/api
```

> By default, the app uses `http://localhost:8080/api` for backend requests.

### 4. Start the development server

```bash
npm start
```

The app will run at [http://localhost:3000](http://localhost:3000).

## 📝 Project Structure

```
frontend/
  src/
    components/         # Reusable UI components (modals, protected route)
    context/            # React context for authentication
    pages/              # Main pages (Dashboard, MyUrls, Login, etc.)
    services/           # API service modules (auth, org, url)
    App.js              # Main app and routing
    index.js            # Entry point
  public/               # Static assets
  package.json          # Dependencies and scripts
  README.md             # This file
```

## 🔐 Authentication

- JWT tokens are stored in localStorage and sent with every API request.
- Protected routes redirect to login if not authenticated.

## 🌐 API Endpoints

- The frontend expects a backend running at `http://localhost:8080/api` (see `.env` to override).
- See backend README for API details.

## 🖌️ Customization

- Update colors, gradients, and styles in `DashboardPage.js` and `CreateUrlModal.js` for your brand.
- Add more pages or features as needed!

## 🛠️ Troubleshooting

- If you see CORS errors, ensure the backend allows requests from `localhost:3000`.
- For API errors, check the browser console and backend logs.

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📧 Contact

For questions or support, contact [your-email@example.com].
