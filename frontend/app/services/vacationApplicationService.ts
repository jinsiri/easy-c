import { Dayjs } from 'dayjs';
import axiosConfig from '../_lib/axiosConfig';

import { vacationType } from '@/type/types';
import { SearchRequestDto } from '@/type/interface';
import { BaseDto } from '@/type/base';

export interface vacationApplicationController {
	vacationType: vacationType;
	vacationDuration: string;
	startDate?: Dayjs | null;
	endDate?: Dayjs | null;
	vacationReason?: string;
}

export interface vacationApplicationDto extends BaseDto {
	vacationApplicationId?: number;
	memberId?: number;
	memberNm?: string;
	deptNm?: string;
	jobGrade?: string;
	vacationType: vacationType;
	vacationDuration: number;
	startDate?: string;
	endDate?: string | null;
	vacationReason?: string;
	status?: string;
}

export interface vacationApplicationDataDto {
	memberId?: number;
	deptNm?: string;
	jobGrade?: string;
	vacationType: vacationType;
	vacationDuration: number;
	startDate?: string;
	endDate?: string | null;
	vacationReason?: string;
	status?: string;
}

export interface vacationApplicationListDto {
	planVacation: vacationApplicationDataDto[];
	endVacation: vacationApplicationDataDto[];
}

// API 정의
export const vacationApplicationService = {
	getUserVacationApplicationData: (encodedMemberId: string) =>
		axiosConfig.get<vacationApplicationListDto>(`/api/vacation/application/user?target=${encodedMemberId}`),
	saveVacationApplicationData: (req: vacationApplicationDataDto) => axiosConfig.post<void>('/api/vacation/application/save', req),
	searchVacationApplication: (req: SearchRequestDto) => axiosConfig.post<vacationApplicationDto[]>('/api/vacation/application/search', req),
	approveAttendanceApplication: (req: vacationApplicationDto) => axiosConfig.post<void>('/api/vacation/application/approve', req),
	rejectAttendanceApplication: (req: vacationApplicationDto) => axiosConfig.post<void>('/api/vacation/application/reject', req),
};
