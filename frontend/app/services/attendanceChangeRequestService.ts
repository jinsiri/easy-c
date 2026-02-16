import { Dayjs } from 'dayjs';
import axiosConfig from '../_lib/axiosConfig';
import { workStatus } from '@/type/types';

export interface AttendanceRequestController {
	workDate: Dayjs | null;
	isStartTime: boolean;
	isEndTime: boolean;
	startTime?: Dayjs | null;
	endTime?: Dayjs | null;
	workStatus: workStatus;
	violationReason: string;
	documentsAddress?: string | null;
}

interface SaveAttendanceChangeRequestDto {
	loginId: string;
	workDate: string;
	startTime?: string | null;
	endTime?: string | null;
	violationReason: string;
	documentsAddress?: string | null;
}

interface AttendanceChangeRequestResponseDto {
	state: string;
	memberNm: string;
	workDate: string;
	type?: string | null;
	summary?: string | null;
	registerDate?: string | null;
	lastUpdateDate?: string | null;
}

// API 정의
export const attendanceChangeRequestService = {
	submitWorkRequest: (req: SaveAttendanceChangeRequestDto) => axiosConfig.post('/api/attendance/change-request/save', req),
	getWorkRequestData: () => axiosConfig.get<AttendanceChangeRequestResponseDto[]>('/api/attendance/change-request/all'),
};
