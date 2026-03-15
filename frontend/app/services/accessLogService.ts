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

export interface AccessLogFilter {
	loginId?: string;
	method?: string;
	uri?: string;
	status?: string;
	deviceType?: string;
	fromDate?: string;
	toDate?: string;
}

const toQuery = (params: Record<string, any>) =>
	Object.entries(params)
		.filter(([, v]) => v !== '' && v != null)
		.map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
		.join('&');

export const accessLogService = {
	getAccessLogs: (page = 0, size = 50, filter: AccessLogFilter = {}) =>
		axiosConfig.get<PageResponse<AccessLogResponseDto>>(
			`/api/access-logs?page=${page}&size=${size}&${toQuery(filter)}`,
		),
};
