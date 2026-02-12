import { Dayjs } from 'dayjs';
import axiosConfig from '../_lib/axiosConfig';
import { attendanceType, settlementPeriod, worktimeRule } from '@/type/types';

export interface AttendancePolicyResDto {
	attendancePolicyId: number;
	attendancePolicyName: string;
	attendancePolicyDesc: string;
	attendanceType: attendanceType;
	settlementPeriod: settlementPeriod;
	worktimeRule: worktimeRule;
	workingTimeDay: number;
	workingDay: string;
	startTime: Dayjs | null;
	endTime: Dayjs | null;
	halfLeaveStartTime: Dayjs | null;
	halfLeaveEndTime: Dayjs | null;
	coreStartTime: Dayjs | null;
	coreEndTime: Dayjs | null;
	allowMarginMinute: number;
}

// API 정의
export const attendancePolicyService = {
	getAttendancePolicyData: () => axiosConfig.get<AttendancePolicyResDto[]>('/api/attendance/policy/all'),
};
