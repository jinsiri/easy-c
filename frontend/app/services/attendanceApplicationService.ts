import { Dayjs } from 'dayjs';
import axiosConfig from '../_lib/axiosConfig';

/** TYPE & INTERFACE */
import { workStatus, baseStatus } from '@/type/types';
import { SearchRequestDto } from '@/type/interface';
import { BaseDto } from '@/type/base';
import { AttendanceReqDto } from '@/app/services/attendanceService';

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
	workDate: string;
	startTime?: string | null;
	endTime?: string | null;
	violationReason: string;
	documentsAddress?: string | null;
}

export interface AttendanceApplicationResponseDto extends BaseDto {
	attendanceApplicationId: number;
	memberId: number;
	memberNm: string;
	deptNm: string;
	jobGrade: string;
	workDate: string;
	workStatus: workStatus;
	startTime: string;
	endTime: string;
	violationReason: string;
	documentsAddress: string;
	status: baseStatus;
	summary: string;
}

// API 정의
export const attendanceApplicationService = {
	getUserAttendanceApplication: (req: AttendanceReqDto) => axiosConfig.post<AttendanceApplicationResponseDto>('/api/attendance/application/user', req),
	submitAttendanceApplication: (req: AttendanceApplicationRequestDto) => axiosConfig.post('/api/attendance/application/save', req),
	searchAttendanceApplication: (req: SearchRequestDto) => axiosConfig.post<AttendanceApplicationResponseDto[]>('/api/attendance/application/search', req),
	approveAttendanceApplication: (req: AttendanceApplicationResponseDto) => axiosConfig.post<void>('/api/attendance/application/approve', req),
	rejectAttendanceApplication: (req: AttendanceApplicationResponseDto) => axiosConfig.post<void>('/api/attendance/application/reject', req),
};
