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
	result: string;        // S / F
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

export const activityLogService = {
	getActivityLogs: (page = 0, size = 200) =>
		axiosConfig.get<PageResponse<ActivityLogResponseDto>>(`/api/activity-logs?page=${page}&size=${size}`),
};
