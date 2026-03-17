import { baseStatus } from '@/type/types';

export const PAGE_SIZE_OPTIONS = [20, 50, 100];

export const BASICSTATUS: Record<baseStatus, string> = {
	PENDING: '대기',
	APPROVED: '승인',
	REJECTED: '반려',
};
