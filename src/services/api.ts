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
    age: number;
    // Tambahkan properti lain dari profil jika ada
  };
  pictures: {
    id: number;
    url: string;
    sequence: number;
  }[];
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

export const likeUser = async (userId: number): Promise<any> => {
  try {
    const response = await api.post(`/users/${userId}/like`);
    return response.data;
  } catch (error) {
    console.error(`Failed to like user ${userId}:`, error);
    throw error;
  }
};

export const dislikeUser = async (userId: number): Promise<any> => {
  try {
    const response = await api.post(`/users/${userId}/dislike`);
    return response.data;
  } catch (error) {
    console.error(`Failed to dislike user ${userId}:`, error);
    throw error;
  }
};

export default api;