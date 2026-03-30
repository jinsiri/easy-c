import { Dayjs } from 'dayjs';
import axiosConfig from '../_lib/axiosConfig';

import { vacationType } from '@/type/types';
import { PageRequest, PageResponse } from '@/type/interface';
import { BaseDto } from '@/type/base';

export interface vacationApplicationController {
	vacationType: vacationType;
	vacationDuration?: string;
	startDate?: Dayjs | null;
	endDate?: Dayjs | null;
	violationReason?: string;
}

export interface vacationApplicationDto extends BaseDto {
	vacationApplicationId?: number;
	memberId?: number;
	memberNm?: string;
	deptNm?: string;
	jobGrade?: string;
	vacationType?: vacationType;
	vacationDuration?: number;
	startDate?: string;
	endDate?: string | null;
	violationReason?: string;
	status?: string;
}

export interface vacationApplicationDataDto {
	memberId?: number;
	deptNm?: string;
	jobGrade?: string;
	vacationType?: vacationType;
	vacationDuration?: number;
	startDate?: string;
	endDate?: string | null;
	violationReason?: string;
	status?: string;
}

export interface VacationAppSearchRequestDto {
	memberId: number | null;
	startDate?: string | null;
	endDate?: string | null;
	status?: string;
	vacationType?: string;
	vacationStart?: string;
	vacationEnd?: string;
	deptNm?: string;
	memberNm?: string;
}

// API 정의
export const vacationApplicationService = {
	getUserVacationApplicationData: (encodedMemberId: string) =>
		axiosConfig.get<vacationApplicationDto[]>(`/api/vacation/application/user?target=${encodedMemberId}`),

	saveVacationApplicationData: (req: vacationApplicationDataDto) => axiosConfig.post<void>('/api/vacation/application/save', req),
	approveAttendanceApplication: (req: vacationApplicationDto[]) => axiosConfig.post<void>('/api/vacation/application/approve', req),
	rejectAttendanceApplication: (req: vacationApplicationDto[]) => axiosConfig.post<void>('/api/vacation/application/reject', req),

	searchVacationApplication: (request: PageRequest<VacationAppSearchRequestDto>) =>
		axiosConfig.post<PageResponse<vacationApplicationDataDto>>('/api/vacation/application/search', request),
	searchUserVacationApplicationData: (request: PageRequest<VacationAppSearchRequestDto>) =>
		axiosConfig.post<PageResponse<vacationApplicationDataDto>>(`/api/vacation/application/user/search`, request),
};
