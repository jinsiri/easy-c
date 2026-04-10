'use client';

import { useEffect, useState, useRef } from 'react';
import secureLocalStorage from 'react-secure-storage';
import { useRouter, usePathname } from 'next/navigation';

/** Lib */
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import useLoaderStore from '@/store/useLoaderStore';
import useModalStore from '@/store/useModalStore';

/** MUI */
import { Box, Button, Grid, IconButton, Typography, useTheme } from '@mui/material';
import { ArrowLeftRounded, ArrowRightRounded } from '@mui/icons-material';

/** Ag Grid */
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import ColTitleAndText from '@/app/_component/layoutElement/ColTitleAndText';
import Calendar from '@/app/(main)/attendance/Calendar';
import AttendanceComp from '@/app/_component/layoutElement/AttendanceComp';
import ButtonFieldDatePicker from '@/app/_component/ButtonFieldDatePicker';
import CustomEchartComp from '@/app/_lib/CustomEchartComp';
import { colDefs } from '@/constant/attendanceColDef';
import { formatMinutes } from '@/utils/commonFunc';

/** Type / Interface */
import { dayName } from '@/type/types';
import { attendanceService, AttendanceResDto, CalendarData } from '@/app/services/attendanceService';
import { attendanceApplicationService, AttendanceApplicationResponseDto } from '@/app/services/attendanceApplicationService';
import { useDialogStore } from '@/store/useDialogStore';

dayjs.extend(duration);

