import { Dayjs } from 'dayjs';
import axiosConfig from '../_lib/axiosConfig';

export interface AttendanceRequestController {
	workDate: Dayjs | null;
	startTime: Dayjs | null;
	endTime: Dayjs | null;
	violationReason: string;
	documentsAddress: string;
}

interface SaveAttendanceChangeRequestDto {
	memberId: number;
	workDate: string;
	startTime?: string | null;
	endTime?: string | null;
	violationReason: string;
	documentsAddress?: string;
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
