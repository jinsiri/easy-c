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
	vacationPolicyName: string;
	vacationPolicyDesc: string;
	vacationPolicyType: vacationPolicyType;
	vacationPolicyUnit: string;
	annualLeaveExpired: boolean;
	monthLeaveExpired: boolean;
	nextYearLeaveUsed: boolean;
}

// API 정의
export const vacationPolicyService = {
	getVacationPolicyData: () => axiosConfig.get<VacationPolicyDto[]>('/api/vacation/policy/all'),
	saveVacationPolicyData: (req: VacationPolicyDto) => axiosConfig.post<void>('/api/vacation/policy/save', req),
	delteAttendancePolicyData: (id: string) => axiosConfig.delete<void>(`/api/vacation/policy/delete?target=${id}`),
};
