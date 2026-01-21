import { workStatus, vacationType } from '@/type/types';

export const WORKSTATUS: Record<workStatus, string> = {
	PRESENT: '정상 출근',
	LATE: '지각',
	EARLY_LEAVE: '조퇴',
	ABSENT: '결근',
	VACATION: '휴가',
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
