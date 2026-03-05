import axiosConfig from '../_lib/axiosConfig';
import { vacationPolicyType, vacationCategory } from '@/type/types';
import { SearchRequestDto } from '@/type/interface';

export interface VacationDataDto {
	vacationId: number;
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
	transactionType: string;
	day: number;
	accrualDate: string;
	expireDate: string;
	vacationDesc: string;
}

export interface VacationResponseDto {
	vacation: VacationDataDto;
	history: VacationHistoryDto[];
}

// API 정의
export const vacationService = {
	getVacationData: (encodedMemberId: string) => axiosConfig.get<VacationResponseDto>(`/api/vacation/data?target=${encodedMemberId}`),
	searchVacationData: (request: SearchRequestDto) => axiosConfig.post<VacationDataDto[]>(`/api/vacation/search`, request),
};
