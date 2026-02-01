import { workStatus, vacationType } from '@/type/types';

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

export const ATTENDANCETYPE: Record<string, string> = {
	FIXED: '고정근로',
	FLEXTIME: '시차출퇴근',
	SELECTIVE: '선택근로',
	FLEXIBLE: '탄력근로',
	SHIFT: '교대근무',
};
