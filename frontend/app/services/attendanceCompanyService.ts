import { workStatus } from '@/type/types';
import axiosConfig from '../_lib/axiosConfig';
import { AttendanceDayResDto } from './attendanceService';

export interface AttendanceCompanyRequestDto {
	workDate: string | null;
	searchCategory?: string;
	searchText?: string;
	workStatus?: workStatus | null;
}

export interface AttendanceCompanyResponseDto {
	allCount: number;
	lateCount: number;
	earlyLeaveCount: number;
	absentCount: number;
	changeRequestCount: number;
	dayData: AttendanceDayResDto[];
}

// API 정의
export const attendancePolicyService = {
	getAttendanceCompanyOnedayData: (req: AttendanceCompanyRequestDto) => axiosConfig.post<AttendanceCompanyResponseDto>('/api/attendance/company/oneday', req),
};
