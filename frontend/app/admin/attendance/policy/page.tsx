'use client';

import { useEffect, useState } from 'react';

/** Lib */
import dayjs from 'dayjs';
import useLoaderStore from '@/store/useLoaderStore';

/** MUI */
import { Box, Button, Grid, Typography } from '@mui/material';

/** Custom */

/** Type / Interface */
import { AttendancePolicyResDto, attendancePolicyService } from '@/app/services/attendancePolicyService';

import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import { useRouter } from 'next/navigation';

const list = [
	{ name: '근로타입', key: 'attendanceType' },
	{ name: '기준기간', key: 'settlementPeriod' },
	{ name: '근로규칙', key: 'worktimeRule' },
	{ name: '근로시간', key: 'workTime' },
	{ name: '근무요일', key: 'workingDay' },
	{ name: '코어시간', key: 'coreTime' },
];

export default function AttendancePolicyPage() {
	const router = useRouter();
	const { loader, setLoader } = useLoaderStore();

	const [policyData, setPolicyData] = useState<AttendancePolicyResDto[]>([]);

	useEffect(() => {
		getAttendancePolicyData();
	}, []);

	const getAttendancePolicyData = async () => {
		if (!loader) setLoader(true);

		try {
			const res = await attendancePolicyService.getAttendancePolicyData();
			setPolicyData(res);
			console.log(res);
		} catch (error: any) {
		} finally {
			setLoader(false);
		}
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
			<PathBreadcrumbs sx={{ padding: '0 1.5rem' }}>
				<Button variant='contained' sx={{ height: 'auto' }} onClick={() => router.push('/admin/attendance/policy/modal?type=insert')}>
					정책 추가
				</Button>
			</PathBreadcrumbs>
			<Grid container sx={{ flexDirection: 'row', padding: '0 1.5rem' }}>
				{policyData.map((item, idx) => {
					return (
						<Grid key={idx} sx={{ padding: '1.5rem', border: '1px solid', borderColor: 'grey.200', bgcolor: 'grey.50', borderRadius: '2rem' }}>
							<Typography variant='h6'>{item.attendancePolicyName}</Typography>
							<Box component={'ul'} sx={{ marginTop: '1rem' }}>
								{list.map((listItem, listIdx) => {
									return (
										<Box key={listIdx} sx={{ display: 'flex', flexDirection: 'row', marginBottom: '0.25rem' }}>
											<Typography sx={{ width: '5rem' }}>{listItem.name}</Typography>
											<Typography>{item[listItem.key]}</Typography>
										</Box>
									);
								})}
							</Box>
						</Grid>
					);
				})}
			</Grid>
		</Box>
	);
}
