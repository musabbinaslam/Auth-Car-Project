import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to attach token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add a response interceptor to handle token expiration
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});

export const getAllUsers = async () => {
    const res = await api.get('/admin/users');
    return res.data.data.users;
};

export const deleteUser = async (id) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
};

export const getAllCars = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const res = await api.get(`/cars?${params}`);
    return res.data.data.cars;
};

export const getCarById = async (id) => {
    const res = await api.get(`/cars/${id}`);
    return res.data.data.car;
};

export const createRental = async (rentalData) => {
    const res = await api.post('/rentals', rentalData);
    return res.data;
};

export const getUserRentals = async () => {
    const res = await api.get('/rentals/me');
    return res.data.data.rentals;
};

export const createCar = async (carData) => {
    const res = await api.post('/cars', carData);
    return res.data;
};

export const deleteCar = async (id) => {
    const res = await api.delete(`/cars/${id}`);
    return res.data;
};

export const getAllRentals = async () => {
    const res = await api.get('/rentals'); // Admin only
    return res.data.data.rentals;
};

export const cancelRental = async (id) => {
    const res = await api.put(`/rentals/cancel/${id}`);
    return res.data;
};

export const updateCar = async (id, carData) => {
    const res = await api.put(`/cars/${id}`, carData);
    return res.data;
};

export const createReview = async (reviewData) => {
    // reviewData should contain carId, rating, comment
    const { carId, ...data } = reviewData;
    const res = await api.post(`/reviews`, { ...data, car: carId });
    return res.data;
};
export const getReviewsByCarId = async (id) => {
    const res = await api.get(`/reviews/${id}`);
    return res.data.data.reviews;
};
export default api;
