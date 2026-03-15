'use client';

/** MUI */
import { Box, Button, Chip, Divider, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import secureLocalStorage from 'react-secure-storage';

/** Custom */
import PathBreadcrumbs from '../../../_component/PathBreadcrumbs';
import { boardPostService, BoardPostResponseDto } from '../../../services/boardPostService';

export default function BoardDetailPage() {
	const { id } = useParams();
	const router = useRouter();
	const [post, setPost] = useState<BoardPostResponseDto | null>(null);
	const loginId = secureLocalStorage.getItem('loginId') as string | null;
	const isAdmin = secureLocalStorage.getItem('memberRole') === 'ROLE_ADMIN';

	useEffect(() => {
		boardPostService.findById(Number(id)).then((res: any) => setPost(res));
	}, [id]);

	const handleDelete = () => {
		boardPostService.delete(Number(id)).then(() => router.back());
	};

	if (!post) return null;

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs />
			<Box sx={{ maxWidth: 900, width: '100%' }}>
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
				<Box sx={{ minHeight: 200, whiteSpace: 'pre-wrap' }}>
					{post.content}
				</Box>
			</Box>
		</Box>
	);
}
