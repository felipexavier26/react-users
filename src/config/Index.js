import axios from "axios";

const BackEnd = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/users',
});
export default BackEnd; 