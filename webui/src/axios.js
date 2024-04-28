import axios from 'axios';

// Create a custom Axios instance with the base URL pointing to your Flask server
const instance = axios.create({
    baseURL: 'https://localhost:5000',
});

export default instance;