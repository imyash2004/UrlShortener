import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import urlService from "../services/urlService";
import organizationService from "../services/organizationService";
import { AuthContext } from "../context/AuthContext";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 20, 40, 0.45);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(18px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  border: 1.5px solid rgba(255, 255, 255, 0.18);
  padding: 2.5rem 2rem 2rem 2rem;
  width: 100%;
  max-width: 440px;
  position: relative;
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  color: white;
  font-size: 1.7rem;
  font-weight: 700;
  text-align: center;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.92);
  font-size: 1.05rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1.5px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.13);
  color: white;
  font-size: 1.05rem;
  box-sizing: border-box;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border: 1.5px solid #4ecdc4;
    background: rgba(255, 255, 255, 0.18);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1.5px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.13);
  color: white;
  font-size: 1.05rem;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border: 1.5px solid #4ecdc4;
    background: rgba(255, 255, 255, 0.18);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.85rem 1.7rem;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  font-size: 1.08rem;
  font-weight: 600;
  transition: all 0.2s;
`;

const CreateButton = styled(Button)`
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  color: white;
  box-shadow: 0 4px 15px rgba(76, 205, 196, 0.18);
  &:hover:not(:disabled) {
    background: linear-gradient(45deg, #26c6da, #00acc1);
    transform: translateY(-2px);
  }
`;

const CancelButton = styled(Button)`
  background: rgba(255, 255, 255, 0.13);
  color: #fff;
  border: 1.5px solid rgba(255, 255, 255, 0.18);
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.18);
    color: #44a08d;
    border: 1.5px solid #44a08d;
    transform: translateY(-2px);
  }
`;

const ErrorMsg = styled.div`
  color: #ff4757;
  margin-bottom: 1rem;
  text-align: center;
  background: rgba(255, 71, 87, 0.08);
  border-radius: 8px;
  border: 1px solid #ffcccc;
  padding: 0.7rem 1rem;
`;

const SuccessMsg = styled.div`
  color: #44a08d;
  margin-bottom: 1rem;
  text-align: center;
  padding: 0.5rem;
  background-color: #e6f7f0;
  border-radius: 4px;
  border: 1px solid #b3e6cc;
`;

const CreateUrlModal = ({ onClose, onUrlCreated }) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customShortCode, setCustomShortCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const { user } = useContext(AuthContext);

  // Fetch user's organizations when component mounts
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoadingOrgs(true);
        const response = await organizationService.getUserOrganizations();
        if (response && response.success && response.data) {
          setOrganizations(response.data.data.content || []);
          // Auto-select first organization if available
          if (
            response.data.data.content &&
            response.data.data.content.length > 0
          ) {
            setSelectedOrganization(response.data.data.content[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
        setError("Failed to load organizations. Please try again.");
      } finally {
        setLoadingOrgs(false);
      }
    };
    fetchOrganizations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate required fields
    if (!originalUrl.trim()) {
      setError("Original URL is required");
      setLoading(false);
      return;
    }

    if (!selectedOrganization) {
      setError("Please select an organization");
      setLoading(false);
      return;
    }

    // Validate URL format
    try {
      new URL(originalUrl.trim());
    } catch {
      setError("Please enter a valid URL (e.g., https://example.com)");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        organizationId: parseInt(selectedOrganization),
        originalUrl: originalUrl.trim(),
      };

      if (customShortCode.trim())
        payload.customShortCode = customShortCode.trim();
      if (title.trim()) payload.title = title.trim();
      if (description.trim()) payload.description = description.trim();
      if (expiresAt) payload.expiresAt = expiresAt;

      console.log("Creating URL with payload:", payload);

      const response = await urlService.createUrl(payload);

      if (response && response.success) {
        onUrlCreated(response.data);
        onClose();
      } else {
        setError(response?.message || "Failed to create short URL");
      }
    } catch (err) {
      console.error("Error creating URL:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create short URL. Please try again."
      );
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
            <Label>Organization *</Label>
            <Select
              value={selectedOrganization}
              onChange={(e) => setSelectedOrganization(e.target.value)}
              required
              disabled={loadingOrgs}
            >
              <option value="">
                {loadingOrgs
                  ? "Loading organizations..."
                  : "Select an organization"}
              </option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </Select>
          </InputGroup>
          <InputGroup>
            <Label>Original URL *</Label>
            <Input
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
              placeholder="https://example.com"
            />
          </InputGroup>
          <InputGroup>
            <Label>Custom Short Code (optional)</Label>
            <Input
              type="text"
              value={customShortCode}
              onChange={(e) => setCustomShortCode(e.target.value)}
              placeholder="my-custom-code"
              maxLength={50}
            />
          </InputGroup>
          <InputGroup>
            <Label>Title (optional)</Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My URL Title"
              maxLength={255}
            />
          </InputGroup>
          <InputGroup>
            <Label>Description (optional)</Label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="URL description"
              maxLength={500}
            />
          </InputGroup>
          <InputGroup>
            <Label>Expiration Date (optional)</Label>
            <Input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
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

export default CreateUrlModal;
