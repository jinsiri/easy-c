'use client';

import { useEffect, useState } from 'react';

/** Lib */
import dayjs from 'dayjs';
import LiveClock from '@/app/_component/LiveClock';
import axiosConfig from '@/app/_lib/axiosConfig';

/** MUI */
import { Box, Button, Typography } from '@mui/material';
import { ArrowForwardRounded, AccessTimeRounded } from '@mui/icons-material';

/** Custom */
import ColTitleAndText from '@/app/_component/layoutElement/ColTitleAndText';

/** Type / Interface */
import { attendanceSaveReqInterface, AttendanceResInterface } from '@/type/AttendanceInterface';

export default function AttendanceComp({ attendanceData, onSuccess }: { attendanceData?: AttendanceResInterface; onSuccess?: () => void }) {
	const [workingStatus, setWorkingStatus] = useState('before_work');
	const [activated, setActived] = useState<boolean>(false);
	const [workData, setWorkData] = useState<AttendanceResInterface>({});

	useEffect(() => {
		if (attendanceData && attendanceData.dayData) {
			if (attendanceData.dayData.endTime) {
				setWorkingStatus('after_work');
			} else if (attendanceData.dayData.startTime) {
				setWorkingStatus('working');
			} else {
				setWorkingStatus('before_work');
			}

			setActived(Boolean(attendanceData.dayData.startTime));
			setWorkData(attendanceData);
		}
	}, [attendanceData]);

	const onClickWorkingStatusButton = async (event: React.MouseEvent<HTMLButtonElement>) => {
		try {
			const locate = await findUserLocate();

			if (activated) {
				finishTimeAttendanceData(locate);
			} else {
				startTimeAttendanceData(locate);
			}
		} catch (error) {
			console.error('위치 획득 실패:', error);
			alert('위치 정보 권한을 허용해주세요.');
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

	const startTimeAttendanceData = (locate: GeolocationCoordinates) => {
		const currentTime = dayjs();

		const req: attendanceSaveReqInterface = {
			memberId: 1,
			startTime: currentTime.format('YYYY-MM-DD HH:mm:ss'),
			registerLatitude: locate ? locate.latitude : null,
			registerLongitude: locate ? locate.longitude : null,
		};

		axiosConfig
			.post('/api/attendance/start', req)
			.then((res) => {
				if (res.data.status === 'success') {
					setActived(true);
					if (onSuccess) onSuccess();
				} else {
					alert(res.data.message);
				}
			})
			.catch((err) => {});
	};

	const finishTimeAttendanceData = (locate: GeolocationCoordinates) => {
		const currentTime = dayjs();

		const req: attendanceSaveReqInterface = {
			memberId: 1,
			endTime: currentTime.format('YYYY-MM-DD HH:mm:ss'),
			registerLatitude: locate ? locate.latitude : null,
			registerLongitude: locate ? locate.longitude : null,
		};

		axiosConfig
			.post('/api/attendance/finish', req)
			.then((res) => {
				if (res.data.status === 'success') {
					setActived(true);
					if (onSuccess) onSuccess();
				} else {
					alert(res.data.message);
				}
			})
			.catch((err) => {});
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
							backgroundColor: 'gray.100',
							gap: { sm: '0.5rem', md: '1rem', lg: '1.5rem' },
						}}
					>
						근무 전
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
							backgroundColor: 'gray.100',
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
						disabled={workingStatus === 'after_work'}
					>
						{activated ? '퇴근하기' : '출근하기'}
					</Button>
					<Button variant='outlined' size='large'>
						요청하기
					</Button>
				</Box>
			</Box>
		</Box>
	);
}
