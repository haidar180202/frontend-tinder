import axios from 'axios';

// Pastikan backend Anda berjalan di alamat ini
const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    // Jika Anda sudah implementasi autentikasi, token bisa ditambahkan di sini
    // 'Authorization': `Bearer ${your_token}`
  },
});

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
    const response = await api.get('/users/recommendations');
    return response.data.data; // Laravel membungkus data dalam properti `data`
  } catch (error) {
    console.error('Failed to fetch recommended users:', error);
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