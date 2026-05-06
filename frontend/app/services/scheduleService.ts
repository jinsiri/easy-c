import axiosConfig from '../_lib/axiosConfig';
import dayjs from 'dayjs';

import { dayName, scheduleType } from '@/type/types';
import { AttendanceApplicationResponseDto } from '@/app/services/attendanceApplicationService';
import { AttendanceDayResDto } from './attendanceService';
import { vacationApplicationDto } from './vacationApplicationService';

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
	scheduleId: number | null;
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

export interface ScheduleDto {
	scheduleId: number | null;
	memberId: number;
	memberNm: string;
	deptNm: string;
	jobGrade: string;

	scheduleName: string;
	startDate: string;
	startTime: string | null;
	endDate: string | null;
	endTime: string | null;

	scheduleType: scheduleType;
	published: boolean;
	scheduleDesc: string;
}

export interface CalendarRequestDto {
	memberIds: number[];
	calendarType?: string; // PERSONAL / DEPT
	date: string;
}

export interface CalendarEventDto {
	eventType: string; // SCHEDULE / VACATION
	memberId: number;
	memberNm: string;
	deptNm: string;
	jobGrade: string;

	groupId: string;
	startDate: string;
	endDate: string;

	vacationData: vacationApplicationDto;
	scheduleData: ScheduleDto;

	line: number; // 프론트에서만 사용
}

export interface CalendarDayDto {
	scheduleType: string; // PERSONAL / DEPT
	date: string;
	isCurrentMonth: boolean;
	isHoliday: boolean;
	holidaySubject: string;
	attendance: AttendanceDayResDto;
	events: CalendarEventDto[];
	applications: AttendanceApplicationResponseDto[];
}

// API 정의
export const scheduleService = {
	getUserSchedule: (id: number) => axiosConfig.get<ScheduleDto>(`/api/schedule/user?id=${id}`),
	getUserTodaySchedule: (req: CalendarRequestDto) => axiosConfig.post<ScheduleDto[]>(`/api/schedule/user/today`, req),
	getUserMonthSchedules: (req: CalendarRequestDto) => axiosConfig.post<Record<dayName, CalendarDayDto>[]>('/api/schedule/user/month', req),
	createUserSchedule: (req: ScheduleRequestDto) => axiosConfig.post<Record<dayName, CalendarDayDto>[]>('/api/schedule/user/create', req),
	deleteUserSchedule: (id: number) => axiosConfig.delete<void>(`/api/schedule/user/delete?id=${id}`),
};
