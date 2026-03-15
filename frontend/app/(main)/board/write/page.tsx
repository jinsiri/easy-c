'use client';

/** MUI */
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import secureLocalStorage from 'react-secure-storage';

/** Custom */
import PathBreadcrumbs from '../../../_component/PathBreadcrumbs';
import { boardPostService } from '../../../services/boardPostService';

const ALL_CATEGORIES = [
	{ value: 'NOTICE', label: '공지사항' },
	{ value: 'GENERAL', label: '자유게시판' },
];

export default function BoardWritePage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const isAdmin = secureLocalStorage.getItem('memberRole') === 'ROLE_ADMIN';
	const categories = isAdmin ? ALL_CATEGORIES : ALL_CATEGORIES.filter((c) => c.value !== 'NOTICE');
	const initialCategory = searchParams.get('category') ?? (isAdmin ? 'NOTICE' : 'GENERAL');
	const [category, setCategory] = useState(initialCategory);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');

	const handleSubmit = () => {
		boardPostService.create({ category, title, content }).then(() => router.back());
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs />
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 900, width: '100%' }}>
				<Box sx={{ display: 'flex', gap: 2 }}>
					<FormControl size="small" sx={{ minWidth: 140 }}>
						<InputLabel>카테고리</InputLabel>
						<Select label="카테고리" value={category} onChange={(e) => setCategory(e.target.value)}>
							{categories.map((c) => (
								<MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
							))}
						</Select>
					</FormControl>
					<TextField
						label="제목"
						size="small"
						fullWidth
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</Box>
				<TextField
					label="내용"
					multiline
					rows={20}
					fullWidth
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>
				<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
					<Button variant="outlined" onClick={() => router.back()}>취소</Button>
					<Button variant="contained" onClick={handleSubmit}>등록</Button>
				</Box>
			</Box>
		</Box>
	);
}
