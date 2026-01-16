'use client';

import { useEffect, useState } from 'react';

/** Lib */
import axiosConfig from '@/app/_lib/axiosConfig';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

/** MUI */
import { Box, Grid, Typography } from '@mui/material';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import ColTitleAndText from '@/app/_component/layoutElement/ColTitleAndText';
import Calendar from '@/app/_component/Calendar';
import AttendanceComp from '@/app/_component/baseElement/AttendanceComp';
import { formatMinutes } from '@/app/_utils/commonFunc';

/** Type / Interface */
import { attendanceReqInterface, AttendanceResInterface } from '@/type/AttendanceInterface';

dayjs.extend(duration);

export default function AttendanceUserPage() {
	const [attendanceData, setAttenceData] = useState<AttendanceResInterface>({});
	const [calendarData, setCalendarData] = useState([]);

	useEffect(() => {
		//금일 및 금주 데이터
		getAttendanceTodayData();

		//해당하는 달의 날짜 정보 및 달력에 표시할 데이터 불러오기
		getAttendanceCalendarData();
	}, []);

	const getAttendanceTodayData = () => {
		const today = dayjs();
		const req: attendanceReqInterface = {
			memberId: 1,
			workDate: today.format('YYYY-MM-DD'),
		};

		axiosConfig
			.post('/api/attendance/today', req)
			.then((res) => {
				if (res.data) {
					setAttenceData(res.data);
				}
			})
			.catch((err) => {});
	};

	const getAttendanceCalendarData = () => {
		const today = dayjs();
		const req: attendanceReqInterface = {
			memberId: 1,
			workDate: today.format('YYYY-MM-DD'),
		};

		axiosConfig
			.post('/api/attendance/calendar', req)
			.then((res) => {
				if (Object.keys(res.data).length > 0) {
					setCalendarData(res.data);
				}
			})
			.catch((err) => {});
	};

	const onSuccessEvent = () => {
		getAttendanceTodayData();
		getAttendanceCalendarData();
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs />
			<Grid container spacing={2}>
				<Grid
					size={12}
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', sm: 'column', md: 'row' },
						borderRadius: '1rem',
						borderWidth: '1px',
						borderStyle: 'solid',
						borderColor: 'gray.300',
						gap: '1rem',
					}}
				>
					<Box sx={{ width: { sm: '100%', md: '50%' } }}>
						<AttendanceComp attendanceData={attendanceData} onSuccess={onSuccessEvent} />
					</Box>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							width: { sm: '100%', md: '50%' },
							padding: '1rem 1.5rem',
							borderLeftWidth: '1px',
							borderStyle: 'solid',
							borderColor: 'gray.300',
							gap: '1rem',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<Box sx={{ display: 'flex', flexDirection: 'row' }}>
								<Typography variant='h6'>주간 누적</Typography>
								<Typography variant='h6' sx={{ marginLeft: '0.5rem', color: 'primary.main' }}>
									{formatMinutes(attendanceData.workTime)}
								</Typography>
							</Box>
							<Typography sx={{ color: 'gray.700' }}>이번 주 14시간 46분이 더 필요해요.</Typography>
						</Box>

						<Box sx={{ width: '100%', height: '4rem' }}></Box>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								gap: '0.5rem',
							}}
						>
							<ColTitleAndText subtitle={'잔여 근무일'} sx={{ flex: '1' }}>
								<Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', textAlign: 'center' }}>
									<Typography variant='h6' sx={{ color: 'primary.main' }}>
										{attendanceData.totalWorkDay ? attendanceData.totalWorkDay - attendanceData.workDay : 0}d
									</Typography>
									<Typography sx={{ marginLeft: '0.25rem' }}>/ {attendanceData.totalWorkDay}d</Typography>
								</Box>
							</ColTitleAndText>
							<ColTitleAndText subtitle={'잔여 근로시간'} sx={{ flex: '1' }}>
								<Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', textAlign: 'center' }}>
									<Typography variant='h6' sx={{ color: 'primary.main' }}>
										{formatMinutes(attendanceData.totalWorkTime ? attendanceData.totalWorkTime - attendanceData.workTime : 0)}
									</Typography>
									<Typography sx={{ marginLeft: '0.25rem' }}>/ {formatMinutes(attendanceData.totalWorkTime)}</Typography>
								</Box>
							</ColTitleAndText>
							<ColTitleAndText subtitle={'총 근로시간'} sx={{ flex: '1' }}>
								<Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
									<Typography variant='h6'>{formatMinutes(attendanceData.workTime)}</Typography>
								</Box>
							</ColTitleAndText>
							<ColTitleAndText subtitle={'휴가'} sx={{ flex: '1' }}>
								<Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
									<Typography variant='h6'>{formatMinutes(attendanceData.vacationTime)}</Typography>
								</Box>
							</ColTitleAndText>
						</Box>
					</Box>
				</Grid>
				<Grid size={12} sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
					<Typography variant='h5'>{dayjs().format('YYYY-MM-DD')}</Typography>
				</Grid>
				<Grid size={12}>
					<Calendar calendarRow={calendarData} />
				</Grid>
			</Grid>
		</Box>
	);
}
