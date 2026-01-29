'use client';

import { useRouter } from 'next/navigation';

/** MUI */
import { Box, Button } from '@mui/material';

export default function GridInnerButton<T>() {
	const router = useRouter();

	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
			<Button variant='contained' size='small' onClick={() => router.push('/admin/attendance/company/modify')}>
				수정
			</Button>
		</Box>
	);
}
