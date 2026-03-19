import axiosConfig from '../_lib/axiosConfig';
import { AttendanceDayResDto } from './attendanceService';
import { PageRequest, PageResponse } from '@/type/interface';

export interface AttendanceCompanyRequestDto {
	workDate: string | null;
	searchCategory?: string;
	searchValue?: string;
}

export interface AttendanceCompanyResponseDto {
	allCount: number;
	lateCount: number;
	earlyLeaveCount: number;
	absentCount: number;
	changeRequestCount: number;
	dayData: AttendanceDayResDto[];
}

export interface AttendanceCompanySearchRequestDto {
	startDate?: string | null;
	endDate?: string | null;
	deptNm?: string;
	memberNm?: string;
	workType?: string;
	workStatus?: string;
}

export interface AttendanceCompanySearchResponseDto {
	allCount: number;
	lateCount: number;
	earlyLeaveCount: number;
	absentCount: number;
	changeRequestCount: number;
	dayData: PageResponse<AttendanceDayResDto>;
}

// API 정의
export const attendanceCompanyService = {
	searchVacationApplication: (request: PageRequest<AttendanceCompanySearchRequestDto>) =>
		axiosConfig.post<AttendanceCompanySearchResponseDto>('/api/attendance/company/search/static', request),
};
