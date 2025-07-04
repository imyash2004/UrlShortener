import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import urlService from "../services/urlService";
import CreateUrlModal from "../components/CreateUrlModal";

const PageContainer = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  position: "relative",
  overflow: "hidden",
};

const BackgroundPattern = {
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
};

const ContentWrapper = {
  position: "relative",
  zIndex: 1,
  padding: "2rem",
  maxWidth: "1200px",
  margin: "0 auto",
};

const Header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "3rem",
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  padding: "1.5rem 2rem",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
};

const HeaderLeft = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
};

const Logo = {
  width: "50px",
  height: "50px",
  background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.5rem",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
};

const Title = {
  fontSize: "2rem",
  color: "white",
  fontWeight: "700",
  textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
  margin: 0,
};

const BackButton = {
  padding: "0.75rem 1.5rem",
  border: "none",
  borderRadius: "25px",
  background: "linear-gradient(45deg, #4ecdc4, #44a08d)",
  color: "white",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  textDecoration: "none",
  display: "inline-block",
};

const StatsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1.5rem",
  marginBottom: "3rem",
};

const StatCard = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "15px",
  padding: "1.5rem",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  textAlign: "center",
  transition: "transform 0.3s ease",
};

const StatNumber = {
  fontSize: "2.5rem",
  fontWeight: "bold",
  color: "white",
  marginBottom: "0.5rem",
};

const StatLabel = {
  fontSize: "1rem",
  color: "rgba(255, 255, 255, 0.7)",
};

const UrlsContainer = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  padding: "2rem",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  marginBottom: "2rem",
};

const UrlsTitle = {
  fontSize: "1.5rem",
  color: "white",
  fontWeight: "600",
  marginBottom: "1.5rem",
  textAlign: "center",
};

const UrlCard = {
  background: "rgba(255, 255, 255, 0.05)",
  borderRadius: "15px",
  padding: "1.5rem",
  marginBottom: "1rem",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  transition: "all 0.3s ease",
};

const UrlHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "1rem",
};

const UrlInfo = {
  flex: 1,
};

const UrlTitle = {
  fontSize: "1.2rem",
  color: "white",
  fontWeight: "600",
  marginBottom: "0.5rem",
};

const UrlOriginal = {
  fontSize: "0.9rem",
  color: "rgba(255, 255, 255, 0.7)",
  marginBottom: "0.5rem",
  wordBreak: "break-all",
};

const UrlShort = {
  fontSize: "1rem",
  color: "#4ecdc4",
  fontWeight: "500",
  marginBottom: "0.5rem",
  wordBreak: "break-all",
  cursor: "pointer",
  textDecoration: "underline",
  transition: "all 0.3s ease",
};

const ClickableUrl = {
  fontSize: "0.9rem",
  color: "rgba(255, 255, 255, 0.7)",
  marginBottom: "0.5rem",
  wordBreak: "break-all",
  cursor: "pointer",
  textDecoration: "underline",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const CopyButton = {
  padding: "0.25rem 0.5rem",
  border: "none",
  borderRadius: "4px",
  background: "rgba(255, 255, 255, 0.1)",
  color: "white",
  fontSize: "0.8rem",
  cursor: "pointer",
  transition: "all 0.3s ease",
  marginLeft: "0.5rem",
};

const UrlStats = {
  fontSize: "0.8rem",
  color: "rgba(255, 255, 255, 0.6)",
  marginBottom: "0.5rem",
};

const ActionButtons = {
  display: "flex",
  gap: "0.5rem",
  flexShrink: 0,
};

const EditButton = {
  padding: "0.5rem 1rem",
  border: "none",
  borderRadius: "8px",
  background: "linear-gradient(45deg, #4ecdc4, #44a08d)",
  color: "white",
  fontSize: "0.9rem",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const DeleteButton = {
  padding: "0.5rem 1rem",
  border: "none",
  borderRadius: "8px",
  background: "linear-gradient(45deg, #ff4757, #ff3742)",
  color: "white",
  fontSize: "0.9rem",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const PaginationContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
  marginTop: "2rem",
};

const PaginationButton = {
  padding: "0.75rem 1rem",
  border: "none",
  borderRadius: "10px",
  background: "rgba(255, 255, 255, 0.1)",
  color: "white",
  fontSize: "1rem",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.3s ease",
  border: "1px solid rgba(255, 255, 255, 0.2)",
};

const PaginationInfo = {
  color: "rgba(255, 255, 255, 0.8)",
  fontSize: "1rem",
};

const LoadingSpinner = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "200px",
  color: "white",
  fontSize: "1.2rem",
};

const NoUrlsMessage = {
  textAlign: "center",
  color: "rgba(255, 255, 255, 0.7)",
  fontSize: "1.1rem",
  padding: "2rem",
};

const EditModal = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const EditModalContent = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(20px)",
  borderRadius: "20px",
  padding: "2rem",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  width: "90%",
  maxWidth: "500px",
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
};

