import { attendanceType, workStatus, vacationType, settlementPeriod } from '@/type/types';

export const WORKDAYOFWEEKNUMBER: Record<string, string> = {
	'1': '월',
	'2': '화',
	'3': '수',
	'4': '목',
	'5': '금',
	'6': '토',
	'7': '일',
};

export const WORKSTATUS: Record<workStatus, string> = {
	PRESENT: '정상 출근',
	LATE: '지각',
	EARLY_LEAVE: '조퇴',
	ABSENT: '결근',
	VACATION: '휴가',
	OUTSIDE: '외근',
	BUSINESS_TRIP: '출장',
};

export const VACATIONTYPE: Record<vacationType, string> = {
	FULL: '연차',
	HALF_AM: '오전 반차',
	HALF_PM: '오후 반차',
	SICK_LEAVE: '병가',
	SPECIAL_LEAVE: '특별휴가',
};

export const CURRENTSTATE: Record<string, string> = {
	BEFORE_WORK: '근무 전',
	WORKING: '근무 중',
	AFTER_WORK: '근무 종료',
};

export const ATTENDANCETYPE: Record<attendanceType, string> = {
	FIXED: '고정근로',
	FLEXTIME: '시차출퇴근',
	SELECTIVE: '선택근로',
	FLEXIBLE: '탄력근로',
	SHIFT: '교대근무',
};

export const SETTLEMENTPERIOD: Record<settlementPeriod, string> = {
	WEEK: '1주',
	WEEK_2: '2주',
	MONTH: '1개월',
	MONTH_2: '2개월',
	MONTH_3: '3개월',
};

export const WORKTIMERULE: Record<string, string> = {
	ALWAYS_40: '법정근로시간 적용',
	CAP_AT_40: '법정근로시간까지 제한',
	BY_WORK_DAYS: '근무일x1일 소정근로시간',
};

export const BASICSTATUS: Record<string, string> = {
	PENDING: '대기',
	APPROVED: '승인',
	REJECTED: '거절',
};
