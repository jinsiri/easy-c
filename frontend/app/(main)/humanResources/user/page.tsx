'use client';

import MemberDetail from '@/app/admin/member/_component/MemberDetail';
import secureLocalStorage from 'react-secure-storage';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import { Box, Button, Grid } from '@mui/material';

export default function HumanResourceUserPage() {
	const router = useRouter();
	const storedId = secureLocalStorage.getItem('memberId');

	useEffect(() => {
		if (!storedId) router.push('/login');
	}, [storedId]);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', widht: '100%', height: '100%' }}>
			<PathBreadcrumbs sx={{ padding: '0 1.5rem' }}>
				<Button variant={'contained'} onClick={() => router.push(`/admin/member/edit?memberId=${storedId}`)}>
					수정
				</Button>
			</PathBreadcrumbs>
			<MemberDetail selectedId={Number(storedId)} />
		</Box>
	);
}
