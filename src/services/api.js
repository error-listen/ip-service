import axios from 'axios';

const api = axios.create({
    baseURL: 'https://ipservicelabsbackend.herokuapp.com/'
});

export default api;