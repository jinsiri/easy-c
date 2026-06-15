'use client';

import { useEffect, useMemo, useState } from 'react';
import secureLocalStorage from 'react-secure-storage';
import Image from 'next/image';

/** Lib */
import dayjs from 'dayjs';
import { Box, Chip, Typography, useTheme } from '@mui/material';

/** Custom */
import ColTitleAndText from '@/app/_component/layoutElement/ColTitleAndText';

/** Type / Interface */
import { MemberResponseDto, DeptMemberMapResponseDto } from '@/app/services/memberService';
import { ScheduleDto, scheduleService } from '@/app/services/scheduleService';

export default function UserResorceComp({ userData, deptData }: { userData?: MemberResponseDto; deptData?: DeptMemberMapResponseDto[] }) {
	const theme = useTheme();
	const [scheduleList, setScheduleList] = useState<ScheduleDto[]>([]);

	const getScheduleData = () => {
		const memberId = Number(secureLocalStorage.getItem('memberId'));

		const request = {
			memberId: memberId,
			date: dayjs().format('YYYY-MM-DD'),
		};

		scheduleService.getUserTodaySchedule(request).then((res) => {
			setScheduleList(res);
		});
	};

	const primaryDept = useMemo(() => {
		const filter = deptData?.filter((item) => item.isPrimary) ?? [];

		return (
			<Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
				{filter.map((deptItem, deptIdx: number) => {
					return (
						<Chip
							key={deptIdx}
							label={`${deptItem.deptNm}${deptItem.jobTitleNm ? ` - ${deptItem.jobTitleNm}` : ''}`}
							variant='outlined'
							color='primary'
							size='small'
						/>
					);
				})}
			</Box>
		);
	}, [deptData]);

	useEffect(() => {
		getScheduleData();
	}, []);

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				borderRadius: '1rem',
				padding: '1.5rem',
				backgroundColor: 'primary.50',
				minHeight: '14rem',
				gap: 2,
			}}
		>
			<Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
				<Box
					sx={{
						flex: '0 0 auto',
						position: 'relative',
						width: '6rem',
						height: '6rem',
						background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.point.main})`,
						borderRadius: '50%',
						mb: 1,
					}}
				>
					<Box
						sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							translate: '-50% -50%',
							width: '5.75rem',
							height: '5.75rem',
							backgroundColor: 'primary.50',
							borderRadius: '50%',
						}}
					>
						<Image
							src={userData?.profileImagePath ?? '/images/blank_profile.png'}
							alt={'프로필'}
							style={{ borderRadius: '50%', objectFit: 'cover' }}
							width={80}
							height={80}
						/>
					</Box>
				</Box>
				<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
					<Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'baseline' }}>
						<Typography variant='subtitle1' sx={{ textWrap: 'noWrap', fontWeight: '700', mr: 0.5 }}>
							{userData ? userData.memberNm : '-'}
						</Typography>
						<Typography sx={{ textWrap: 'noWrap', fontWeight: '600' }}>{userData ? userData.jobPosition?.jobPositionNm : '-'}</Typography>
					</Box>
					{primaryDept}
				</Box>
			</Box>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					width: '100%',
					flexGrow: 1,
					gap: 2,
				}}
			>
				<ColTitleAndText subtitle={'오늘의 일정'} sx={{ borderRadius: '1rem', padding: '0 1rem' }}>
					<Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
						<Typography variant='h6'>{scheduleList.length}</Typography>
					</Box>
				</ColTitleAndText>
				<ColTitleAndText subtitle={'오늘의 할 일'} sx={{ borderRadius: '1rem', padding: '0 1rem' }}>
					<Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
						<Typography variant='h6'>{'0'}</Typography>
					</Box>
				</ColTitleAndText>
			</Box>
		</Box>
	);
}
