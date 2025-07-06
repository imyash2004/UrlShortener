import axios from "axios";
import authHeader from "./authHeader";
import config from "../config/config";

const API_URL = `${config.API_BASE_URL}${config.API_ENDPOINTS.ORGANIZATIONS}`;

const createOrganization = (data) => {
  return axios.post(API_URL, data, { headers: authHeader() });
};

const getUserOrganizations = () => {
  return axios
    .get(API_URL, {
      headers: authHeader(),
    })
    .then((response) => response.data);
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
