import axios from 'axios';

const getBaseURL = () => {
	if (typeof window !== 'undefined') {
		// 현재 프로토콜://호스트:8081 (포트만 고정)
		return `${window.location.protocol}//${window.location.hostname}:8081`;
	}
	return '';
};

const axiosConfig = axios.create({
	baseURL: getBaseURL(),
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

// 요청 인터셉터 (선택)
axiosConfig.interceptors.request.use(
	(config) => {
		// 예: 토큰 추가
		// const token = localStorage.getItem('token');
		// if (token) config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => Promise.reject(error),
);

// 응답 인터셉터 (선택)
axiosConfig.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error('Axios 에러:', error);
		return Promise.reject(error);
	},
);

export default axiosConfig;
