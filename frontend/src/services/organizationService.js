import axios from 'axios';
import authHeader from './authHeader';

const API_URL = 'http://localhost:8080/api/organizations';

const createOrganization = (data) => {
  return axios.post(API_URL, data, { headers: authHeader() });
};

const getUserOrganizations = () => {
  return axios.get(API_URL, {
    headers: authHeader(),
  }).then(response => response.data);
};

const getOrganizationById = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
};

const updateOrganization = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data, { headers: authHeader() });
};

const deleteOrganization = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
};

const organizationService = {
  createOrganization,
  getUserOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
};

export default organizationService;
