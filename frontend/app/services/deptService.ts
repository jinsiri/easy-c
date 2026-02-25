import axiosConfig from '../_lib/axiosConfig';
import { BulkDeleteRequestDto } from '@/app/services/memberService';
import { DeptResponseDto, JobGradeResponseDto, JobPositionResponseDto, JobTitleResponseDto } from '@/type/dept';

export interface JobPositionRequestDto {
	[key: string]: any;
}

export interface JobTitleRequestDto {
	[key: string]: any;
}

export interface JobGradeRequestDto {
	[key: string]: any;
}

export const deptService = {
	getDeptList: () => axiosConfig.get<DeptResponseDto[]>(`/api/dept/tree`),

	// 직위
	getJobPositions: () => axiosConfig.get<JobPositionResponseDto[]>(`/api/job-positions`),
	saveJobPositionTemplates: (dtos: JobPositionRequestDto[]) => axiosConfig.post(`/api/job-positions/from-template`, dtos),
	deleteJobPositions: (requestDto: BulkDeleteRequestDto) => axiosConfig.delete(`/api/job-positions`, { data: requestDto }),
	updateJobPositionLevels: (dtos: JobPositionRequestDto[]) => axiosConfig.post(`/api/job-positions/update-levels`, dtos),

	// 직책
	getJobTitles: () => axiosConfig.get<JobTitleResponseDto[]>(`/api/job-titles`),
	saveJobTitleTemplates: (dtos: JobTitleRequestDto[]) => axiosConfig.post(`/api/job-titles/from-template`, dtos),
	deleteJobTitles: (requestDto: BulkDeleteRequestDto) => axiosConfig.delete(`/api/job-titles`, { data: requestDto }),
	updateJobTitleLevels: (dtos: JobTitleRequestDto[]) => axiosConfig.post(`/api/job-titles/update-levels`, dtos),

	// 직급
	getJobGrades: () => axiosConfig.get<JobGradeResponseDto[]>(`/api/job-grades`),
	saveJobGradeTemplates: (dtos: JobGradeRequestDto[]) => axiosConfig.post(`/api/job-grades/from-template`, dtos),
	deleteJobGrades: (requestDto: BulkDeleteRequestDto) => axiosConfig.delete(`/api/job-grades`, { data: requestDto }),
	updateJobGradeLevels: (dtos: JobGradeRequestDto[]) => axiosConfig.post(`/api/job-grades/update-levels`, dtos),
};
