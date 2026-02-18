import axiosConfig from '../_lib/axiosConfig';

// 타입 정의 (필요시 별도 파일로 분리 가능)
export interface MemberLightResponseDto {
	// 기본 인사정보 타입 (백엔드 DTO에 맞게 조정)
	[key: string]: any;
}
export interface MemberResponseDto {
	// 기본 인사정보 타입 (백엔드 DTO에 맞게 조정)
	[key: string]: any;
}

export interface MemberProfileResponseDto {
	// 기본정보 탭 타입
	[key: string]: any;
}

export interface MemberPersonalResponseDto {
	// 신상정보 탭 타입
	[key: string]: any;
}

export interface MemberCareerResponseDto {
	// 경력 정보 타입
	[key: string]: any;
}

export interface MemberRewardDisciplineResponseDto {
	// 포상/징계 정보 타입
	[key: string]: any;
}

export interface MemberQualificationResponseDto {
	// 자격 정보 타입
	[key: string]: any;
}

export interface MemberLanguageResponseDto {
	// 어학 정보 타입
	[key: string]: any;
}

export interface BulkDeleteRequestDto {
	ids: any;
}

// API 정의
export const memberService = {
	// 전체 멤버 조회
	getAllMembers: () => axiosConfig.get<MemberLightResponseDto[]>(`/api/members`),

	// 기본 인사정보 조회
	getMember: (memberId: number) => axiosConfig.get<MemberResponseDto>(`/api/members/${memberId}`),

	// 기본정보 탭 조회
	getMemberBasicInfo: (memberId: number) => axiosConfig.get<MemberProfileResponseDto>(`/api/members/${memberId}/basic`),

	// 신상정보 탭 조회
	getMemberPersonalInfo: (memberId: number) => axiosConfig.get<MemberPersonalResponseDto>(`/api/members/${memberId}/personal`),

	// 경력 탭 조회
	getMemberCareerInfo: (memberId: number) => axiosConfig.get<MemberCareerResponseDto[]>(`/api/members/${memberId}/career`),

	// 포상/징계 탭 조회
	getMemberRewardDisciplineInfo: (memberId: number) => axiosConfig.get<MemberRewardDisciplineResponseDto[]>(`/api/members/${memberId}/reward-discipline`),

	// 자격 탭 조회
	getMemberQualificationInfo: (memberId: number) => axiosConfig.get<MemberQualificationResponseDto[]>(`/api/members/${memberId}/qualification`),

	// 어학 탭 조회
	getMemberLanguageInfo: (memberId: number) => axiosConfig.get<MemberLanguageResponseDto[]>(`/api/members/${memberId}/languages`),

	// 멤버 등록
	createMember: (data: Record<string, any>) => axiosConfig.post<void>(`/api/members`, data),

	// 멤버 삭제
	deleteMember: (memberId: number) => axiosConfig.delete(`/api/members/${memberId}`),
	deleteMembers: (requestDto: BulkDeleteRequestDto) => axiosConfig.delete(`/api/members`, { data: requestDto }),
};
