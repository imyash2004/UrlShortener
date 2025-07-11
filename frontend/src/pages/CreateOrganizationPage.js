import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import organizationService from "../services/organizationService";
import styled from "styled-components";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 500px;
`;

const Title = styled.h2`
  color: white;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form``;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: white;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
`;

const CreateOrganizationPage = () => {
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
        navigate("/dashboard");
      } else {
        setError(response.data?.message || "Failed to create organization");
      }
    } catch (error) {
      console.error("Failed to create organization", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to create organization. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <Title>Create Your Organization</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Organization Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </InputGroup>
          <InputGroup>
            <Label>Short Name (for branding, e.g. acme)</Label>
            <Input
              type="text"
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              required
              maxLength={50}
              disabled={loading}
            />
          </InputGroup>
          <InputGroup>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </InputGroup>
          {error && (
            <div
              style={{
                color: "#ff4757",
                background: "rgba(255, 71, 87, 0.1)",
                border: "1px solid #ff4757",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Organization"}
          </Button>
        </Form>
      </FormContainer>
    </PageContainer>
  );
};

export default CreateOrganizationPage;
