import axios from 'axios';
import { RegistrationData, LoginData, LoginResponse } from '../types/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from './NavigationService';

// Pastikan backend Anda berjalan di alamat ini
import { API_URL } from '../config';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await AsyncStorage.removeItem('userToken');
      if (navigationRef.current) {
        navigationRef.current.navigate('Login' as never);
      }
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  name: string;
  email: string;
  profile: {
    name: string;
    bio: string;
    location: string;
    birth_date: string;
    age: number;
    profile_picture_url?: string;
  };
}

export const getRecommendedUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('/users/recommended');
    // console.error('API response:', response.data);
    return response.data.data; // Laravel membungkus data dalam properti `data`
  } catch (error) {
    console.error('Failed to fetch recommended users:', error);
    throw error;
  }
};

export const registerUser = async (userData: RegistrationData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    console.error('Failed to register user:', error);
    throw error;
  }
};

export const loginUser = async (userData: LoginData): Promise<LoginResponse> => {
  try {
    const response = await api.post('/login', userData);
    return response.data;
  } catch (error) {
    console.error('Failed to login user:', error);
    throw error;
  }
};

export const userAction = async (userId: number, action: 'like' | 'dislike') => {
  try {
    const response = await api.get(`/users/${userId}/action?action=${action}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to ${action} user ${userId}:`, error);
    throw error;
  }
}

export const getMyDataByCategory = async (category: 'liked' | 'disliked' | 'liked_me'): Promise<User[]> => {
  try {
    const response = await api.get('/users/mycategories', {
      headers: {
        name: category,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch users for category ${category}:`, error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await api.get('/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null; // Return null if profile is not found
    }
    throw error; // Re-throw other errors
  }
};

export const updateProfile = async (data: { name: string; bio: string; location: string; birth_date: string; picture?: string }) => {
  const token = await AsyncStorage.getItem('userToken');
  const formData = new FormData();

  Object.keys(data).forEach(key => {
    const value = data[key as keyof typeof data];
    if (key === 'picture' && value) {
      formData.append('picture', {
        uri: value,
        name: `photo.jpg`,
        type: `image/jpeg`,
      } as any);
    } else if (value !== undefined) {
      formData.append(key, value as string);
    }
  });

  const response = await api.post('/profile', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadAdditionalPicture = async (pictureUri: string) => {
  const token = await AsyncStorage.getItem('userToken');
  const formData = new FormData();

  formData.append('picture', {
    uri: pictureUri,
    name: `photo.jpg`,
    type: `image/jpeg`,
  } as any);

  const response = await api.post('/pictures', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const deletePicture = async (pictureId: number) => {
  const token = await AsyncStorage.getItem('userToken');
  const response = await api.delete(`/pictures/${pictureId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getMatches = async () => {
  const token = await AsyncStorage.getItem('userToken');
  const response = await api.get('/matches', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getChats = async () => {
  const token = await AsyncStorage.getItem('userToken');
  const response = await api.get('/chats', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getMessages = async (chatId: number) => {
  const token = await AsyncStorage.getItem('userToken');
  const response = await api.get(`/chats/${chatId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const sendMessage = async (chatId: number, content: string) => {
  const token = await AsyncStorage.getItem('userToken');
  const response = await api.post(`/chats/${chatId}/messages`, { content }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};



export default api;