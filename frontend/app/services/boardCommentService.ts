import axiosConfig from '../_lib/axiosConfig';
import { AuditUser } from './boardPostService';

export interface BoardCommentResponseDto {
	id: number;
	postId: number;
	content: string;
	registerDate: string;
	registerUser: AuditUser | null;
}

export const boardCommentService = {
	findAll: (postId: number) =>
		axiosConfig.get<BoardCommentResponseDto[]>(`/api/board/posts/${postId}/comments`),

	create: (postId: number, content: string) =>
		axiosConfig.post<BoardCommentResponseDto>(`/api/board/posts/${postId}/comments`, { content }),

	delete: (postId: number, commentId: number) =>
		axiosConfig.delete(`/api/board/posts/${postId}/comments/${commentId}`),
};
