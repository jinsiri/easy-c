'use client';

import { useCallback, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/** Lib */
import dayjs from 'dayjs';
import useLoaderStore from '@/store/useLoaderStore';
import useModalStore from '@/store/useModalStore';

/** MUI */
import { Box, Button, Grid, IconButton, Typography, Chip } from '@mui/material';
import { DeleteRounded, BorderColorRounded } from '@mui/icons-material';
import { grey } from '@mui/material/colors';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';

/** Type / Interface */
import { AttendancePolicyDto, attendancePolicyService } from '@/app/services/attendancePolicyService';
import { ATTENDANCETYPE, SETTLEMENTPERIOD, WORKTIMERULE, WORKDAYOFWEEKNUMBER } from '@/constant/attendanceConst';
import { attendanceType, settlementPeriod } from '@/type/types';

interface listCollector {
	name: string;
	key: string;
	valueFormatter?: (data: AttendancePolicyDto) => ReactNode;
}

export default function AttendancePolicyPage() {
	const router = useRouter();
	const pathName = usePathname();
	const { loader, setLoader } = useLoaderStore();
	const { setModalData } = useModalStore();

	const [policyData, setPolicyData] = useState<AttendancePolicyDto[]>([]);

	const list: listCollector[] = [
		{ name: '근로타입', key: 'attendanceType', valueFormatter: (data) => <Box>{ATTENDANCETYPE[data.attendanceType as attendanceType]}</Box> },
		{ name: '정산기간', key: 'settlementPeriod', valueFormatter: (data) => <Box>{SETTLEMENTPERIOD[data.settlementPeriod as settlementPeriod]}</Box> },
		{ name: '근로규칙', key: 'worktimeRule', valueFormatter: (data) => <Box>{WORKTIMERULE[data.worktimeRule]}</Box> },
		{
			name: '근무요일',
			key: 'workDayOfWeek',
			valueFormatter: (data) => {
				const formatArray = data.workDayOfWeek?.map((item) => WORKDAYOFWEEKNUMBER[item]);
				return <Typography>{formatArray.join(',')}</Typography>;
			},
		},
		{
			name: '근로시간',
			key: 'workTime',
			valueFormatter: (data) => (
				<Box>
					{data.startTime ? dayjs(data.startTime, 'HH:mm').format('HH:mm') : '-'} ~{' '}
					{data.endTime ? dayjs(data.endTime, 'HH:mm').format('HH:mm') : '-'}
				</Box>
			),
		},
		{
			name: '근태 허용 시간(분)',
			key: 'allowMarginMinute',
			valueFormatter: (data) => <Box>{data.allowMarginMinute}분</Box>,
		},
		{
			name: '적용 근로자(명)',
			key: 'mappingUserCount',
			valueFormatter: (data) => (
				<Box>
					{data.mappingUserCount ?? '-'}명{' '}
					{data.attendancePolicyId !== 1 && (
						<IconButton
							sx={{ color: grey[500] }}
							onClick={(e) => {
								setModalData({ policyId: data.attendancePolicyId });
								router.push('/admin/attendance/policy/modal');
							}}
						>
							<BorderColorRounded sx={{ fontSize: '1rem' }} />
						</IconButton>
					)}
				</Box>
			),
		},
	];

	useEffect(() => {
		getAttendancePolicyData();
	}, [pathName]);

	const getAttendancePolicyData = async () => {
		if (!loader) setLoader(true);

		try {
			const res = await attendancePolicyService.getAttendancePolicyData();
			setPolicyData(res);
		} finally {
			setLoader(false);
		}
	};

	const onClickUpdateButton = useCallback(
		async (event: React.MouseEventHandler<HTMLButtonElement>, item: AttendancePolicyDto) => {
			if (item.attendancePolicyId) {
				setModalData(item);
				router.push(`/admin/attendance/policy/data?target=${btoa(item.attendancePolicyId.toString())}`);
			}
		},
		[policyData],
	);

	const onClickDeleteButton = useCallback(
		async (event: React.MouseEventHandler<HTMLButtonElement>, item: AttendancePolicyDto) => {
			try {
				if (item.attendancePolicyId && confirm('정말 해당 정책을 삭제하시겠습니까?')) {
					setLoader(true);

					const encodedId = btoa(item.attendancePolicyId.toString());
					await attendancePolicyService.delteAttendancePolicyData(encodedId);

					if (confirm('정책이 성공적으로 삭제되었습니다.')) {
						getAttendancePolicyData();
					}
				}
			} finally {
				setLoader(false);
			}
		},
		[policyData],
	);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
			<PathBreadcrumbs sx={{ padding: '0 1.5rem' }}>
				<Button variant='contained' sx={{ height: 'auto' }} onClick={() => router.push('/admin/attendance/policy/data')}>
					정책 추가
				</Button>
			</PathBreadcrumbs>
			<Grid container sx={{ flexWrap: 'wrap', flexDirection: 'row', padding: '0 1.5rem', gap: 3 }}>
				{policyData.map((item, idx) => {
					return (
						<Grid
							key={idx}
							sx={{
								border: '1px solid',
								borderColor: idx === 0 ? 'primary.100' : 'grey.200',
								bgcolor: idx === 0 ? 'primary.50' : '',
								borderRadius: '1.5rem',
							}}
						>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: idx === 0 ? 'space-between' : 'end',
									alignItems: 'center',
									height: '3rem',
									padding: '0.5rem',
									gap: 0.5,
								}}
							>
								{idx === 0 ? (
									<Chip label='기본정책' variant='outlined' color='primary' size='small' />
								) : (
									<>
										<IconButton sx={{ color: grey[500] }} onClick={(e) => onClickUpdateButton(e, item)}>
											<BorderColorRounded sx={{ fontSize: '1rem' }} />
										</IconButton>
										<IconButton sx={{ color: grey[500] }} onClick={(e) => onClickDeleteButton(e, item)}>
											<DeleteRounded sx={{ fontSize: '1rem' }} />
										</IconButton>
									</>
								)}
							</Box>
							<Box sx={{ px: '1.5rem', paddingBottom: '2rem' }}>
								<Typography variant='h6'>{item.attendancePolicyName}</Typography>
								<Box component={'ul'} sx={{ marginTop: '1rem' }}>
									{list.map((listItem, listIdx) => {
										return (
											<Box key={listIdx} sx={{ display: 'flex', flexDirection: 'row', marginBottom: '0.25rem' }}>
												<Typography sx={{ width: '8rem' }}>{listItem.name}</Typography>
												{listItem.valueFormatter ? listItem.valueFormatter(item) : <Box>{item[listItem.key]}</Box>}
											</Box>
										);
									})}
								</Box>
							</Box>
						</Grid>
					);
				})}
			</Grid>
		</Box>
	);
}
