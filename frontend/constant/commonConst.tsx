import { baseStatus } from '@/type/types';

export const BASICSTATUS: Record<baseStatus, string> = {
	PENDING: '대기',
	APPROVED: '승인',
	REJECTED: '반려',
};
