import axios, { InternalAxiosRequestConfig } from 'axios';

const getBaseURL = () => {
	if (typeof window === 'undefined') {
		return 'http://localhost:8081';
	}

	return `${window.location.protocol}//${window.location.hostname}:8081`;
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
	async (config: InternalAxiosRequestConfig) => {
		if (typeof window === 'undefined') {
			// only server component
			try {
				const { cookies } = await import('next/headers');
				const cookieStore = await cookies();
				const token = cookieStore.get('ACCESS_TOKEN')?.value;

				if (token) {
					config.headers.Cookie = `ACCESS_TOKEN=${token}`;
				}
			} catch (error) {
				console.error('서버 사이드 쿠키 주입 실패:', error);
			}
		}
		return config;
	},
	(error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
	failedQueue.forEach((promise) => {
		if (error) promise.reject(error);
		else promise.resolve();
	});
	failedQueue = [];
};

// 응답 인터셉터 (선택)
axiosConfig.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// AccessToken 만료
		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				// 동시호출 방지
				// refresh 중이면 나머지 요청 대기
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				}).then(() => axiosConfig(originalRequest));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				await axiosConfig.post('/api/auth/refresh');

				processQueue(null); // refresh 끝난 뒤 한번에 재시도
				return axiosConfig(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError);
				// 로그아웃 처리
				window.location.href = '/login';
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);

		// const message =
		// 	error.response?.data?.message ??
		// 	error.message ??
		// 	'서버 오류가 발생했습니다.';
		//
		// return Promise.reject({
		// 	message,
		// 	status: error.response?.status,
		// });
	},
);

export default axiosConfig;
