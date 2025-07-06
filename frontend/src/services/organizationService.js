import axios from "axios";
import authHeader from "./authHeader";
import config from "../config/config";

const API_URL = `${config.API_BASE_URL}${config.API_ENDPOINTS.ORGANIZATIONS}`;

const createOrganization = (data) => {
  return axios.post(API_URL, data, { headers: authHeader() });
};

const getUserOrganizations = (
  page = 0,
  size = 10,
  sortBy = "createdAt",
  sortDir = "desc"
) => {
  return axios
    .get(
      `${API_URL}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
      {
        headers: authHeader(),
      }
    )
    .then((response) => {
      // Return the data directly since the backend already returns ApiResponse
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching organizations:", error);
      throw error;
    });
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
