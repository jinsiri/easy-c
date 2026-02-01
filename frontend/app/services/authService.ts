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
// 인터셉터가 response.data를 반환하므로 실제 반환 타입은 data 타입
export const authService = {
	getPublicKey: (): Promise<string> => axiosConfig.get('/api/auth/public-key') as any,
	login: (data: LoginRequestDto): Promise<LoginResponseDto> => axiosConfig.post('/api/auth/login', data) as any,
	logout: () => axiosConfig.post('/api/auth/logout'),
};
