import axios from 'axios';
import { useSessionExpired } from '@/app/hooks/useSessionExpired';
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BE_HOST,

    headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'vi',
    },
})

axiosInstance.interceptors.request.use(
    (config) => {
        if (config.url?.includes('/login')) {
            return config;
        }

        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401 && error.response.data.message === 'Token đã hết hạn') {
            useSessionExpired.getState().showSessionExpiredModal();
        }
        return Promise.reject(error.response.data);
    }
);

export const get = (path: string, params?: Record<string, any>) => {
    return axiosInstance.get(path, { params });
};

export const post = (path: string, body: object, params?: Record<string, any>) => {
    return axiosInstance.post(path, body, { params });
};
export const put = (path: string, body: object, params?: Record<string, any>) => {
    return axiosInstance.put(path, body, { params });
};

export const del = (path: string, params?: Record<string, any>) => {
    return axiosInstance.delete(path, { params });
};