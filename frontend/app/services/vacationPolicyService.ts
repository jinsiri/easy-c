import axiosConfig from '../_lib/axiosConfig';
import { vacationPolicyType } from '@/type/types';

export interface vacationPolicyRequestController {
	vacationPolicyName: string;
	vacationPolicyDesc: string;
	vacationPolicyType: vacationPolicyType;
	vacationPolicyUnit: string;
	annualLeaveExpired: boolean;
	monthLeaveExpired: boolean;
	nextYearLeaveUsed: boolean;
}

export interface VacationPolicyDto {
	vacationPolicyId?: number;
	vacationPolicyName: string;
	vacationPolicyDesc: string;
	vacationPolicyType: vacationPolicyType;
	vacationPolicyUnit: string;
	annualLeaveExpired: boolean;
	monthLeaveExpired: boolean;
	nextYearLeaveUsed: boolean;
	mappingUserCount?: number;
}

export interface vacationPolicyMappingRequestDto {
	policyId: number;
	memberIdList: number[];
}

// API 정의
export const vacationPolicyService = {
	getVacationPolicyData: () => axiosConfig.get<VacationPolicyDto[]>('/api/vacation/policy/all'),
	saveVacationPolicyData: (req: VacationPolicyDto) => axiosConfig.post<void>('/api/vacation/policy/save', req),
	delteVacationPolicyData: (id: string) => axiosConfig.delete<void>(`/api/vacation/policy/delete?target=${id}`),

	getPolicyMemberData: () => axiosConfig.get<Record<string, any>[]>('/api/vacation/policy/member'),
	savePolicyMemberMapping: (req: vacationPolicyMappingRequestDto) => axiosConfig.post('/api/vacation/policy/mapping', req),
};
