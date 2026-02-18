import { Dayjs } from 'dayjs';
import axiosConfig from '../_lib/axiosConfig';
import { attendanceType, settlementPeriod, worktimeRule } from '@/type/types';

export interface AttendancePolicyRequestController {
	attendancePolicyName: string;
	attendancePolicyDesc: string;
	attendanceType: attendanceType;
	workDayOfWeek: string[];
	settlementPeriod: settlementPeriod;
	worktimeRule: worktimeRule;
	targetHour: string;
	targetMinute: string;
	startTime: Dayjs | null;
	endTime: Dayjs | null;
	coreStartTime: Dayjs | null;
	coreEndTime: Dayjs | null;
	halfLeaveStartTime: Dayjs | null;
	halfLeaveEndTime: Dayjs | null;
	allowMarginMinute: string;
}

export interface AttendancePolicyDto {
	attendancePolicyId: number | null;
	attendancePolicyName: string;
	attendancePolicyDesc: string;
	attendanceType: attendanceType;
	workDayOfWeek: string[];
	settlementPeriod: settlementPeriod;
	worktimeRule: worktimeRule;
	targetHour: string;
	targetMinute: string;
	startTime: string | null;
	endTime: string | null;
	coreStartTime: string | null;
	coreEndTime: string | null;
	halfLeaveStartTime: string | null;
	halfLeaveEndTime: string | null;
	allowMarginMinute: number;
	mappingUserCount: number;
}

// API 정의
export const attendancePolicyService = {
	getAttendancePolicyData: () => axiosConfig.get<AttendancePolicyDto[]>('/api/attendance/policy/all'),
	saveAttendancePolicyData: (req: AttendancePolicyDto) => axiosConfig.post<AttendancePolicyDto[]>('/api/attendance/policy/save', req),
	delteAttendancePolicyData: (id: string) => axiosConfig.delete<AttendancePolicyDto[]>(`/api/attendance/policy/delete?target=${id}`),
};
