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
	attendanceId?: number | null;
	startTime?: Date | null;
	endTime?: Date | null;
	fullTime?: number | null;
	overTime?: number | null;
	workStatus?: string;
	vacation?: string;
	detail?: string;
	confirm?: string;
}

export interface AttendanceResInterface {
	dayData: AttendanceDayResInterface;
	totalWorkDay: number;
	totalWorkTime: number;
	workDay: number;
	workTime: number;
	vacationTime: number;
}
