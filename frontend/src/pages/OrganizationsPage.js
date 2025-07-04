import React, { useState, useEffect } from 'react';
import organizationService from '../services/organizationService';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CreateOrganizationModal from '../components/CreateOrganizationModal';

const OrganizationsContainer = styled.div`
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

const CreateButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const OrgList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const OrgCard = styled.li`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const OrgLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-size: 1.2rem;
  font-weight: bold;
`;

const OrganizationsPage = () => {
  const [organizations, setOrganizations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchOrganizations = () => {
    organizationService.getUserOrganizations(0, 10, 'createdAt', 'desc').then(
      (response) => {
        setOrganizations(response.data.data.content);
      },
      (error) => {
        console.error('Error fetching organizations', error);
      }
    );
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleOrganizationCreated = () => {
    fetchOrganizations();
    // Assuming the new org is the first in the list after refetching
    organizationService.getUserOrganizations(0, 1, 'createdAt', 'desc').then(
      (response) => {
        const newOrgId = response.data.data.content[0].id;
        navigate(`/organizations/${newOrgId}`);
      }
    )
  };

  return (
    <OrganizationsContainer>
      <Header>
        <Title>My Organizations</Title>
        <CreateButton onClick={() => setIsModalOpen(true)}>
          Create New Organization
        </CreateButton>
      </Header>
      <OrgList>
        {organizations.map((org) => (
          <OrgCard key={org.id}>
            <OrgLink to={`/organizations/${org.id}`}>{org.name}</OrgLink>
          </OrgCard>
        ))}
      </OrgList>
      {isModalOpen && (
        <CreateOrganizationModal
          onClose={() => setIsModalOpen(false)}
          onOrganizationCreated={handleOrganizationCreated}
        />
      )}
    </OrganizationsContainer>
  );
};

export default OrganizationsPage;
