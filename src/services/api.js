const resolveApiBase = () => {
    if (process.env.VUE_APP_API_URL) return process.env.VUE_APP_API_URL;
    if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        if (host === 'localhost' || host === '127.0.0.1') {
            return 'http://localhost:4000/api';
        }
    }
    return '/api';
};

export const API_BASE = resolveApiBase();

const request = async (path, options = {}) => {
    const response = await fetch(`${API_BASE}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    });

    const text = await response.text();
    let data = {};
    if (text) {
        try {
            data = JSON.parse(text);
        } catch (error) {
            data = { message: text };
        }
    }

    if (!response.ok) {
        const message = data && data.message ? data.message : 'Request failed';
        throw new Error(message);
    }

    return data;
};

const requestForm = async (path, formData, token) => {
    const response = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
    });

    const text = await response.text();
    let data = {};
    if (text) {
        try {
            data = JSON.parse(text);
        } catch (error) {
            data = { message: text };
        }
    }

    if (!response.ok) {
        const message = data && data.message ? data.message : 'Request failed';
        throw new Error(message);
    }

    return data;
};

export const authApi = {
    login(payload) {
        return request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    },
    register(payload) {
        return request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    },
    updateProfile(payload, token) {
        return request('/auth/me', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
    },
    uploadAvatar(file, token) {
        const formData = new FormData();
        formData.append('avatar', file);
        return requestForm('/auth/avatar', formData, token);
    },
    me(token) {
        return request('/auth/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
};
