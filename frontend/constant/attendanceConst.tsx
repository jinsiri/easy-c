export const WORKSTATUS: Record<string, string> = {
	PRESENT: '정상 출근',
	LATE: '지각',
	EARLY_LEAVE: '조퇴',
	ABSENT: '결근',
	VACATION: '휴가',
};

export const CURRENTSTATE: Record<string, string> = {
	BEFORE_WORK: '근무 전',
	WORKING: '근무 중',
	AFTER_WORK: '근무 종료',
};
