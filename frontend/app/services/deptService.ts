import axiosConfig from '../_lib/axiosConfig';

export interface JobPositionResponseDto {
	[key: string]: any;
}

export interface JobTitleResponseDto {
	[key: string]: any;
}

export interface JobGradeResponseDto {
	[key: string]: any;
}

export const deptService = {
	// 직위 목록 조회
	getJobPosition: () => axiosConfig.get<JobPositionResponseDto[]>(`/api/job-position`),

	// 직책 목록 조회
	getJobTitle: () => axiosConfig.get<JobTitleResponseDto[]>(`/api/job-title`),

	// 직급 목록 조회
	getJobGrade: () => axiosConfig.get<JobGradeResponseDto[]>(`/api/job-grade`),
};
