import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for the auth service
const API_URL = 'http://10.0.2.2:3000/api/auth'; // Using 10.0.2.2 for Android emulator to access localhost

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service for authentication
const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // Send verification email
  sendVerificationEmail: async (email) => {
    try {
      const response = await api.post('/send-verification-email', { email });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // Verify email with code
  verifyEmail: async (email, code) => {
    try {
      const response = await api.post('/verify-email', { email, code });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      if (response.data.user) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // Logout user
  logout: async () => {
    await AsyncStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: async () => {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService; 