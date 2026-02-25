import axiosConfig from '../_lib/axiosConfig';
import { SearchRequestDto } from '@/type/interface';

export interface VacationDataDto {
	vacationId: number;
	vacationPolicyName?: string;
	accrualDate?: string;
	expireDate?: string;
	grantedDay?: number;
	usedDay?: number;
	remainDay?: number;
	annualVacation?: number;
	sickVacation?: number;
	holidayVacation?: number;
	specialVacation?: number;
	carryOverDay?: number;
}

// API 정의
export const vacationService = {
	getVacationData: (encodedMemberId: string) => axiosConfig.get<VacationDataDto>(`/api/vacation/data?target=${encodedMemberId}`),
	searchVacationData: (request: SearchRequestDto) => axiosConfig.post<VacationDataDto[]>(`/api/vacation/search`, request),
};
