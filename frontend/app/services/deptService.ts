import axiosConfig from '../_lib/axiosConfig';
import { BulkDeleteRequestDto } from '@/app/services/memberService';
import { DeptResponseDto, JobGradeResponseDto, JobPositionResponseDto, JobRoleResponseDto, JobTitleResponseDto } from '@/type/dept';

export interface JobPositionRequestDto {
	[key: string]: any;
}

export interface JobTitleRequestDto {
	[key: string]: any;
}

export interface JobGradeRequestDto {
	[key: string]: any;
}

export interface JobRoleRequestDto {
	[key: string]: any;
}

export interface DeptMemberMapRequestDto {
	[key: string]: any;
}

export interface MemberJobPositionMapRequestDto {
	[key: string]: any;
}

export interface MemberJobGradeMapRequestDto {
	[key: string]: any;
}

export interface MemberJobRoleMapRequestDto {
	[key: string]: any;
}

export const deptService = {
	getDeptList: () => axiosConfig.get<DeptResponseDto[]>(`/api/dept/tree`),

	// 부서원 일괄 추가
	assignMembersToDept: (dto: DeptMemberMapRequestDto) => axiosConfig.post(`/api/dept-member-map/assign`, dto),

	// 부서 내 역할(부서장, 부부서장, ...) 위임
	assignDeptRole: (dto: DeptMemberMapRequestDto) => axiosConfig.post(`/api/dept-member-map/assign-role`, dto),

	// 부서 이동
	reassignDept: (dto: DeptMemberMapRequestDto) => axiosConfig.post(`/api/dept-member-map/reassign`, dto),

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

	// 직무
	getJobRoles: () => axiosConfig.get<JobRoleResponseDto[]>(`/api/job-roles`),
	deleteJobRoles: (requestDto: BulkDeleteRequestDto) => axiosConfig.delete(`/api/job-roles`, { data: requestDto }),
	updateJobRoleOrders: (dtos: JobRoleRequestDto[]) => axiosConfig.post(`/api/job-roles/update-orders`, dtos),

	// 일괄 수정
	changeJobPositionBulk: (dto: MemberJobPositionMapRequestDto) => axiosConfig.post(`/api/member-position-map/bulk-update`, dto),
	changeJobGradeBulk: (dto: MemberJobGradeMapRequestDto) => axiosConfig.post(`/api/member-grade-map/bulk-update`, dto),
	changeJobRoleBulk: (dto: MemberJobRoleMapRequestDto) => axiosConfig.post(`/api/member-role-map/bulk-update`, dto),
	changeJobTitleBulk: (dto: DeptMemberMapRequestDto) => axiosConfig.post(`/api/dept-member-map/bulk-update`, dto), //todo
};
