import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import organizationService from "../services/organizationService";
import urlService from "../services/urlService";
import CreateOrganizationModal from "../components/CreateOrganizationModal";
import CreateUrlModal from "../components/CreateUrlModal";

const DashboardContainer = {
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

const WelcomeMessage = {
  fontSize: "1.2rem",
  color: "rgba(255, 255, 255, 0.9)",
  marginBottom: "2rem",
  textAlign: "center",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  borderRadius: "15px",
  padding: "1rem 2rem",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

const LogoutButton = {
  padding: "0.75rem 1.5rem",
  border: "none",
  borderRadius: "25px",
  background: "linear-gradient(45deg, #ff4757, #ff3742)",
  color: "white",
  fontSize: "1rem",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 4px 15px rgba(255, 71, 87, 0.3)",
};

const Nav = {
  marginBottom: "3rem",
};

const NavGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "2rem",
  marginBottom: "2rem",
};

const NavCard = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  padding: "2rem",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  transition: "all 0.3s ease",
  cursor: "pointer",
  position: "relative",
  overflow: "hidden",
};

const NavIcon = {
  fontSize: "3rem",
  marginBottom: "1rem",
  display: "block",
};

const NavTitle = {
  fontSize: "1.5rem",
  color: "white",
  fontWeight: "600",
  marginBottom: "0.5rem",
};

const NavDescription = {
  fontSize: "1rem",
  color: "rgba(255, 255, 255, 0.7)",
  lineHeight: "1.5",
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

const QuickActions = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  padding: "2rem",
  border: "1px solid rgba(255, 255, 255, 0.2)",
};

const QuickActionsTitle = {
  fontSize: "1.5rem",
  color: "white",
  fontWeight: "600",
  marginBottom: "1.5rem",
  textAlign: "center",
};

const ActionButton = {
  display: "block",
  width: "100%",
  padding: "1rem 2rem",
  marginBottom: "1rem",
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
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [organizations, setOrganizations] = useState([]);
  const [totalUrls, setTotalUrls] = useState(0);
  const [totalOrganizations, setTotalOrganizations] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);
  const [showCreateUrlModal, setShowCreateUrlModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orgData = await organizationService.getUserOrganizations();
        setOrganizations(orgData.data.content);
        setTotalOrganizations(orgData.data.totalElements);

        const urlData = await urlService.getUrls(orgData.data.content[0].id);
        setTotalUrls(urlData.data.totalElements);

        if (orgData.data.content.length === 0) {
          setShowCreateOrgModal(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleCardHover = (e) => {
    e.currentTarget.style.transform = "translateY(-5px)";
    e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.2)";
  };

  const handleCardLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "none";
  };

  const handleButtonHover = (e) => {
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow = "0 8px 25px rgba(255, 71, 87, 0.4)";
  };

  const handleButtonLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 71, 87, 0.3)";
  };

  const handleActionButtonHover = (e) => {
    e.currentTarget.style.background =
      "linear-gradient(45deg, #26c6da, #00acc1)";
    e.currentTarget.style.transform = "translateY(-2px)";
  };

  const handleActionButtonLeave = (e) => {
    e.currentTarget.style.background =
      "linear-gradient(45deg, #4ecdc4, #44a08d)";
    e.currentTarget.style.transform = "translateY(0)";
  };

  const handleOrgCreated = (newOrg) => {
    setOrganizations([...organizations, newOrg]);
    setShowCreateOrgModal(false);
  };

  const handleUrlCreated = (newUrl) => {
    setShowCreateUrlModal(false);
    // Optionally refresh stats or show a message
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (showCreateOrgModal) {
    return (
      <CreateOrganizationModal
        onOrganizationCreated={handleOrgCreated}
        onClose={() => setShowCreateOrgModal(false)}
      />
    );
  }

  return (
    <div style={DashboardContainer}>
      <div style={BackgroundPattern}></div>
      <div style={ContentWrapper}>
        <header style={Header}>
          <div style={HeaderLeft}>
            <div style={Logo}>🔗</div>
            <h2 style={Title}>Dashboard</h2>
          </div>
          <button
            style={LogoutButton}
            onClick={handleLogout}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
          >
            Logout
          </button>
        </header>

        {user && user.user && (
          <p style={WelcomeMessage}>
            Welcome back, {user.user.firstName} {user.user.lastName}! 👋
          </p>
        )}

        <div style={StatsGrid}>
          <div style={StatCard}>
            <div style={StatNumber}>{totalUrls}</div>
            <div style={StatLabel}>Total URLs</div>
          </div>
          <div style={StatCard}>
            <div style={StatNumber}>{totalOrganizations}</div>
            <div style={StatLabel}>Organizations</div>
          </div>
        </div>

        <nav style={Nav}>
          <div style={NavGrid}>
            <div
              style={NavCard}
              onClick={() => handleNavigation("/organizations")}
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <span style={NavIcon}>🏢</span>
              <h3 style={NavTitle}>My Organizations</h3>
              <p style={NavDescription}>
                Manage your organizations, invite team members, and collaborate
                on URL campaigns
              </p>
            </div>

            <div
              style={NavCard}
              onClick={() => handleNavigation("/my-urls")}
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <span style={NavIcon}>📊</span>
              <h3 style={NavTitle}>My URLs</h3>
              <p style={NavDescription}>
                View, edit, and analyze all your shortened URLs with detailed
                analytics
              </p>
            </div>
          </div>
        </nav>

        <div style={QuickActions}>
          <h3 style={QuickActionsTitle}>Quick Actions</h3>
          <button
            style={ActionButton}
            onClick={() => setShowCreateUrlModal(true)}
            onMouseEnter={handleActionButtonHover}
            onMouseLeave={handleActionButtonLeave}
          >
            ➕ Create New Short URL
          </button>
          <button
            style={{ ...ActionButton, cursor: "default", opacity: 0.7 }}
            disabled
          >
            📈 View Analytics
          </button>
          <button
            style={{ ...ActionButton, cursor: "default", opacity: 0.7 }}
            disabled
          >
            ⚙️ Account Settings
          </button>
        </div>
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

export default DashboardPage;
