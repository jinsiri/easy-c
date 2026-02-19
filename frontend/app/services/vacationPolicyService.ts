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

export interface vacationPolicyDto {
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
	//getAttendancePolicyData: () => axiosConfig.get<AttendancePolicyDto[]>('/api/attendance/policy/all'),
	//saveAttendancePolicyData: (req: AttendancePolicyDto) => axiosConfig.post<AttendancePolicyDto[]>('/api/attendance/policy/save', req),
	//delteAttendancePolicyData: (id: string) => axiosConfig.delete<AttendancePolicyDto[]>(`/api/attendance/policy/delete?target=${id}`),
};
