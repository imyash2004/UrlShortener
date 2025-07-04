import React, { useState, useEffect } from 'react';
import urlService from '../services/urlService';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

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
  const { organizationId } = useParams();

  useEffect(() => {
    if (organizationId) {
      urlService
        .getUrlsByOrganization(organizationId, 0, 10, 'createdAt', 'desc')
        .then(
          (response) => {
            setUrls(response.data.data.content);
          },
          (error) => {
            console.error('Error fetching URLs', error);
          }
        );
    } else {
      urlService.getUserUrls(0, 10, 'createdAt', 'desc').then(
        (response) => {
          setUrls(response.data.data.content);
        },
        (error) => {
          console.error('Error fetching URLs', error);
        }
      );
    }
  }, [organizationId]);

  return (
    <UrlsContainer>
      <Header>
        <Title>My URLs</Title>
        <CreateLink to="/urls/new">Create New URL</CreateLink>
      </Header>
      <UrlList>
        {urls.map((url) => (
          <UrlCard key={url.id}>
            <UrlLink
              href={url.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {url.originalUrl}
            </UrlLink>
            <ShortUrl>{url.shortUrl}</ShortUrl>
          </UrlCard>
        ))}
      </UrlList>
    </UrlsContainer>
  );
};

export default UrlsPage;