export default function AttendanceUserPage() {
	const theme = useTheme();
	const router = useRouter();
	const pathName = usePathname();
	const { alert } = useDialogStore();
	const { loader, setLoader } = useLoaderStore();
	const { isRefresh, setIsRefresh, setModalData } = useModalStore();

	const gridRef = useRef();

	const [attendanceData, setAttenceData] = useState<AttendanceResDto>({});
	const [calendarDate, setCalendarDate] = useState<dayjs.Dayjs>(dayjs());
	const [calendarData, setCalendarData] = useState<Record<dayName, CalendarData>[]>([]);
	const [attendanceAppData, setAttendanceData] = useState<AttendanceApplicationResponseDto[]>([]);
	const [chartOption, setChartOption] = useState<Record<string, any>>({});

	useEffect(() => {
		//금일 및 금주 데이터
		getAttendanceTodayData();
	}, []);

	useEffect(() => {
		//해당하는 달의 날짜 정보 및 달력에 표시할 데이터 불러오기
		getAttendanceCalendarData();
		getAttendancAppData();
	}, [calendarDate]);

	useEffect(() => {
		if (pathName === '/attendance/user' && isRefresh) {
			//근태수정요청 데이터
			getAttendancAppData();
			setIsRefresh(false);
		}
	}, [pathName]);

	const getAttendanceTodayData = async () => {
		if (!loader) setLoader(true);

		try {
			const today = dayjs();
			const res = await attendanceService.getAttendanceTodayData({
				memberId: secureLocalStorage.getItem('memberId') as number,
				workDate: today.format('YYYY-MM-DD HH:mm'),
			});

			if (res) {
				setAttenceData(res);
				makeChartOption(res);
			}
		} finally {
			setLoader(false);
		}
	};

	const getAttendanceCalendarData = async () => {
		if (!loader) setLoader(true);

		try {
			const res = await attendanceService.getAttendanceCalendarData({
				memberId: secureLocalStorage.getItem('memberId') as number,
				workDate: calendarDate.format('YYYY-MM-DD HH:mm'),
			});

			setCalendarData(res);
		} finally {
			setLoader(false);
		}
	};

	const getAttendancAppData = async () => {
		if (!loader) setLoader(true);

		try {
			const res = await attendanceApplicationService.getUserMonthAttendanceApplication({
				memberId: secureLocalStorage.getItem('memberId') as number,
				workDate: calendarDate.format('YYYY-MM-DD HH:mm'),
			});

			console.log(res);
			setAttendanceData(res);
		} finally {
			setLoader(false);
		}
	};

	const makeChartOption = (data: AttendanceResDto) => {
		const _option = {
			grid: {
				left: 0,
				right: 0,
			},
			xAxis: {
				axisLabel: {
					show: true,
					color: 'rgba(0,0,0,0)',
				},
				splitLine: {
					show: false,
				},
				max: data.maxPolicyWorkTime,
			},
			yAxis: {
				data: [''],
				nameGap: 0,
				inverse: false,
			},
			series: [
				{
					type: 'bar',
					showBackground: true,
					barWidth: 15,
					itemStyle: {
						color: {
							type: 'linear',
							x: 0,
							x2: 1,
							colorStops: [
								{
									offset: 0,
									color: theme.palette.primary.main,
								},
								{
									offset: 1,
									color: '#61fbd5',
								},
							],
						},
					},
					data: [data.workTime],
					backgroundStyle: {
						color: 'rgba(180, 180, 180, 0.2)',
					},
					markLine: {
						symbol: ['none'],
						label: {
							show: true,
							position: 'start',
							fontFamily: 'Pretendard Variable',
							color: theme.palette.grey[700],
							formatter: (item) => formatMinutes(item.value),
						},
						lineStyle: {
							type: 'dashed',
							color: theme.palette.grey[500],
						},
						clip: false,
						data: [{ xAxis: data.effectiveWorkTime }, { xAxis: data.maxPolicyWorkTime }],
					},
					markArea: {
						itemStyle: {
							color: 'rgba(0, 0, 0, 0.03)',
						},
						data: [
							[
								{
									xAxis: data.effectiveWorkTime,
								},
								{
									xAxis: data.maxPolicyWorkTime,
								},
							],
						],
					},
				},
			],
		};

		setChartOption(_option);
	};

	const onSuccessEvent = async () => {
		setLoader(true);

		try {
			await Promise.all([getAttendanceTodayData(), getAttendanceCalendarData(), getAttendancAppData()]);
		} finally {
			setLoader(false);
		}
	};

	const onChangeDatePicker = (value) => {
		if (value != null) {
			setCalendarDate(value);
		}
	};

	const onClickDetail = (data: any) => {
		setModalData(data);
		router.push('/attendance/user/modal?mode=detail');
	};

	const onClickRemove = async (data: any) => {
		if (data.attendanceApplicationId) {
			if (confirm('근태수정요청을 취소하시겠습니까>')) {
				if (gridRef.current) {
					gridRef.current.api.applyTransaction({
						remove: [data],
					});
				} else {
					setAttendanceData((prev) => prev.filter((item) => item.attendanceApplicationId !== data.attendanceApplicationId));
				}

				await attendanceApplicationService.deleteUserAttendanceApplication(data.attendanceApplicationId);
				await alert('근태수정요청이 성공적으로 취소되었습니다.');
			}
		}
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs />
			<Grid container spacing={2} sx={{ flexDirection: 'column', flexGrow: 1 }}>
				<Grid
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', sm: 'column', md: 'row' },
						borderRadius: '1rem',
						borderWidth: '1px',
						borderStyle: 'solid',
						borderColor: 'grey.300',
					}}
				>
					<Box sx={{ width: { sm: '100%', md: '50%' } }}>
						<AttendanceComp type={null} attendanceData={attendanceData} onSuccess={onSuccessEvent} />
					</Box>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							width: { sm: '100%', md: '50%' },
							padding: '1rem 1.5rem',
							borderLeftWidth: '1px',
							borderStyle: 'solid',
							borderColor: 'grey.300',
							gap: '1rem',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<Typography variant='h6'>
								주간 누적
								<Typography component={'span'} variant='h6' sx={{ marginLeft: '0.5rem', color: 'primary.main' }}>
									{formatMinutes(attendanceData.workTime)}
								</Typography>
							</Typography>
							<Typography sx={{ color: 'grey.700' }}>
								이번 주 {attendanceData.effectiveWorkTime ? Math.floor((attendanceData.workTime / attendanceData.effectiveWorkTime) * 100) : 0}%
								근무 했어요.
							</Typography>
						</Box>

						<Box sx={{ width: '100%', height: '4rem' }}>
							<CustomEchartComp chartType={'rank_bar'} option={chartOption} />
						</Box>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								gap: '0.5rem',
							}}
						>
							<ColTitleAndText subtitle={'잔여 근무일'} sx={{ flex: '1' }}>
								<Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
									<Typography variant='h6' sx={{ color: 'primary.main' }}>
										{attendanceData.effectiveWorkDay && attendanceData.effectiveWorkDay >= attendanceData.workDay
											? attendanceData.effectiveWorkDay - attendanceData.workDay
											: 0}
										d
									</Typography>
									<Typography sx={{ marginLeft: '0.25rem' }}>/ {attendanceData.effectiveWorkDay}d</Typography>
								</Box>
							</ColTitleAndText>
							<ColTitleAndText subtitle={'잔여 근로시간'} sx={{ flex: '1' }}>
								<Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
									<Typography variant='h6' sx={{ color: 'primary.main' }}>
										{formatMinutes(
											attendanceData.effectiveWorkTime && attendanceData.effectiveWorkTime >= attendanceData.workTime
												? attendanceData.effectiveWorkTime - attendanceData.workTime
												: 0,
										)}
									</Typography>
									<Typography sx={{ marginLeft: '0.25rem' }}>/ {formatMinutes(attendanceData.effectiveWorkTime)}</Typography>
								</Box>
							</ColTitleAndText>
							<ColTitleAndText subtitle={'총 근로시간'} sx={{ flex: '1' }}>
								<Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
									<Typography variant='h6'>{formatMinutes(attendanceData.workTime)}</Typography>
								</Box>
							</ColTitleAndText>
							<ColTitleAndText subtitle={'휴가'} sx={{ flex: '1' }}>
								<Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
									<Typography variant='h6'>{formatMinutes(attendanceData.vacationTime)}</Typography>
								</Box>
							</ColTitleAndText>
						</Box>
					</Box>
				</Grid>
				<Grid size={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
					<IconButton
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							width: '1.25rem',
							height: '1.25rem',
							borderRadius: '100%',
							border: '2px solid',
							borderColor: 'grey.900',
						}}
						onClick={(e) => setCalendarDate((prev) => prev.subtract(1, 'month'))}
					>
						<ArrowLeftRounded sx={{ fontSize: '1.5rem', strokeWidth: 5 }} />
					</IconButton>

					<Box sx={{ display: 'flex', alignItems: 'center', margin: '0 2rem' }}>
						<Typography variant='h5' sx={{ marginRight: 0.5 }}>
							{calendarDate.format('YYYY-MM')}
						</Typography>
						<ButtonFieldDatePicker value={calendarDate} views={['month', 'year']} onChange={onChangeDatePicker} />
					</Box>
					<IconButton
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							width: '1.25rem',
							height: '1.25rem',
							borderRadius: '100%',
							border: '2px solid',
							borderColor: 'grey.900',
						}}
						onClick={(e) => setCalendarDate((prev) => prev.add(1, 'month'))}
					>
						<ArrowRightRounded sx={{ fontSize: '1.5rem' }} />
					</IconButton>
				</Grid>
				<Grid size={12} sx={{ flexGrow: 1 }}>
					<Calendar calendarRow={calendarData} />
				</Grid>
				<Grid sx={{ display: 'flex', flexDirection: { lg: 'row', md: 'column', sm: 'column', xs: 'column' }, minHeight: '15rem', gap: '1rem' }}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							width: '100%',
							backgroundColor: 'grey.50',
							border: '1px solid',
							borderColor: 'grey.200',
							borderRadius: '1rem',
						}}
					>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0.5rem 0.5rem 1rem' }}>
							<Typography variant='subtitle1'>근태 수정 요청 내역</Typography>
							<Button onClick={(e) => router.push(`/attendance/user/list`)}>더보기</Button>
						</Box>
						<Box sx={{ flexGrow: 1, minHeight: '10rem', pb: '1rem', borderRadius: '1rem', backgroundColor: '#fff' }}>
							<CustomAgGridComp
								ref={gridRef}
								rowData={attendanceAppData}
								colDefs={colDefs(onClickDetail, onClickRemove)}
								rowSelectionMode='none'
								rowHeight={56}
								pagination={false}
							/>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}
