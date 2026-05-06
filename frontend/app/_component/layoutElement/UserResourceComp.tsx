'use client';

import { useEffect, useState } from 'react';
import secureLocalStorage from 'react-secure-storage';

/** Lib */
import dayjs from 'dayjs';
import { Box, Typography, useTheme } from '@mui/material';

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

	useEffect(() => {
		getScheduleData();
	}, []);

	console.log(userData, deptData);

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
			<Box sx={{ position: 'relative', display: 'flex', flexDirection: 'row', width: '100%', height: '6rem', gap: 3 }}>
				<Box
					sx={{
						flex: '0 0 auto',
						position: 'relative',
						width: '6rem',
						height: '6rem',
						background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.point.main})`,
						borderRadius: '50%',
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
						<Box
							sx={{
								width: '5rem',
								height: '5rem',
								borderRadius: '50%',
								backgroundImage: 'url(/images/blank_profile.png)',
								backgroundOrigin: 'border-box',
								backgroundRepeat: 'no-repeat',
								backgroundPosition: 'center',
								backgroundSize: 'contain',
							}}
						></Box>
					</Box>
				</Box>
				<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start', height: '100%' }}>
					<Box sx={{ display: 'flex', alignItems: 'baseline', mb: 0.5 }}>
						<Typography variant='subtitle1' sx={{ fontWeight: '700' }}>
							{userData ? userData.memberNm : '-'}
						</Typography>
						<Typography sx={{ marginLeft: '0.25rem', fontWeight: '600' }}>{userData ? userData.jobPosition?.jobPositionNm : '-'}</Typography>
					</Box>
					<Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center', gap: 0.5 }}>
						{deptData?.map((deptItem, deptIdx: number) => {
							return (
								<Typography key={deptIdx} variant='body2'>
									{deptItem.deptNm}
								</Typography>
							);
						})}
					</Box>
				</Box>
			</Box>
			<Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', flexGrow: 1, gap: 1 }}>
				<ColTitleAndText subtitle={'오늘의 일정'} sx={{ flex: '1', borderRadius: '1rem', padding: '1rem 0.25rem' }}>
					<Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
						<Typography variant='h6'>{scheduleList.length}</Typography>
					</Box>
				</ColTitleAndText>
				<ColTitleAndText subtitle={'오늘의 할 일'} sx={{ flex: '1', borderRadius: '1rem', padding: '1rem 0.25rem' }}>
					<Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
						<Typography variant='h6'>{'0'}</Typography>
					</Box>
				</ColTitleAndText>
			</Box>
		</Box>
	);
}
