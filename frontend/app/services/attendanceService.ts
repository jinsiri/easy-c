import axiosConfig from '../_lib/axiosConfig';
import { workType, workStatus, vacationType, dayName } from '@/type/types';

export interface AttendanceReqDto {
	loginId: string;
	workDate: string;
}

export interface AttendanceSaveReqDto {
	attendanceId?: number | null | undefined;
	loginId: string;
	startTime?: string;
	endTime?: string;
}

export interface AttendanceDayResDto {
	attendanceId: number | null;
	memberId?: number;
	memberNm?: string;
	deptNm?: string | null;
	jobGrade?: string | null;
	attendancePolicyName?: string;

	workDate: string | null;
	startTime?: string | null;
	endTime?: string | null;
	fullTime?: number | null;
	overTime?: number | null;
	workType?: workType;
	workStatus?: workStatus;
	vacationType?: vacationType;
	changeRequestId?: number;
	detail?: string;
}

export interface AttendanceResDto {
	dayData: AttendanceDayResDto;

	attendanceType: string;
	settlementPeriod: string;
	worktimeRule: string;
	startTime: string;
	endTime: string;

	maxPolicyWorkTime: number;
	policyWorkDay: number;
	policyWorkTime: number;
	effectiveWorkDay: number;
	effectiveWorkTime: number;
	workDay: number;
	workTime: number;
	vacationTime: number;
}

export interface CalendarData {
	year: number;
	month: number;
	day: number;
	isCurrentMonth: boolean;
	isHoliday: boolean;
	holidaySubject?: string;
	defaultStartTime?: string | null;
	defaultEndTime?: string | null;
	detailData: AttendanceDayResDto;
}

// API 정의
export const attendanceService = {
	getAttendanceTodayData: (req: AttendanceReqDto) => axiosConfig.post<AttendanceResDto>('/api/attendance/today', req),
	getAttendanceCalendarData: (req: AttendanceReqDto) => axiosConfig.post<Record<dayName, CalendarData>[]>('/api/attendance/calendar', req),
	startTimeAttendanceData: (req: AttendanceSaveReqDto) => axiosConfig.post<void>('/api/attendance/start', req),
	finishTimeAttendanceData: (req: AttendanceSaveReqDto) => axiosConfig.post<void>('/api/attendance/finish', req),
};
