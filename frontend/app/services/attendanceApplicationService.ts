import { Dayjs } from 'dayjs';
import axiosConfig from '../_lib/axiosConfig';
import { workStatus } from '@/type/types';
import { SearchRequestDto } from '@/type/interface';

export interface AttendanceApplicationController {
	workDate: Dayjs | null;
	isStartTime: boolean;
	isEndTime: boolean;
	startTime?: Dayjs | null;
	endTime?: Dayjs | null;
	workStatus: workStatus;
	violationReason: string;
	documentsAddress?: string | null;
}

export interface AttendanceApplicationRequestDto {
	memberId: number;
	//loginId: string;
	workDate: string;
	startTime?: string | null;
	endTime?: string | null;
	violationReason: string;
	documentsAddress?: string | null;
}

export interface AttendanceApplicationResponseDto {
	state: string;
	memberNm: string;
	workDate: string;
	type?: string | null;
	summary?: string | null;
	registerDate?: string | null;
	lastUpdateDate?: string | null;
}

// API 정의
export const attendanceApplicationService = {
	submitAttendanceApplication: (req: AttendanceApplicationRequestDto) => axiosConfig.post('/api/attendance/application/save', req),
	searchAttendanceApplication: (req: SearchRequestDto) => axiosConfig.post<AttendanceApplicationResponseDto[]>('/api/attendance/application/search', req),
};
