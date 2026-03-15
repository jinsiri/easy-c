import axiosConfig from '../_lib/axiosConfig';

export interface ActivityLogResponseDto {
	id: number;
	registerDate: string;
	loginId: string | null;
	memberNm: string | null;
	memberRole: string | null;
	actionCode: string;
	actionName: string;
	targetType: string | null;
	targetId: string | null;
	requestId: string | null;
	ip: string;
	userAgent: string | null;
	result: string;
	status: number | null;
	message: string | null;
}

export interface PageResponse<T> {
	content: T[];
	totalElements: number;
	totalPages: number;
	number: number;
	size: number;
}

export interface ActivityLogFilter {
	loginId?: string;
	actionCode?: string;
	result?: string;
	fromDate?: string;
	toDate?: string;
}

const toQuery = (params: Record<string, any>) =>
	Object.entries(params)
		.filter(([, v]) => v !== '' && v != null)
		.map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
		.join('&');

export const activityLogService = {
	getActivityLogs: (page = 0, size = 50, filter: ActivityLogFilter = {}) =>
		axiosConfig.get<PageResponse<ActivityLogResponseDto>>(
			`/api/activity-logs?page=${page}&size=${size}&${toQuery(filter)}`,
		),
};
