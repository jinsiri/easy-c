import { api } from '../hooks/api';

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
    getPublicKey: () => api.get<string>('/api/auth/public-key'),
    login: (data: LoginRequestDto) => api.post<LoginResponseDto>('/api/auth/login', data),
    logout: () => api.post('/api/auth/logout'),
};