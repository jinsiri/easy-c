import { Dayjs } from 'dayjs';
import axiosConfig from '../_lib/axiosConfig';
import { vacationType } from '@/type/types';

export interface vacationApplicationController {
	vacationType: vacationType;
	vacationDuration: string;
	startDate?: Dayjs | null;
	endDate?: Dayjs | null;
	vacationReason?: string;
}

export interface vacationApplicationDto {
	memberId: number;
	deptNm?: string;
	jobGrade?: string;
	vacationType: vacationType;
	vacationDuration: string;
	startDate?: string;
	endDate?: string;
	vacationReason?: string;
	status?: string;
}

export interface vacationApplicationListDto {
	planVacation: vacationApplicationDto[];
	endVacation: vacationApplicationDto[];
}

// API 정의
export const vacationApplicationService = {
	getUserVacationApplicationData: (encodedMemberId: string) =>
		axiosConfig.get<vacationApplicationListDto>(`/api/vacation/application/user?target=${encodedMemberId}`),
	saveVacationApplicationData: (req: vacationApplicationDto) => axiosConfig.post<void>('/api/vacation/application/save', req),
};
