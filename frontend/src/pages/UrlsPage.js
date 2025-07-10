import React, { useState, useEffect } from "react";
import urlService from "../services/urlService";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";

const UrlsContainer = styled.div`
  padding: 2rem;
  background-color: #f0f2f5;
  min-height: 100vh;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #333;
`;

const CreateLink = styled(Link)`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const UrlList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const UrlCard = styled.li`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #dc3545;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c82333;
  }
`;

const UrlLink = styled.a`
  text-decoration: none;
  color: #333;
  font-size: 1.2rem;
`;

const ShortUrl = styled.span`
  font-weight: bold;
  color: #007bff;
`;

const UrlsPage = () => {
  const [urls, setUrls] = useState([]);
  const [deletingUrlId, setDeletingUrlId] = useState(null);
  const { organizationId } = useParams();

  useEffect(() => {
    if (organizationId) {
      urlService.getUrls(organizationId).then(
        (response) => {
          if (response.success) {
            setUrls(response.data.content);
          }
        },
        (error) => {
          console.error("Error fetching URLs", error);
        }
      );
    } else {
      urlService.getMyUrls().then(
        (response) => {
          if (response.success) {
            setUrls(response.data.content);
          }
        },
        (error) => {
          console.error("Error fetching URLs", error);
        }
      );
    }
  }, [organizationId]);

  const handleDelete = async (urlId) => {
    if (window.confirm("Are you sure you want to delete this URL? This action cannot be undone.")) {
      try {
        setDeletingUrlId(urlId);
        const response = await urlService.deleteUrl(urlId);
        if (response && response.success) {
          // Optimistically remove the URL from the list
          setUrls(urls.filter((url) => url.id !== urlId));
          // You could add a toast notification here for success feedback
          console.log("URL deleted successfully");
        } else {
          console.error("Failed to delete URL:", response?.message);
          // You could add error toast notification here
        }
      } catch (error) {
        console.error("Error deleting URL:", error);
        // You could add error toast notification here
      } finally {
        setDeletingUrlId(null);
      }
    }
  };

  return (
    <UrlsContainer>
      <Header>
        <Title>My URLs</Title>
        <CreateLink to="/urls/new">Create New URL</CreateLink>
      </Header>
      <UrlList>
        {urls.map((url) => (
          <UrlCard key={url.id}>
            <div>
              <UrlLink
                href={url.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {url.originalUrl}
              </UrlLink>
              <br />
              <ShortUrl>
                Shortened:{" "}
                <a
                  href={url.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {url.shortUrl}
                </a>
              </ShortUrl>
            </div>
            <DeleteButton 
              onClick={() => handleDelete(url.id)}
              disabled={deletingUrlId === url.id}
            >
              {deletingUrlId === url.id ? "Deleting..." : "Delete"}
            </DeleteButton>
          </UrlCard>
        ))}
      </UrlList>
    </UrlsContainer>
  );
};

export default UrlsPage;
