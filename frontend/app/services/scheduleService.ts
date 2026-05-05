import axiosConfig from '../_lib/axiosConfig';
import dayjs from 'dayjs';

import { dayName, scheduleType } from '@/type/types';
import { AttendanceApplicationResponseDto } from '@/app/services/attendanceApplicationService';
import { AttendanceDayResDto } from './attendanceService';
import { vacationApplicationDto } from './vacationApplicationService';

export interface CalendarRequestDto {
	memberIds: number[];
	scheduleType: string; // PERSONAL / DEPT
	date: string;
}

export interface CalendarEventDto {
	eventType: string; // SCHEDULE / VACATION / ATTENDANCE
	memberId: number;
	memberNm: string;
	deptNm: string;
	jobGrade: string;

	groupId: string;
	startDate: string;
	endDate: string;
	published: boolean;

	scheduleName: string;
	scheduleDesc: string;
	startTime: string;
	endTime: string;
	scheduleType: scheduleType;
	//detailData: AttendanceDayResDto;
	vacationData: vacationApplicationDto;
}

export interface CalendarDayDto {
	scheduleType: string; // PERSONAL / DEPT
	date: string;
	isCurrentMonth: boolean;
	isHoliday: boolean;
	holidaySubject: string;
	attendances: AttendanceDayResDto[];
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
	scheduleType: scheduleType;
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
	scheduleType: scheduleType;
	published: boolean;
}

// API 정의
export const scheduleService = {
	getUserMonthSchedules: (req: CalendarRequestDto) => axiosConfig.post<Record<dayName, CalendarDayDto>[]>('/api/schedule/user/month', req),
	createUserSchedule: (req: ScheduleRequestDto) => axiosConfig.post<Record<dayName, CalendarDayDto>[]>('/api/schedule/user/create', req),
};
