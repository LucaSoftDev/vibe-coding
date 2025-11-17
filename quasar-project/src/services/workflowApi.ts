import axios, { type AxiosInstance } from 'axios';

const baseURL = import.meta.env.VITE_JSON_SERVER_URL ?? 'http://localhost:3333';

export const workflowApi: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
