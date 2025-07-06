import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import organizationService from "../services/organizationService";
import urlService from "../services/urlService";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(
      circle at 20% 30%,
      rgba(76, 175, 80, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 70%,
      rgba(33, 150, 243, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 40% 90%,
      rgba(156, 39, 176, 0.1) 0%,
      transparent 50%
    );
  pointer-events: none;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 25px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: white;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  margin: 0;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: white;
  font-size: 1.2rem;
`;

const ErrorMessage = styled.div`
  background: rgba(255, 71, 87, 0.2);
  border: 1px solid rgba(255, 71, 87, 0.5);
  border-radius: 15px;
  padding: 1.5rem;
  color: #ff6b6b;
  text-align: center;
  margin: 2rem 0;
`;

const OrganizationCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const OrgName = styled.h2`
  font-size: 2rem;
  color: white;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const OrgDescription = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const OrgDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const DetailItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const DetailLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.div`
  font-size: 1.1rem;
  color: white;
  font-weight: 500;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 2rem;
`;

const ActionButton = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 15px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &.primary {
    background: linear-gradient(45deg, #4ecdc4, #44a08d);
    color: white;
    box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(78, 205, 196, 0.4);
    }
  }

  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
  }
`;

const OrganizationDetailsPage = () => {
  const { organizationId } = useParams();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState(null);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganizationDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch organization details
        const orgResponse = await organizationService.getOrganizationById(
          organizationId
        );
        console.log("Organization response:", orgResponse);

        // The response structure is: { success, message, data, timestamp }
        if (
          orgResponse.data &&
          orgResponse.data.success &&
          orgResponse.data.data
        ) {
          setOrganization(orgResponse.data.data);
        } else {
          console.error(
            "Unexpected organization response structure:",
            orgResponse
          );
          setError(
            orgResponse.data?.message || "Invalid organization response format"
          );
          return;
        }

        // Fetch URLs for this organization
        const urlsResponse = await urlService.getUrls(organizationId);
        console.log("URLs response:", urlsResponse);

        // For paginated responses, the structure is: { success, message, data: { content, ... }, timestamp }
        if (
          urlsResponse.data &&
          urlsResponse.data.success &&
          urlsResponse.data.data &&
          urlsResponse.data.data.content
        ) {
          setUrls(urlsResponse.data.data.content);
        } else {
          console.error("Unexpected URLs response structure:", urlsResponse);
          setUrls([]); // Set empty array instead of failing
        }
      } catch (err) {
        console.error("Error fetching organization details:", err);
        setError("Failed to load organization details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (organizationId) {
      fetchOrganizationDetails();
    }
  }, [organizationId]);

  const handleBack = () => {
    navigate("/organizations");
  };

  const handleViewUrls = () => {
    navigate(`/organizations/${organizationId}/urls`);
  };

  const handleCreateUrl = () => {
    navigate(`/organizations/${organizationId}/create-url`);
  };

  if (loading) {
    return (
      <Container>
        <BackgroundPattern />
        <ContentWrapper>
          <LoadingSpinner>Loading organization details...</LoadingSpinner>
        </ContentWrapper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <BackgroundPattern />
        <ContentWrapper>
          <Header>
            <BackButton onClick={handleBack}>
              ← Back to Organizations
            </BackButton>
            <Title>Organization Details</Title>
          </Header>
          <ErrorMessage>{error}</ErrorMessage>
        </ContentWrapper>
      </Container>
    );
  }

  if (!organization) {
    return (
      <Container>
        <BackgroundPattern />
        <ContentWrapper>
          <Header>
            <BackButton onClick={handleBack}>
              ← Back to Organizations
            </BackButton>
            <Title>Organization Details</Title>
          </Header>
          <ErrorMessage>Organization not found</ErrorMessage>
        </ContentWrapper>
      </Container>
    );
  }

  const totalUrls = urls.length;
  const activeUrls = urls.filter((url) => url.active).length;
  const totalClicks = urls.reduce((sum, url) => sum + (url.clickCount || 0), 0);

  return (
    <Container>
      <BackgroundPattern />
      <ContentWrapper>
        <Header>
          <BackButton onClick={handleBack}>← Back to Organizations</BackButton>
          <Title>Organization Details</Title>
        </Header>

        <OrganizationCard>
          <OrgName>{organization.name}</OrgName>
          <OrgDescription>
            {organization.description || "No description available"}
          </OrgDescription>

          <OrgDetails>
            <DetailItem>
              <DetailLabel>Organization ID</DetailLabel>
              <DetailValue>{organization.id}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Created</DetailLabel>
              <DetailValue>
                {new Date(organization.createdAt).toLocaleDateString()}
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Status</DetailLabel>
              <DetailValue>
                {organization.active ? "Active" : "Inactive"}
              </DetailValue>
            </DetailItem>
          </OrgDetails>

          <StatsGrid>
            <StatCard>
              <StatNumber>{totalUrls}</StatNumber>
              <StatLabel>Total URLs</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{activeUrls}</StatNumber>
              <StatLabel>Active URLs</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{totalClicks}</StatNumber>
              <StatLabel>Total Clicks</StatLabel>
            </StatCard>
          </StatsGrid>

          <ActionButtons>
            <ActionButton className="primary" onClick={handleViewUrls}>
              📊 View URLs
            </ActionButton>
            <ActionButton className="secondary" onClick={handleCreateUrl}>
              ➕ Create New URL
            </ActionButton>
          </ActionButtons>
        </OrganizationCard>
      </ContentWrapper>
    </Container>
  );
};

export default OrganizationDetailsPage;
