'use client';

import { useState } from 'react';

/** MUI */
import { Box, Button, MenuItem, Select, Typography, SelectChangeEvent } from '@mui/material';
import { ArrowForwardRounded, AccessTimeRounded } from '@mui/icons-material';

/** Custom */
import ColTitleAndText from '@/app/_component/layoutElement/ColTitleAndText';
import LiveClock from '@/app/_component/LiveClock';

export default function AttendanceComp() {
	const [workingStatus, setWorkingStatus] = useState('before');

	const handleChangeWorkingStatus = (event: SelectChangeEvent) => {
		setWorkingStatus(event.target.value as string);
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', padding: '1rem 1.5rem' }}>
			<Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
				<LiveClock />
				<Typography variant={'subtitle2'} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
					<AccessTimeRounded sx={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> 선택적 근로 시간제 (08:00 ~ 17:00)
				</Typography>
			</Box>

			<Box
				sx={{
					display: 'flex',
					flexDirection: { sm: 'column', md: 'row' },
					flexWrap: 'wrap',
					justifyContent: { sm: 'center', md: 'space-between' },
					alignItems: 'center',
					marginTop: '1rem',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: { sm: 'column', md: 'row' },
						flexWrap: 'wrap',
						justifyContent: 'center',
						alignItems: 'center',
						width: '100%',
						padding: '1rem',
						borderRadius: '1rem',
						backgroundColor: 'gray.100',
						gap: { sm: '0.5rem', md: '1rem', lg: '1.5rem' },
					}}
				>
					<ColTitleAndText subtitle={'출근 시간'}>
						<Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
							<Typography variant='h5'>08:00:01</Typography>
						</Box>
					</ColTitleAndText>
					<ArrowForwardRounded sx={{ display: { sm: 'none', md: 'block' } }} />
					<ColTitleAndText subtitle={'퇴근 시간'}>
						<Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
							<Typography variant='h5'>22:00:00</Typography>
						</Box>
					</ColTitleAndText>
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
						width: '100%',
						marginTop: '1rem',
						gap: '0.5rem',
					}}
				>
					<Button variant='contained' size='large'>
						출근하기
					</Button>
					<Button variant='contained' size='large'>
						퇴근하기
					</Button>

					<Select displayEmpty value={workingStatus} onChange={handleChangeWorkingStatus} sx={{ width: '8rem', height: '2.625rem' }}>
						<MenuItem value={'before'}>근무 전</MenuItem>
						<MenuItem value={'working'}>근무 중</MenuItem>
						<MenuItem value={'after'}>근무 종료</MenuItem>
						<MenuItem value={'vacation'}>휴가 중</MenuItem>
					</Select>
				</Box>
			</Box>
		</Box>
	);
}
