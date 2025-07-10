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

const CreateOrganizationModal = ({
  onClose,
  onOrganizationCreated,
  isRequired = false,
}) => {
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await organizationService.createOrganization({
        name,
        shortName,
        description,
      });

      if (response.data && response.data.success) {
        onOrganizationCreated(response.data.data);
      } else {
        setError(response.data?.message || "Failed to create organization");
      }
    } catch (error) {
      console.error("Failed to create organization", error);
      setError(
        error.response?.data?.message ||
          "Failed to create organization. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!isRequired) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>Create Your Organization</Title>
        <p
          style={{
            marginBottom: "1.5rem",
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "0.9rem",
            textAlign: "center",
          }}
        >
          {isRequired
            ? "You need to create an organization to get started with URL shortening."
            : "Create a new organization to manage your URLs."}
        </p>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Organization Name *</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter organization name"
              disabled={loading}
            />
          </InputGroup>
          <InputGroup>
            <Label>Short Name *</Label>
            <Input
              type="text"
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              required
              placeholder="e.g. acme"
              disabled={loading}
            />
          </InputGroup>
          <InputGroup>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter organization description (optional)"
              disabled={loading}
              rows={3}
            />
          </InputGroup>

          {error && (
            <div
              style={{
                color: "#ff4757",
                marginBottom: "1rem",
                padding: "0.5rem",
                background: "#ffe6e6",
                borderRadius: "4px",
                fontSize: "0.9rem",
              }}
            >
              {error}
            </div>
          )}

          <ButtonGroup>
            {!isRequired && (
              <CancelButton type="button" onClick={onClose} disabled={loading}>
                Cancel
              </CancelButton>
            )}
            <CreateButton type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Organization"}
            </CreateButton>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreateOrganizationModal;
