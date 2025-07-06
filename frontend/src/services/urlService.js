import axios from "axios";
import authHeader from "./authHeader";
import config from "../config/config";

const API_URL = `${config.API_BASE_URL}${config.API_ENDPOINTS.URLS}`;

const getUrls = (organizationId) => {
  return axios
    .get(`${API_URL}/organization/${organizationId}`, {
      headers: authHeader(),
    })
    .then((response) => {
      // Return the data directly since the backend already returns ApiResponse
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching URLs:", error);
      throw error;
    });
};

const getMyUrls = (page = 0, size = 10) => {
  return axios
    .get(`${API_URL}/my-urls?page=${page}&size=${size}`, {
      headers: authHeader(),
    })
    .then((response) => response.data);
};

const getUrlDetails = (urlId) => {
  return axios
    .get(`${API_URL}/${urlId}`, { headers: authHeader() })
    .then((response) => response.data);
};

const createUrl = (data) => {
  return axios
    .post(API_URL, data, { headers: authHeader() })
    .then((response) => response.data);
};

const updateUrl = (urlId, data) => {
  return axios
    .put(`${API_URL}/${urlId}`, data, { headers: authHeader() })
    .then((response) => response.data);
};

const deleteUrl = (id) => {
  return axios
    .delete(`${API_URL}/${id}`, { headers: authHeader() })
    .then((response) => response.data);
};

const urlService = {
  getUrls,
  getMyUrls,
  getUrlDetails,
  createUrl,
  updateUrl,
  deleteUrl,
};

export default urlService;
