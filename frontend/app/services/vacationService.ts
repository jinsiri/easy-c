import axiosConfig from '../_lib/axiosConfig';
import { vacationPolicyType, vacationCategory, transactionType } from '@/type/types';
import { SearchRequestDto, PageRequest, PageResponse } from '@/type/interface';

export interface VacationDataDto {
	vacationId: number;
	memberNm: string;
	deptNm: string;
	jobGrade: string;

	year: number;
	vacationPolicyName?: string;
	vacationPolicyType?: vacationPolicyType;
	grantedDay?: number;
	usedDay?: number;
	remainDay?: number;
	annualVacation?: number;
	sickVacation?: number;
	holidayVacation?: number;
	specialVacation?: number;
	carryOverDay?: number;
}

export interface VacationHistoryDto {
	vacationId: number;
	memberId: number;
	vacationCategory: vacationCategory;
	transactionType: transactionType;
	day: number;
	accrualDate: string;
	expireDate: string;
	vacationDesc: string;
}

export interface VacationResponseDto {
	vacation: VacationDataDto;
	history: VacationHistoryDto[];
}

export interface VacationCompanySearchRequestDto {
	year: number;
	memberNm?: string;
	deptNm?: string;
	jobGrade?: string;
}

export interface VacationHistorySearchRequestDto {
	memberId: number | null;
	startDate: string | null;
	endDate: string | null;
	transactionType?: string;
	vacationCategory?: string;
	vacationDesc?: string;
}

// API 정의
export const vacationService = {
	getVacationData: (encodedMemberId: string) => axiosConfig.get<VacationResponseDto>(`/api/vacation/data?target=${encodedMemberId}`),
	searchVacationData: (request: PageRequest<VacationCompanySearchRequestDto>) =>
		axiosConfig.post<PageResponse<VacationDataDto>>(`/api/vacation/search`, request),
	searchVacationHistoryData: (request: PageRequest<VacationHistorySearchRequestDto>) =>
		axiosConfig.post<PageResponse<VacationHistoryDto>>(`/api/vacation/history`, request),
};
