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

export interface SecurityLogFilter {
	loginId?: string;
	eventType?: string;
	ip?: string;
	fromDate?: string;
	toDate?: string;
}

const toQuery = (params: Record<string, any>) =>
	Object.entries(params)
		.filter(([, v]) => v !== '' && v != null)
		.map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
		.join('&');

export const securityLogService = {
	getSecurityLogs: (page = 0, size = 50, filter: SecurityLogFilter = {}) =>
		axiosConfig.get<PageResponse<SecurityLogResponseDto>>(
			`/api/security-logs?page=${page}&size=${size}&${toQuery(filter)}`,
		),

	getRecentLogins: (limit = 10) =>
		axiosConfig.get<SecurityLogResponseDto[]>(`/api/security-logs/recent-logins?limit=${limit}`),

	getMyLogins: (limit = 5) =>
		axiosConfig.get<SecurityLogResponseDto[]>(`/api/security-logs/my-logins?limit=${limit}`),
};
