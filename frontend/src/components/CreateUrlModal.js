import React, { useState, useContext } from "react";
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
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
  padding: 2.5rem;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  color: white;
  font-size: 1.8rem;
  text-align: center;
`;

const Form = styled.form``;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4ecdc4;
    box-shadow: 0 0 0 2px rgba(78, 205, 196, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #4ecdc4;
    box-shadow: 0 0 0 2px rgba(78, 205, 196, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CreateButton = styled(Button)`
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  color: white;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(78, 205, 196, 0.3);
  }
`;

const CancelButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const ErrorMsg = styled.div`
  color: #ff4757;
  margin-bottom: 1rem;
  text-align: center;
`;

const CreateUrlModal = ({ onClose, onUrlCreated }) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customShortCode, setCustomShortCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  React.useEffect(() => {
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
    try {
      const response = await urlService.createUrl({
        organizationId,
        originalUrl,
        customShortCode,
        title,
        description,
        expiresAt: expiresAt || null,
      });
      onUrlCreated(response.data);
      onClose();
    } catch (err) {
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
      <ModalContent
        style={{ maxHeight: "90vh", overflowY: "auto", margin: "2rem 0" }}
      >
        <Title>Create New Short URL</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Organization *</Label>
            <select
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                fontSize: "1rem",
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
              placeholder="e.g. my-custom-link"
            />
          </InputGroup>
          <InputGroup>
            <Label>Title (optional)</Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My URL Title"
            />
          </InputGroup>
          <InputGroup>
            <Label>Description (optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="URL description"
              rows={3}
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
