import { vacationPolicyType } from '@/type/types';

export const VACATIONPOLICYTYPE: Record<vacationPolicyType, string> = {
	WORKING_DAY: '입사일',
	FINANCIAL_DAY: '회계기준일',
};

export const VACATIONPOLICYUNIT: Record<string, string> = {
	'0.5': '반차(0.5일)',
	'1': '1일',
};
