import axiosConfig from '../_lib/axiosConfig';

export interface SecurityLogResponseDto {
	id: number;
	registerDate: string;
	eventType: 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'ACCESS_DENIED';
	loginId: string | null;
	ip: string;
	userAgent: string | null;
	deviceType: string | null;
	uri: string | null;
	detail: string | null;
	requestId: string | null;
}

export interface PageResponse<T> {
	content: T[];
	totalElements: number;
	totalPages: number;
	number: number;
	size: number;
}

export const securityLogService = {
	getSecurityLogs: (page = 0, size = 200) =>
		axiosConfig.get<PageResponse<SecurityLogResponseDto>>(`/api/security-logs?page=${page}&size=${size}`),

	getRecentLogins: (limit = 10) =>
		axiosConfig.get<SecurityLogResponseDto[]>(`/api/security-logs/recent-logins?limit=${limit}`),

	getMyLogins: (limit = 5) =>
		axiosConfig.get<SecurityLogResponseDto[]>(`/api/security-logs/my-logins?limit=${limit}`),
};
