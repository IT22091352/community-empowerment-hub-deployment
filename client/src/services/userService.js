import { API_URL } from '../config/apiConfig';
import { createAuthenticatedAPI } from '../utils/api-helpers';

const USER_API_URL = `${API_URL}/user`;

// Create axios instance with auth header using our helper
const authAPI = createAuthenticatedAPI(USER_API_URL);

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await authAPI.get('/me');
    return response.data.user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await authAPI.put('/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Update password
export const updatePassword = async (passwordData) => {
  try {
    const response = await authAPI.put('/password', passwordData);
    return response.data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Deactivate account
export const deactivateAccount = async () => {
  try {
    const response = await authAPI.put('/deactivate');
    return response.data;
  } catch (error) {
    console.error('Error deactivating account:', error);
    throw error;
  }
};

// Upload profile image
export const uploadProfileImage = async (formData) => {
  try {
    const response = await authAPI.post('/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};
