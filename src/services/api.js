// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

let authToken = null;

export const setAuthToken = (token) => {
    authToken = token;
    if (token) {
        localStorage.setItem('authToken', token);
    } else {
        localStorage.removeItem('authToken');
    }
};

export const getAuthToken = () => authToken || localStorage.getItem('authToken');

async function request(endpoint, options = {}) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    console.log(`[API] ${options.method || 'GET'} ${endpoint}`, { headers });

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.error || `Erro ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`[API] Erro em ${endpoint}:`, error);
        throw error;
    }
}

export const api = {
    // Auth
    login: (email, password) => request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    }),

    register: (name, email, password, isAdmin = false) => request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, isAdmin }),
    }),

    // Exercícios
    getExercises: () => request('/exercises'),
    createExercise: (name, category) => request('/exercises', {
        method: 'POST',
        body: JSON.stringify({ name, category }),
    }),
    updateExercise: (id, name, category) => request(`/exercises/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name, category }),
    }),
    deleteExercise: (id) => request(`/exercises/${id}`, { method: 'DELETE' }),

    // Templates
    getTemplates: () => request('/templates'),
    createTemplate: (name, exercises) => request('/templates', {
        method: 'POST',
        body: JSON.stringify({ name, exercises }),
    }),
    updateTemplate: (id, name, exercises) => request(`/templates/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name, exercises }),
    }),
    deleteTemplate: (id) => request(`/templates/${id}`, { method: 'DELETE' }),

    // Rotina
    getRoutine: () => request('/routines'),
    updateRoutineDay: (dayOfWeek, templateId) => request('/routines', {
        method: 'POST',
        body: JSON.stringify({ day_of_week: dayOfWeek, template_id: templateId }),
    }),

    // Histórico
    getHistory: () => request('/history'),
    saveWorkout: (workoutData) => request('/history', {
        method: 'POST',
        body: JSON.stringify(workoutData),
    }),
    getWorkoutDetail: (id) => request(`/history/${id}`),
};