import { workType, workStatus, vacationType } from '@/type/types';

export interface attendanceReqInterface {
	memberId: number;
	workDate: string;
}

export interface attendanceSaveReqInterface {
	memberId: number;
	startTime?: string;
	endTime?: string;
	registerLatitude?: number | null;
	registerLongitude?: number | null;
}

export interface AttendanceDayResInterface {
	attendanceId: number | null;
	workDate: Date | null;
	startTime?: Date | null;
	endTime?: Date | null;
	fullTime?: number | null;
	overTime?: number | null;
	workType?: workType;
	workStatus?: workStatus;
	vacationType?: vacationType;
	detail?: string;
}

export interface AttendanceResInterface {
	dayData: AttendanceDayResInterface;

	attendanceType: string;
	settlementPeriod: string;
	worktimeRule: string;
	startTime: Date;
	endTime: Date;

	maxPolicyWorkTime: number;
	policyWorkDay: number;
	policyWorkTime: number;
	effectiveWorkDay: number;
	effectiveWorkTime: number;
	workDay: number;
	workTime: number;
	vacationTime: number;
}
