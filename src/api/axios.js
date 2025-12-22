import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('ecosync_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only redirect on 401 if NOT on auth endpoints (login/register should show error, not redirect)
        const isAuthEndpoint = error.config?.url?.includes('/auth/login') || 
                               error.config?.url?.includes('/auth/register');
        
        if (error.response?.status === 401 && !isAuthEndpoint) {
            // Token expired or invalid - only redirect for protected routes
            localStorage.removeItem('ecosync_token');
            localStorage.removeItem('ecosync_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data)
};

// Pickups API
export const pickupsAPI = {
    getAll: (params) => api.get('/pickups', { params }),
    getStats: () => api.get('/pickups/stats'),
    create: (data) => api.post('/pickups', data),
    update: (id, data) => api.put(`/pickups/${id}`, data),
    cancel: (id) => api.delete(`/pickups/${id}`)
};

// Admin API
export const adminAPI = {
    // Stats
    getStats: () => api.get('/admin/stats'),
    
    // Users
    getUsers: (params) => api.get('/admin/users', { params }),
    getUser: (id) => api.get(`/admin/users/${id}`),
    updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    
    // Pickups
    getPickups: (params) => api.get('/admin/pickups', { params }),
    updatePickup: (id, data) => api.put(`/admin/pickups/${id}`, data),
    deletePickup: (id) => api.delete(`/admin/pickups/${id}`)
};

// Notifications API
export const notificationsAPI = {
    getAll: (params) => api.get('/notifications', { params }),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
    delete: (id) => api.delete(`/notifications/${id}`)
};

// Site Settings API
export const siteSettingsAPI = {
    get: () => api.get('/settings'),
    update: (data) => api.put('/settings', data),
    updateImpactStats: (data) => api.put('/settings/impact-stats', data)
};

export default api;
