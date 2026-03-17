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
		<>
			<Box sx={{ padding: '0 1.5rem' }}>
				<PathBreadcrumbs />
				<MemberDetail selectedId={Number(storedId)} />
				<Grid container direction={'row'} justifyContent={'flex-end'} sx={{ mt: 2 }}>
					<Button variant={'contained'} onClick={() => router.push(`/admin/member/edit?memberId=${storedId}`)}>
						수정
					</Button>
				</Grid>
			</Box>
		</>
	);
}
