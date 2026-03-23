import axiosConfig from '../_lib/axiosConfig';

export interface PageResponse<T> {
	content: T[];
	totalElements: number;
	totalPages: number;
	number: number;
	size: number;
}

export interface EnumOption {
	code: string;
	label: string;
}

export interface AuditUser {
	loginId: string;
	memberNm: string;
	memberRole: string;
}

export interface BoardPostResponseDto {
	id: number;
	category: EnumOption;
	title: string;
	content: string;
	viewCount: number;
	registerDate: string;
	registerUser: AuditUser | null;
	lastUpdateDate: string | null;
	lastUpdateUser: AuditUser | null;
}

export interface BoardPostRequestDto {
	category: string;
	title: string;
	content: string;
}

export interface BoardPostFilter {
	title?: string;
	content?: string;
	author?: string;
}

export const boardPostService = {
	findAllNotice: (page = 0, size = 20, filter?: BoardPostFilter) =>
		axiosConfig.get<PageResponse<BoardPostResponseDto>>('/api/board/posts/notice', { params: { page, size, ...filter } }),

	findAllGeneral: (page = 0, size = 20, filter?: BoardPostFilter) =>
		axiosConfig.get<PageResponse<BoardPostResponseDto>>('/api/board/posts/general', { params: { page, size, ...filter } }),

	findById: (postId: number) =>
		axiosConfig.get<BoardPostResponseDto>(`/api/board/posts/${postId}`),

	create: (dto: BoardPostRequestDto) =>
		axiosConfig.post<BoardPostResponseDto>('/api/board/posts', dto),

	update: (postId: number, dto: BoardPostRequestDto) =>
		axiosConfig.put<BoardPostResponseDto>(`/api/board/posts/${postId}`, dto),

	delete: (postId: number) =>
		axiosConfig.delete(`/api/board/posts/${postId}`),

	deleteAll: (postIds: number[]) =>
		axiosConfig.delete('/api/board/posts', { data: postIds }),
};
