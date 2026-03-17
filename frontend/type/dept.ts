import { BaseDto, BaseTreeDto } from '@/type/base';

export interface DeptResponseDto extends BaseTreeDto {
	deptId: number;
	deptNm: string;
	deptShortNm: string;
	deptCode: string;
	deptEmail: string | null;
	dataType: string;
	deptMembers: [];
}

export interface JobPositionResponseDto extends BaseDto {
	jobPositionId: number;
	jobPositionNm: string;
	jobPositionCode: string;
	jobPositionLevel: number;
}

export interface JobGradeResponseDto extends BaseDto {
	jobGradeId: number;
	jobGradeNm: string;
	jobGradeCode: string;
	jobGradeLevel: number;
}

export interface JobTitleResponseDto extends BaseDto {
	jobTitleId: number;
	jobTitleNm: string;
	jobTitleCode: string;
	jobTitleLevel: number;
}

export interface JobRoleResponseDto extends BaseDto {
	jobRoleId: number;
	jobRoleNm: string;
	jobRoleCategory: string;
	jobRoleType: string;
	jobRoleOrder: number;
}
