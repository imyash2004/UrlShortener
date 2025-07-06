import axios from 'axios';
import config from '../config/config';

const API_URL = `${config.API_BASE_URL}${config.API_ENDPOINTS.AUTH}`;

const signup = (firstName, lastName, email, password) => {
  return axios.post(`${API_URL}/signup`, {
    firstName,
    lastName,
    email,
    password,
  });
};

const signin = (email, password) => {
  return axios
    .post(`${API_URL}/signin`, {
      email,
      password,
    })
    .then((response) => {
      if (response.data.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data.data;
    });
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authService = {
  signup,
  signin,
  logout,
  getCurrentUser,
};

export default authService;
