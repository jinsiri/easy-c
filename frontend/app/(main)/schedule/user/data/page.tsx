'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';

/** MUI */
import { Box, Button, Typography } from '@mui/material';
import { ArrowBackRounded } from '@mui/icons-material';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import SheduleInputFormComp, { SheduleInputFormRef } from './SheduleInputFormComp';

/** Type / Interface */

export default function ScheduleUserDataPage() {
	const router = useRouter();
	const formRef = useRef<SheduleInputFormRef | null>(null);

	const handleSave = () => {
		if (formRef.current) formRef.current.handleSave?.();
	};

	const handleClose = () => {
		router.back();
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: 'grey.50' }}>
			<PathBreadcrumbs sx={{ padding: '0 1.5rem' }} />
			<Box sx={{ flexWrap: 'wrap', flexDirection: 'column', padding: '0 1.5rem' }}>
				<Button startIcon={<ArrowBackRounded fontSize='small' />} onClick={handleClose} sx={{ mb: '0.5rem' }}>
					뒤로 가기
				</Button>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						width: '100%',
						padding: '2rem',
						borderRadius: '2rem',
						backgroundColor: 'background.default',
						gap: 3,
					}}
				>
					<Box sx={{ display: 'flex', justifyContent: 'row', alignItems: 'center', gap: 1, width: '100%' }}>
						<Typography variant='h5'>일정 생성</Typography>
					</Box>
					<SheduleInputFormComp ref={formRef} />
					<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 2, width: '100%' }}>
						<Button variant='text' onClick={handleClose} size='large'>
							닫기
						</Button>
						<Button variant='contained' size='large' onClick={handleSave}>
							저장
						</Button>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
