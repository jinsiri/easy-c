import { vacationPolicyType, vacationCategory, transactionType } from '@/type/types';

export const TRANSACTIONTYPE: Record<transactionType, string> = {
	GRANT: '지급',
	USE: '사용',
	CANCEL: '사용취소',
	EXPIRE: '만료',
};

export const VACATIONCATEGORY: Record<vacationCategory, string> = {
	ANNUAL: '연차',
	SICK: '병가',
	SPECIAL: '특별휴가',
	HOLIDAY: '휴일대체휴가',
	CARRYOVER: '이월휴가',
};

export const VACATIONPOLICYTYPE: Record<vacationPolicyType, string> = {
	WORKING_DAY: '입사일',
	FINANCIAL_DAY: '회계기준일',
};

export const VACATIONPOLICYUNIT: Record<string, string> = {
	'0.5': '반차(0.5일)',
	'1': '1일',
};
