import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import urlService from "../services/urlService";
import { AuthContext } from "../context/AuthContext";
import organizationService from "../services/organizationService";

const CreateUrlPage = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customShortCode, setCustomShortCode] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [createdUrl, setCreatedUrl] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await organizationService.getUserOrganizations();
        if (response && response.success) {
          // The backend returns a Page object, so we need to access the content array
          const organizationsData = response.data.content || response.data;
          setOrganizations(organizationsData);
          if (organizationsData && organizationsData.length > 0) {
            setOrganizationId(organizationsData[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch organizations", error);
      }
    };

    fetchOrganizations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");
    setCreatedUrl(null);

    try {
      const response = await urlService.createUrl({
        originalUrl,
        customShortCode,
        organizationId,
      });

      if (response && response.success) {
        setSuccessMessage("URL created successfully!");
        setCreatedUrl(response.data);
        setOriginalUrl("");
        setCustomShortCode("");
      } else {
        setError(response?.message || "Failed to create short URL.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create short URL. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(33, 150, 243, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 90%, rgba(156, 39, 176, 0.1) 0%, transparent 50%)
        `,
          pointerEvents: "none",
        }}
      ></div>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          padding: "2.5rem",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            color: "white",
            fontWeight: "700",
            textAlign: "center",
            marginBottom: "2rem",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          Create a New Short URL
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="organization"
              style={{
                display: "block",
                color: "rgba(255, 255, 255, 0.8)",
                marginBottom: "0.5rem",
                fontSize: "1rem",
              }}
            >
              Organization
            </label>
            <select
              id="organization"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "1rem",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.15)",
                color: "white",
                fontSize: "1rem",
                outline: "none",
              }}
            >
              {Array.isArray(organizations) &&
                organizations.map((org) => (
                  <option
                    key={org.id}
                    value={org.id}
                    style={{ color: "black" }}
                  >
                    {org.name}
                  </option>
                ))}
            </select>
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="originalUrl"
              style={{
                display: "block",
                color: "rgba(255, 255, 255, 0.8)",
                marginBottom: "0.5rem",
                fontSize: "1rem",
              }}
            >
              Original URL
            </label>
            <input
              type="url"
              id="originalUrl"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "1rem",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.15)",
                color: "white",
                fontSize: "1rem",
                outline: "none",
              }}
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="customShortCode"
              style={{
                display: "block",
                color: "rgba(255, 255, 255, 0.8)",
                marginBottom: "0.5rem",
                fontSize: "1rem",
              }}
            >
              Custom Short Code (Optional)
            </label>
            <input
              type="text"
              id="customShortCode"
              value={customShortCode}
              onChange={(e) => setCustomShortCode(e.target.value)}
              style={{
                width: "100%",
                padding: "1rem",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.15)",
                color: "white",
                fontSize: "1rem",
                outline: "none",
              }}
            />
          </div>
          {error && (
            <p
              style={{
                color: "#ff4757",
                textAlign: "center",
                marginBottom: "1rem",
              }}
            >
              {error}
            </p>
          )}
          {successMessage && (
            <p
              style={{
                color: "#2ed573",
                textAlign: "center",
                marginBottom: "1rem",
              }}
            >
              {successMessage}
            </p>
          )}
          {createdUrl && (
            <div
              style={{
                background: "rgba(0,0,0,0.2)",
                padding: "1rem",
                borderRadius: "10px",
                marginBottom: "1rem",
                color: "white",
                textAlign: "center",
              }}
            >
              <p>Your short URL is ready:</p>
              <a
                href={createdUrl.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#4ecdc4", textDecoration: "none" }}
              >
                {createdUrl.shortUrl}
              </a>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              display: "block",
              width: "100%",
              padding: "1rem",
              border: "none",
              borderRadius: "15px",
              background: loading
                ? "grey"
                : "linear-gradient(45deg, #4ecdc4, #44a08d)",
              color: "white",
              fontSize: "1.1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating..." : "Create Short URL"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUrlPage;