const EditModalTitle = {
  fontSize: "1.5rem",
  color: "white",
  fontWeight: "600",
  marginBottom: "1.5rem",
  textAlign: "center",
};

const FormGroup = {
  marginBottom: "1.5rem",
};

const Label = {
  display: "block",
  color: "white",
  fontSize: "1rem",
  fontWeight: "500",
  marginBottom: "0.5rem",
};

const Input = {
  width: "100%",
  padding: "0.75rem",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "10px",
  background: "rgba(255, 255, 255, 0.1)",
  color: "white",
  fontSize: "1rem",
  boxSizing: "border-box",
};

const ModalButtons = {
  display: "flex",
  gap: "1rem",
  justifyContent: "center",
};

const SaveButton = {
  padding: "0.75rem 1.5rem",
  border: "none",
  borderRadius: "10px",
  background: "linear-gradient(45deg, #4ecdc4, #44a08d)",
  color: "white",
  fontSize: "1rem",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const CancelButton = {
  padding: "0.75rem 1.5rem",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "10px",
  background: "transparent",
  color: "white",
  fontSize: "1rem",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const ErrorMsg = {
  color: "#ff4757",
  background: "rgba(255, 71, 87, 0.1)",
  border: "1px solid #ff4757",
  borderRadius: "8px",
  padding: "1rem",
  marginBottom: "1.5rem",
  textAlign: "center",
  fontWeight: 500,
  fontSize: "1.1rem",
};

const MyUrlsPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [editingUrl, setEditingUrl] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", originalUrl: "" });
  const [error, setError] = useState(null);
  const [showCreateUrlModal, setShowCreateUrlModal] = useState(false);

  useEffect(() => {
    fetchUrls();
  }, [currentPage]);

  const fetchUrls = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!user || !user.token) {
        setError("No user found. Please log in to view your URLs.");
        setUrls([]);
        setTotalPages(0);
        setTotalElements(0);
        return;
      }
      const response = await urlService.getMyUrls(currentPage, pageSize);
      // Handle the API response structure
      if (response && response.success && response.data) {
        const urlData = response.data;
        setUrls(urlData.content || []);
        setTotalPages(urlData.totalPages || 0);
        setTotalElements(urlData.totalElements || 0);
      } else if (
        response &&
        response.message &&
        response.message.toLowerCase().includes("authentication")
      ) {
        setError("No user found. Please log in to view your URLs.");
        setUrls([]);
        setTotalPages(0);
        setTotalElements(0);
      } else {
        setError("Failed to fetch URLs. Please try again.");
        setUrls([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (error) {
      let backendMsg =
        error.response &&
        error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message.toLowerCase()
          : "";

      if (
        backendMsg.includes("authentication") ||
        backendMsg.includes("user") ||
        backendMsg.includes("credentials")
      ) {
        setError("No user found. Please log in to view your URLs.");
      } else if (backendMsg) {
        setError(backendMsg.charAt(0).toUpperCase() + backendMsg.slice(1));
      } else {
        setError("Failed to fetch URLs. Please try again.");
      }
      setUrls([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (url) => {
    setEditingUrl(url);
    setEditForm({
      title: url.title || "",
      originalUrl: url.originalUrl || "",
    });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await urlService.updateUrl(editingUrl.id, editForm);
      if (response && response.success) {
        setEditingUrl(null);
        setEditForm({ title: "", originalUrl: "" });
        fetchUrls(); // Refresh the list
      } else {
        console.error("Failed to update URL:", response?.message);
      }
    } catch (error) {
      console.error("Error updating URL:", error);
    }
  };

  const handleDelete = async (urlId) => {
    if (window.confirm("Are you sure you want to delete this URL?")) {
      try {
        const response = await urlService.deleteUrl(urlId);
        if (response && response.success) {
          fetchUrls(); // Refresh the list
        } else {
          console.error("Failed to delete URL:", response?.message);
        }
      } catch (error) {
        console.error("Error deleting URL:", error);
      }
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleUrlClick = (url, type) => {
    if (type === "short") {
      window.open(url.shortUrl, "_blank");
    } else if (type === "original") {
      window.open(url.originalUrl, "_blank");
    }
  };

  const handleUrlHover = (e, type) => {
    if (type === "short") {
      e.currentTarget.style.color = "#26c6da";
      e.currentTarget.style.textDecoration = "underline";
    } else if (type === "original") {
      e.currentTarget.style.color = "rgba(255, 255, 255, 0.9)";
      e.currentTarget.style.textDecoration = "underline";
    }
  };

  const handleUrlLeave = (e, type) => {
    if (type === "short") {
      e.currentTarget.style.color = "#4ecdc4";
      e.currentTarget.style.textDecoration = "underline";
    } else if (type === "original") {
      e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
      e.currentTarget.style.textDecoration = "underline";
    }
  };

  const handleCopyUrl = async (url, type) => {
    try {
      const urlToCopy = type === "short" ? url.shortUrl : url.originalUrl;
      await navigator.clipboard.writeText(urlToCopy);

      // Show a temporary success message
      const originalText =
        type === "short" ? "Shortened URL copied!" : "Original URL copied!";
      const element = document.getElementById(`url-${url.id}-${type}`);
      if (element) {
        const originalContent = element.innerHTML;
        element.innerHTML = originalContent.replace("🔗", "✅");
        setTimeout(() => {
          element.innerHTML = originalContent;
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  const handleUrlCreated = () => {
    setShowCreateUrlModal(false);
    fetchUrls();
  };

  if (loading) {
    return (
      <div style={PageContainer}>
        <div style={BackgroundPattern}></div>
        <div style={ContentWrapper}>
          <div style={LoadingSpinner}>Loading your URLs...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={PageContainer}>
      <div style={BackgroundPattern}></div>
      <div style={ContentWrapper}>
        <header style={Header}>
          <div style={HeaderLeft}>
            <div style={Logo}>🔗</div>
            <h2 style={Title}>My URLs</h2>
          </div>
          <button
            style={BackButton}
            onClick={handleBackToDashboard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            ← Back to Dashboard
          </button>
        </header>

        <button
          style={{
            display: "block",
            width: "100%",
            padding: "1rem 2rem",
            marginBottom: "2rem",
            border: "none",
            borderRadius: "15px",
            background: "linear-gradient(45deg, #4ecdc4, #44a08d)",
            color: "white",
            fontSize: "1.1rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
            textDecoration: "none",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(76, 205, 196, 0.2)",
          }}
          onClick={() => setShowCreateUrlModal(true)}
        >
          ➕ Create New Short URL
        </button>

        <div style={StatsGrid}>
          <div style={StatCard}>
            <div style={StatNumber}>{totalElements}</div>
            <div style={StatLabel}>Total URLs</div>
          </div>
          <div style={StatCard}>
            <div style={StatNumber}>{urls?.length || 0}</div>
            <div style={StatLabel}>On This Page</div>
          </div>
        </div>

        <div style={UrlsContainer}>
          <h3 style={UrlsTitle}>Your Shortened URLs</h3>
          {error && <div style={ErrorMsg}>{error}</div>}
          {!urls || urls.length === 0 ? (
            <div style={NoUrlsMessage}>
              No URLs found. Create your first shortened URL!
            </div>
          ) : (
            urls.map((url) => (
              <div
                key={url.id}
                style={UrlCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.05)";
                }}
              >
                <div style={UrlHeader}>
                  <div style={UrlInfo}>
                    <div style={UrlTitle}>{url.title || "Untitled URL"}</div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <div
                        id={`url-${url.id}-original`}
                        style={ClickableUrl}
                        onClick={() => handleUrlClick(url, "original")}
                        onMouseEnter={(e) => handleUrlHover(e, "original")}
                        onMouseLeave={(e) => handleUrlLeave(e, "original")}
                        title="Click to visit original URL"
                      >
                        <strong>Original:</strong> {url.originalUrl} 🔗
                      </div>
                      <button
                        style={CopyButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyUrl(url, "original");
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255, 255, 255, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255, 255, 255, 0.1)";
                        }}
                        title="Copy original URL"
                      >
                        📋
                      </button>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <div
                        id={`url-${url.id}-short`}
                        style={UrlShort}
                        onClick={() => handleUrlClick(url, "short")}
                        onMouseEnter={(e) => handleUrlHover(e, "short")}
                        onMouseLeave={(e) => handleUrlLeave(e, "short")}
                        title="Click to visit shortened URL"
                      >
                        <strong>Shortened:</strong> {url.shortUrl} 🔗
                      </div>
                      <button
                        style={CopyButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyUrl(url, "short");
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255, 255, 255, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "rgba(255, 255, 255, 0.1)";
                        }}
                        title="Copy shortened URL"
                      >
                        📋
                      </button>
                    </div>
                    <div style={UrlStats}>
                      Created: {formatDate(url.createdAt)} | Clicks:{" "}
                      {url.clickCount || 0}
                    </div>
                  </div>
                  <div style={ActionButtons}>
                    <button
                      style={EditButton}
                      onClick={() => handleEdit(url)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      style={DeleteButton}
                      onClick={() => handleDelete(url.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div style={PaginationContainer}>
            <button
              style={PaginationButton}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              onMouseEnter={(e) => {
                if (currentPage > 0) {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              }}
            >
              ← Previous
            </button>

            <div style={PaginationInfo}>
              Page {currentPage + 1} of {totalPages}
            </div>

            <button
              style={PaginationButton}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              onMouseEnter={(e) => {
                if (currentPage < totalPages - 1) {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              }}
            >
              Next →
            </button>
          </div>
        )}

        {editingUrl && (
          <div style={EditModal}>
            <div style={EditModalContent}>
              <h3 style={EditModalTitle}>Edit URL</h3>

              <div style={FormGroup}>
                <label style={Label}>Title</label>
                <input
                  type="text"
                  style={Input}
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  placeholder="Enter URL title"
                />
              </div>

              <div style={FormGroup}>
                <label style={Label}>Original URL</label>
                <input
                  type="url"
                  style={Input}
                  value={editForm.originalUrl}
                  onChange={(e) =>
                    setEditForm({ ...editForm, originalUrl: e.target.value })
                  }
                  placeholder="Enter original URL"
                />
              </div>

              <div style={ModalButtons}>
                <button
                  style={SaveButton}
                  onClick={handleSaveEdit}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Save Changes
                </button>
                <button
                  style={CancelButton}
                  onClick={() => {
                    setEditingUrl(null);
                    setEditForm({ title: "", originalUrl: "" });
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {showCreateUrlModal && (
          <CreateUrlModal
            onClose={() => setShowCreateUrlModal(false)}
            onUrlCreated={handleUrlCreated}
          />
        )}
      </div>
    </div>
  );
};

export default MyUrlsPage;
