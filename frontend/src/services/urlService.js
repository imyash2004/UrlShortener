import axios from "axios";
import authHeader from "./authHeader";

const API_URL = "http://localhost:8080/api";

const getUrls = (organizationId) => {
  return axios.get(`${API_URL}/urls/organization/${organizationId}`, {
    headers: authHeader(),
  });
};

const getMyUrls = (page = 0, size = 10) => {
  return axios
    .get(`${API_URL}/urls/my-urls?page=${page}&size=${size}`, {
      headers: authHeader(),
    })
    .then((response) => response.data);
};

const getUrlDetails = (urlId) => {
  return axios
    .get(`${API_URL}/urls/${urlId}`, { headers: authHeader() })
    .then((response) => response.data);
};

const createUrl = (data) => {
  return axios
    .post(`${API_URL}/urls`, data, { headers: authHeader() })
    .then((response) => response.data);
};

const updateUrl = (urlId, data) => {
  return axios
    .put(`${API_URL}/urls/${urlId}`, data, { headers: authHeader() })
    .then((response) => response.data);
};

const deleteUrl = (id) => {
  return axios
    .delete(`${API_URL}/urls/${id}`, { headers: authHeader() })
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
