import axiosConfig from '../_lib/axiosConfig';

// 로그인, 인증, 토큰 관련 API
interface LoginRequestDto {
	loginId: string;
	encryptedPassword: string;
}

interface LoginResponseDto {
	token: string;
	user: {
		id: string;
		name: string;
	};
}

// API 정의
export const authService = {
	getPublicKey: () => axiosConfig.get<string>('/api/auth/public-key'),
	login: (data: LoginRequestDto) => axiosConfig.post<LoginResponseDto>('/api/auth/login', data),
	logout: () => axiosConfig.get('/api/auth/logout'),
};
