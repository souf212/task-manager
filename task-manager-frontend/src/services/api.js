import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Configuration d'axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
    (config) => {
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

// Services d'authentification
export const authService = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
    },
    getCurrentUser: () => {
        return {
            token: localStorage.getItem('token'),
            username: localStorage.getItem('username'),
            userId: localStorage.getItem('userId'),
        };
    },
    isAuthenticated: () => !!localStorage.getItem('token'),
};

// Services des tâches
export const taskService = {
    getAllTasks: () => api.get('/tasks'),
    createTask: (task) => api.post('/tasks', task),
    updateTask: (id, task) => api.put(`/tasks/${id}`, task),
    deleteTask: (id) => api.delete(`/tasks/${id}`),
    getTasksByStatus: (completed) => api.get(`/tasks/completed/${completed}`),
};

export default api;