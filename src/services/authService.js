const API_URL = 'http://localhost:5000/api/auth';

// Register new user
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return await response.json();
};

// Login user
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return await response.json();
};

// Store token
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Get token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('token');
};
