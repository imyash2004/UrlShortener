import React, { useState, useContext } from "react";
import styled from "styled-components";
import organizationService from "../services/organizationService";
import urlService from "../services/urlService";
import { AuthContext } from "../context/AuthContext";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
`;

const Form = styled.form``;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const CreateButton = styled(Button)`
  background-color: #007bff;
  color: white;
`;

const CancelButton = styled(Button)`
  background-color: #f0f2f5;
  color: #333;
`;

const ErrorMsg = styled.div`
  color: #ff4757;
  margin-bottom: 1rem;
  text-align: center;
`;

const CreateOrganizationModal = ({ onClose, onOrganizationCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await organizationService.createOrganization({
        name,
        description,
      });
      onOrganizationCreated(response.data);
      onClose();
    } catch (error) {
      console.error("Failed to create organization", error);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <Title>Create New Organization</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Organization Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </InputGroup>
          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>
              Cancel
            </CancelButton>
            <CreateButton type="submit">Create</CreateButton>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

const CreateUrlModal = ({ onClose, onUrlCreated }) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Use the first organization by default
      const organizationId = user.organizations[0].id;
      const response = await urlService.createUrl({
        organizationId,
        originalUrl,
      });
      onUrlCreated(response.data);
      onClose();
    } catch (err) {
      setError("Failed to create short URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <Title>Create New Short URL</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Original URL</Label>
            <Input
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
              placeholder="https://example.com"
            />
          </InputGroup>
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <ButtonGroup>
            <CancelButton type="button" onClick={onClose} disabled={loading}>
              Cancel
            </CancelButton>
            <CreateButton type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </CreateButton>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreateOrganizationModal;
