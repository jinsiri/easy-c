'use client';

/** MUI */
import { Box, Button, Chip, Divider, IconButton, TextField, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import secureLocalStorage from 'react-secure-storage';

/** Custom */
import PathBreadcrumbs from '../../../_component/PathBreadcrumbs';
import { boardPostService, BoardPostResponseDto } from '../../../services/boardPostService';
import { boardCommentService, BoardCommentResponseDto } from '../../../services/boardCommentService';

export default function BoardDetailPage() {
	const { id } = useParams();
	const router = useRouter();
	const [post, setPost] = useState<BoardPostResponseDto | null>(null);
	const [comments, setComments] = useState<BoardCommentResponseDto[]>([]);
	const [commentInput, setCommentInput] = useState('');
	const commentInputRef = useRef<HTMLInputElement>(null);

	const loginId = secureLocalStorage.getItem('loginId') as string | null;
	const isAdmin = secureLocalStorage.getItem('memberRole') === 'ROLE_ADMIN';

	useEffect(() => {
		boardPostService.findById(Number(id)).then((res: any) => setPost(res));
		loadComments();
	}, [id]);

	const loadComments = () => {
		boardCommentService.findAll(Number(id)).then((res: any) => {
			setComments(Array.isArray(res) ? res : (res?.data ?? []));
		});
	};

	const handleDelete = () => {
		boardPostService.delete(Number(id)).then(() => router.back());
	};

	const handleCommentSubmit = () => {
		const trimmed = commentInput.trim();
		if (!trimmed) return;
		boardCommentService.create(Number(id), trimmed).then(() => {
			setCommentInput('');
			loadComments();
		});
	};

	const handleCommentDelete = (commentId: number) => {
		boardCommentService.delete(Number(id), commentId).then(() => loadComments());
	};

	if (!post) return null;

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem', overflowY: 'auto' }}>
			<PathBreadcrumbs />
			<Box sx={{ maxWidth: 900, width: '100%' }}>
				{/* 게시글 헤더 */}
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
					<Chip label={post.category.label} size="small" color="primary" />
					<Typography variant="h6" fontWeight={700}>{post.title}</Typography>
				</Box>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
					<Box sx={{ display: 'flex', gap: 2, color: 'text.secondary', fontSize: '0.875rem' }}>
						<span>작성자: {post.registerUser?.memberNm ?? '-'}</span>
						<span>작성일: {post.registerDate ? dayjs(post.registerDate).format('YYYY-MM-DD HH:mm') : '-'}</span>
						<span>조회수: {post.viewCount}</span>
					</Box>
					<Box sx={{ display: 'flex', gap: 1 }}>
						{loginId === post.registerUser?.loginId && (
							<Button size="small" variant="outlined" onClick={() => router.push(`/board/${id}/edit`)}>수정</Button>
						)}
						{(loginId === post.registerUser?.loginId || isAdmin) && (
							<Button size="small" variant="outlined" color="error" onClick={handleDelete}>삭제</Button>
						)}
					</Box>
				</Box>
				<Divider sx={{ mb: 3 }} />

				{/* 본문 */}
				<Box sx={{ minHeight: 200, whiteSpace: 'pre-wrap', mb: 5 }}>
					{post.content}
				</Box>

				<Divider sx={{ mb: 3 }} />

				{/* 댓글 */}
				<Box>
					<Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'grey.700', mb: 2 }}>
						댓글 {comments.length}
					</Typography>

					{/* 댓글 목록 */}
					{comments.length === 0 ? (
						<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
							아직 댓글이 없습니다.
						</Typography>
					) : (
						<Box sx={{ mb: 3 }}>
							{comments.map((comment, idx) => (
								<Box key={comment.id}>
									{idx > 0 && <Divider sx={{ my: 1.5 }} />}
									<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
										<Box sx={{ flex: 1 }}>
											<Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 0.5 }}>
												<Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>
													{comment.registerUser?.memberNm ?? '-'}
												</Typography>
												<Typography variant="caption" color="text.secondary">
													{dayjs(comment.registerDate).format('YYYY-MM-DD HH:mm')}
												</Typography>
											</Box>
											<Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
												{comment.content}
											</Typography>
										</Box>
										{(loginId === comment.registerUser?.loginId || isAdmin) && (
											<IconButton
												size="small"
												onClick={() => handleCommentDelete(comment.id)}
												sx={{ color: 'grey.400', '&:hover': { color: 'error.main' }, flexShrink: 0 }}
											>
												<DeleteOutlineIcon fontSize="small" />
											</IconButton>
										)}
									</Box>
								</Box>
							))}
						</Box>
					)}

					{/* 댓글 입력 */}
					<Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
						<TextField
							inputRef={commentInputRef}
							multiline
							minRows={2}
							maxRows={5}
							fullWidth
							size="small"
							placeholder="댓글을 입력하세요."
							value={commentInput}
							onChange={(e) => setCommentInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									handleCommentSubmit();
								}
							}}
						/>
						<Button
							variant="contained"
							size="small"
							onClick={handleCommentSubmit}
							disabled={!commentInput.trim()}
							sx={{ flexShrink: 0, height: 'fit-content' }}
						>
							등록
						</Button>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
