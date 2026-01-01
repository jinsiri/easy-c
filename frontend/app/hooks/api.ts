import axios from 'axios';

const getBaseURL = () => {
    if (typeof window !== 'undefined') {
        // 현재 프로토콜://호스트:8081 (포트만 고정)
        return `${window.location.protocol}//${window.location.hostname}:8081`;
    }
    return '';
};

const api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export { api };