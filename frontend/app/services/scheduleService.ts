import axiosConfig from '../_lib/axiosConfig';
import dayjs from 'dayjs';

import { workStatus, vacationType, dayName } from '@/type/types';
import { AttendanceApplicationResponseDto } from '@/app/services/attendanceApplicationService';
import { AttendanceDayResDto, AttendanceReqDto } from './attendanceService';

export interface CalendarRequestDto {
	memberIds: number[];
	scheduleType: string; // PERSONAL / DEPT
	date: string;
}

export interface CalendarEventDto {
	eventType: string; // SCHEDULE / VACATION / OUTSIDE / ATTENDANCE
	memberId: number;
	memberNm: string;
	deptNm: string;
	jobGrade: string;

	published: boolean;

	scheduleName: string;
	scheduleDesc: string;
	startTime: string;
	endTime: string;

	vacationed: boolean;
	vacationType: vacationType;

	remoted: boolean;
	workStatus: workStatus;

	detailData: AttendanceDayResDto;
}

export interface CalendarDayDto {
	scheduleType: string; // PERSONAL / DEPT
	date: string;
	isCurrentMonth: boolean;
	isHoliday: boolean;
	holidaySubject: string;
	events: CalendarEventDto[];
	applications: AttendanceApplicationResponseDto[];
}

export interface ScheduleController {
	scheduleName: string;
	scheduleDesc: string;
	startDate: dayjs.Dayjs;
	endDate: dayjs.Dayjs | null;
	startTime: dayjs.Dayjs | null;
	endTime: dayjs.Dayjs | null;
	published: string;
}

export interface ScheduleRequestDto {
	memberId: number;
	scheduleName: string;
	scheduleDesc: string;
	startDate: string;
	endDate: string | null;
	startTime: string | null;
	endTime: string | null;
	published: boolean;
}

// API 정의
export const scheduleService = {
	getUserMonthSchedules: (req: CalendarRequestDto) => axiosConfig.post<Record<dayName, CalendarDayDto>[]>('/api/schedule/user/month', req),
	createUserSchedule: (req: ScheduleRequestDto) => axiosConfig.post<Record<dayName, CalendarDayDto>[]>('/api/schedule/user/create', req),
};
