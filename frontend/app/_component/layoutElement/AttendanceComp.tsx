'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import secureLocalStorage from 'react-secure-storage';

/** Lib */
import dayjs from 'dayjs';
import LiveClock from '@/app/_component/LiveClock';

import useLoaderStore from '@/store/useLoaderStore';

/** MUI */
import { Box, Button, Typography } from '@mui/material';
import { ArrowForwardRounded, AccessTimeRounded } from '@mui/icons-material';

/** Custom */
import ColTitleAndText from '@/app/_component/layoutElement/ColTitleAndText';
import { CURRENTSTATE, ATTENDANCETYPE } from '@/constant/attendanceConst';

/** Type / Interface */
import { attendanceService, AttendanceResDto } from '@/app/services/attendanceService';
import { attendanceType } from '@/type/types';

export default function AttendanceComp({ attendanceData, onSuccess }: { attendanceData?: AttendanceResDto; onSuccess?: () => void }) {
	const router = useRouter();
	const { loader, setLoader } = useLoaderStore();

	const [workingStatus, setWorkingStatus] = useState('BEFORE_WORK');
	const [activated, setActived] = useState<boolean>(false);
	const [workData, setWorkData] = useState<AttendanceResDto>({});

	useEffect(() => {
		if (attendanceData && attendanceData.dayData) {
			if (attendanceData.dayData.endTime) {
				setWorkingStatus('AFTER_WORK');
			} else if (attendanceData.dayData.startTime) {
				setWorkingStatus('WORKING');
			} else {
				setWorkingStatus('BEFORE_WORK');
			}

			setActived(Boolean(attendanceData.dayData.startTime));
			setWorkData(attendanceData);
		}
	}, [attendanceData]);

	const onClickWorkingStatusButton = async (event: React.MouseEvent<HTMLButtonElement>) => {
		if (!loader) {
			setLoader(true);
		}

		try {
			if (activated) {
				finishTimeAttendanceData();
			} else {
				startTimeAttendanceData();
			}
		} finally {
			setLoader(false);
		}
	};

	const findUserLocate = (): Promise<GeolocationCoordinates> => {
		//getCurrentPosition 비동기이기때문에 findUserLocate의 return값을 가지고 뭔가 하고 싶으면 Promise사용
		return new Promise((resolve, reject) => {
			if (!navigator.geolocation) {
				return reject(new Error('Geolocation not supported'));
			}

			navigator.geolocation.getCurrentPosition(
				(pos) => resolve(pos.coords),
				(err) => reject(err),
				{ enableHighAccuracy: true },
			);
		});
	};

	const startTimeAttendanceData = async () => {
		try {
			const currentTime = dayjs();
			await attendanceService.startTimeAttendanceData({
				attendanceId: attendanceData?.dayData.attendanceId,
				memberId: secureLocalStorage.getItem('memberId') as number,
				startTime: currentTime.format('YYYY-MM-DD HH:mm'),
			});

			if (confirm('출근이 정상적으로 등록되었습니다.')) {
				setActived(true);
				if (onSuccess) onSuccess();
			}
		} finally {
		}
	};

	const finishTimeAttendanceData = async () => {
		try {
			const currentTime = dayjs();
			await attendanceService.finishTimeAttendanceData({
				attendanceId: attendanceData?.dayData.attendanceId,
				memberId: secureLocalStorage.getItem('memberId') as number,
				endTime: currentTime.format('YYYY-MM-DD HH:mm'),
			});

			if (confirm('퇴근이 정상적으로 등록되었습니다.')) {
				setActived(true);
				if (onSuccess) onSuccess();
			}
		} finally {
		}
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', padding: '1rem 1.5rem' }}>
			<Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
				<LiveClock />
				<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
					<AccessTimeRounded sx={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
					<Typography variant='subtitle2' whiteSpace='nowrap'>
						{workData && (
							<>
								{ATTENDANCETYPE[workData?.attendanceType]} ({workData.startTime ? dayjs(workData.startTime, 'HH:mm:ss').format('HH:mm') : '-'} ~{' '}
								{workData.endTime ? dayjs(workData.endTime, 'HH::mm:ss').format('HH:mm') : '-'})
							</>
						)}
					</Typography>
				</Box>
			</Box>

			<Box
				sx={{
					display: 'flex',
					flexDirection: { xs: 'column', sm: 'column', md: 'row' },
					flexWrap: 'wrap',
					justifyContent: { xs: 'center', sm: 'center', md: 'space-between' },
					alignItems: 'center',
					marginTop: '1rem',
				}}
			>
				<Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', gap: '0.5rem' }}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							width: '8rem',
							justifyContent: 'center',
							alignItems: 'center',
							padding: '1rem',
							borderRadius: '1rem',
							border: '2px solid',
							borderColor: workingStatus === 'WORKING' ? 'primary.500' : workingStatus === 'AFTER_WORK' ? 'primary.700' : 'grey.300',
							gap: { sm: '0.5rem', md: '1rem', lg: '1.5rem' },
						}}
					>
						<Typography
							sx={{
								fontSize: '1rem',
								fontWeight: 600,
								color: workingStatus === 'WORKING' ? 'primary.500' : workingStatus === 'AFTER_WORK' ? 'primary.700' : 'grey.300',
							}}
						>
							{CURRENTSTATE[workingStatus]}
						</Typography>
					</Box>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							flexWrap: 'wrap',
							flexGrow: 1,
							justifyContent: 'center',
							alignItems: 'center',
							padding: '1rem',
							borderRadius: '1rem',
							backgroundColor: 'grey.100',
							gap: { sm: '0.5rem', md: '1rem', lg: '1.5rem' },
						}}
					>
						<ColTitleAndText subtitle={'출근 시간'}>
							<Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
								<Typography variant='h5'>
									{workData?.dayData?.startTime ? dayjs(workData.dayData.startTime).format('HH:mm') : '--:--'}
								</Typography>
							</Box>
						</ColTitleAndText>
						<ArrowForwardRounded />
						<ColTitleAndText subtitle={'퇴근 시간'}>
							<Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
								<Typography variant='h5'>{workData?.dayData?.endTime ? dayjs(workData.dayData.endTime).format('HH:mm') : '--:--'}</Typography>
							</Box>
						</ColTitleAndText>
					</Box>
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
					<Button
						variant='contained'
						size='large'
						sx={{ flexGrow: '1' }}
						onClick={onClickWorkingStatusButton}
						disabled={workingStatus === 'AFTER_WORK'}
					>
						{activated ? '퇴근하기' : '출근하기'}
					</Button>
					<Button variant='outlined' size='large' onClick={() => router.push('/attendance/user/modal?type=request')}>
						요청하기
					</Button>
				</Box>
			</Box>
		</Box>
	);
}
