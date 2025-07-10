import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import OrganizationsPage from "./pages/OrganizationsPage";
import OrganizationDetailsPage from "./pages/OrganizationDetailsPage";
import CreateOrganizationPage from "./pages/CreateOrganizationPage";
import UrlsPage from "./pages/UrlsPage";
import MyUrlsPage from "./pages/MyUrlsPage";
import CreateUrlPage from "./pages/CreateUrlPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizations"
          element={
            <ProtectedRoute>
              <OrganizationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizations/:organizationId"
          element={
            <ProtectedRoute>
              <OrganizationDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-urls"
          element={
            <ProtectedRoute>
              <MyUrlsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-organization"
          element={
            <ProtectedRoute>
              <CreateOrganizationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/urls/new"
          element={
            <ProtectedRoute>
              <CreateUrlPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
