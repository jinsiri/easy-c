import axios, { AxiosRequestConfig } from 'axios';

// 인터셉터가 response.data를 반환하므로 타입 오버라이드
export interface ApiClient {
	get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
	post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
	put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
	patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
	delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

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

// API 응답 타입 정의
export interface ApiResponse<T = any> {
	status: string;
	result: 'S' | 'F';
	message: string;
	timestamp: string;
	data: T;
	exception: any | null;
}

// 응답 인터셉터 - ApiResponse 언래핑
axiosConfig.interceptors.response.use(
	(response) => {
		const apiResponse = response.data;

		// ApiResponse 구조인지 확인 (status, result, data 필드가 있는 경우)
		const isApiResponse = apiResponse && typeof apiResponse === 'object' && 'result' in apiResponse && 'status' in apiResponse && 'data' in apiResponse;

		if (isApiResponse) {
			// 실패 응답 처리
			if (apiResponse.result === 'F') {
				return Promise.reject({
					message: apiResponse.message,
					status: apiResponse.status,
					exception: apiResponse.exception,
				});
			}
			// 성공 응답: data 필드를 response.data로 설정
			response.data = apiResponse.data;
		}

		// 항상 response.data 반환 (ApiResponse면 언래핑된 data, 아니면 원본 data)
		return response.data;
	},
	async (error) => {
		const originalRequest = error.config;
		const status = error.response?.status;
		const apiResponse = error.response?.data;

		// AccessToken 만료
		if (status === 401 && !error.config._retry) {
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

		// 서버가 ApiResponse 내려준 경우
		if (apiResponse?.message) {
			return Promise.reject({
				message: apiResponse.message,
				status,
				exception: apiResponse.exception ?? null,
			});
		}

		// 그 외 (네트워크, 서버 다운 등)
		return Promise.reject({
			message: error.message ?? '서버 오류가 발생했습니다.',
			status,
		});

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

export default axiosConfig as ApiClient;
