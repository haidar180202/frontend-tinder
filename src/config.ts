import { API_URL as ENV_API_URL } from "@env";

const API_BASE_URL = ENV_API_URL || 'http://192.168.18.27:8000/api';

export const API_URL = API_BASE_URL;
export const ASSET_URL = API_BASE_URL.replace('/api', '');