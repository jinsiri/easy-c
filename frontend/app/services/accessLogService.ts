import axiosConfig from '../_lib/axiosConfig';

export interface AccessLogResponseDto {
	id: number;
	registerDate: string;
	loginId: string | null;
	memberNm: string | null;
	memberRole: string | null;
	method: string;
	uri: string;
	queryString: string | null;
	ip: string;
	userAgent: string | null;
	deviceType: string;
	status: number;
	durationMs: number;
	success: boolean;
}

export interface PageResponse<T> {
	content: T[];
	totalElements: number;
	totalPages: number;
	number: number;
	size: number;
}

export const accessLogService = {
	getAccessLogs: (page = 0, size = 200) =>
		axiosConfig.get<PageResponse<AccessLogResponseDto>>(`/api/access-logs?page=${page}&size=${size}`),
};
