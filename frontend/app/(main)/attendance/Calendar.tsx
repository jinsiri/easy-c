'use client';

import React, { ReactNode, useEffect, useState } from 'react';

/** MUI */
import { Box, Button, Grid, Typography, useTheme } from '@mui/material';

/** lib */
import dayjs from 'dayjs';
import CustomReactCalendarTimeline from '../../_lib/CustomReactCalendarTimeline';
import { TimelineItemBase } from 'react-calendar-timeline';

/** Custom */
import { formatMinutes } from '@/utils/commonFunc';

/** type / interface */
import { AttendanceDayResDto, CalendarData } from '@/app/services/attendanceService';
import { VACATIONTYPE, WORKSTATUS } from '@/constant/attendanceConst';
import { vacationType, workStatus, dayName } from '@/type/types';
import { useRouter } from 'next/navigation';

export interface CalendarColData {
	key: dayName;
	header: string;
}

export interface ColData {
	key: keyof AttendanceDayResDto;
	header: string;
	formatter?: (value: any, row?: AttendanceDayResDto) => React.ReactNode;
}

export interface TimelineDataInterface {
	visibleTimeStart: number | undefined;
	visibleTimeEnd: number | undefined;
	data: TimelineItemBase<Date>[];
}

const calendarCol: CalendarColData[] = [
	{ key: 'mon', header: '월요일' },
	{ key: 'tue', header: '화요일' },
	{ key: 'wed', header: '수요일' },
	{ key: 'thu', header: '목요일' },
	{ key: 'fri', header: '금요일' },
	{ key: 'sat', header: '토요일' },
	{ key: 'sun', header: '일요일' },
];

export default function Calendar({ calendarRow }: { calendarRow: Record<dayName, CalendarData>[] }) {
	const theme = useTheme();
	const router = useRouter();

	const detailCol: ColData[] = [
		{
			header: '출근 시간',
			key: 'startTime',
			formatter: (value, row) => {
				return <Typography>{value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '-'}</Typography>;
			},
		},
		{
			header: '퇴근 시간',
			key: 'endTime',
			formatter: (value, row) => {
				return <Typography>{value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '-'}</Typography>;
			},
		},
		{
			header: '근로 상태',
			key: 'workStatus',
			formatter: (value, row) => {
				return (
					<Typography>
						{row?.vacationType
							? WORKSTATUS[value as workStatus] + ' - ' + VACATIONTYPE[row?.vacationType as vacationType]
							: WORKSTATUS[value as workStatus]}
					</Typography>
				);
			},
		},
		{
			header: '총 근로시간',
			key: 'fullTime',
			formatter: (value, row) => {
				return formatMinutes(value);
			},
		},
		{
			header: '초과 근로시간',
			key: 'overTime',
			formatter: (value, row) => {
				return formatMinutes(value);
			},
		},
		{
			header: '상세',
			key: 'detail',
			formatter: () => {
				return (
					<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
						<Button size='small' onClick={() => router.push('/attendance/user/modal?type=detail')}>
							수정
						</Button>
					</Box>
				);
			},
		},
	];

	const [targetCalendarRow, setTargetCalendarRow] = useState<Record<dayName, CalendarData>[]>([]);
	const [activeCell, setActiveCell] = useState<string | null>(null);
	const [activeTimelineData, setActiveTimelineData] = useState<TimelineDataInterface>({
		visibleTimeStart: undefined,
		visibleTimeEnd: undefined,
		data: [],
	});

	useEffect(() => {
		if (calendarRow) {
			setTargetCalendarRow(calendarRow);
		}
	}, [calendarRow]);

	const onClickCell = (event: React.MouseEvent<HTMLElement>, target: string) => {
		event.preventDefault();

		if (target === activeCell) {
			setActiveCell(null);
			setActiveTimelineData([]);
		} else {
			setActiveCell(target);
			setActiveTimelineData(makeTimelineData(target));
		}
	};

	const makeTimelineData = (target: string): TimelineDataInterface => {
		const [rowIdx, colIdx] = target.split('_').map(Number);
		const rowData = targetCalendarRow[rowIdx]?.[calendarCol[colIdx].key];
		const detail = targetCalendarRow[rowIdx]?.[calendarCol[colIdx].key]?.detailData;

		const baseDate = dayjs()
			.year(rowData.year)
			.month(rowData.month - 1)
			.date(rowData.day);

		const visibleTimeStart = baseDate.startOf('day').valueOf();
		const visibleTimeEnd = baseDate.endOf('day').valueOf();

		if (!detail?.startTime || !detail?.endTime) {
			return {
				visibleTimeStart,
				visibleTimeEnd,
				data: [],
			};
		}

		const start = dayjs(detail.startTime);
		const end = dayjs(detail.endTime);

		return {
			// 해당 날짜의 00:00:00와 23:59:59
			visibleTimeStart: visibleTimeStart,
			visibleTimeEnd: visibleTimeEnd,
			data: [
				{
					id: `item-${target}`, // ID 중복 방지를 위해 target 활용 권장
					group: 'group1',
					start_time: start.toDate(),
					end_time: end.toDate(),
					canMove: false,
					canResize: false,
					canChangeGroup: false,
					itemProps: {
						style: {
							background: theme.palette.primary[500],
							borderWidth: 0,
						},
					},
				},
			],
		};
	};

	const getDayColor = (currentMonth: boolean, holiday: boolean, dayKey: dayName) => {
		if (!currentMonth) return 'grey.500';
		if (holiday) return 'error.500';

		switch (dayKey) {
			case 'sat':
				return 'info.500';
			case 'sun':
				return 'error.500';
			default:
				return 'inherit'; // 또는 기본 색상
		}
	};

	const getTimelineInnerData = (target: any): ReactNode => {
		if (target instanceof Date) {
			return target ? dayjs(target).format('YYYY-MM-DD HH:mm') : '-';
		} else {
			return target;
		}
	};

	return (
		<Grid container sx={{ flexDirection: 'column', border: `1px solid`, borderColor: 'grey.300', borderRadius: '1rem' }}>
			{targetCalendarRow.map((item: Record<dayName, CalendarData>, idx: number) => {
				return (
					<Grid
						key={idx}
						sx={{
							width: '100%',
							...(idx !== 0 && {
								marginTop: '-1px',
								borderTop: `1px solid`,
								borderColor: 'grey.300',
							}),
						}}
					>
						<Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
							{calendarCol.map((subItem: CalendarColData, subIdx: number) => {
								return (
									<Box
										key={`${idx}_${subIdx}`}
										sx={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											width: `calc(100% /${calendarCol.length - 1})`,
											...(subIdx !== 0 && {
												marginLeft: '-1px',
												borderLeft: `1px solid`,
												borderColor: 'grey.300',
											}),
											...(activeCell === idx + '_' + subIdx && {
												outline: `2px solid`,
												outlineColor: 'primary.main',
												zIndex: 2,
											}),
											cursor: 'pointer',
										}}
										onClick={(e) => onClickCell(e, `${idx}_${subIdx}`)}
									>
										<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
											<Box
												sx={{
													display: 'flex',
													width: '100%',
													padding: '0.375rem 0.625rem',
													borderBottom: `1px solid`,
													borderColor: 'grey.300',
												}}
											>
												<Typography
													sx={{
														marginRight: '0.5rem',
														fontWeight: 'bold',
														color: getDayColor(item[subItem.key].isCurrentMonth, item[subItem.key].isHoliday, subItem.key),
													}}
												>
													{item[subItem.key].day}
												</Typography>
												<Typography
													sx={{
														display: { xs: 'none', md: 'block' },
														color: getDayColor(item[subItem.key].isCurrentMonth, item[subItem.key].isHoliday, subItem.key),
													}}
												>
													{subItem.header}
												</Typography>
											</Box>
											<Box sx={{ height: '6rem', padding: '0.5rem' }}>
												<Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
													{item[subItem.key].isHoliday && (
														<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
															<Typography sx={{ color: 'error.500' }}>{item[subItem.key]?.holidaySubject ?? ''}</Typography>
														</Box>
													)}
													{item[subItem.key].detailData.workStatus === 'VACATION' && (
														<Typography
															sx={{
																display: 'flex',
																justifyContent: 'center',
																alignItems: 'center',
																marginBottom: '0.5rem',
																padding: '0.125rem 0.5rem',
																fontSize: '0.75rem',
																fontWeight: 600,
																backgroundColor: 'secondary.main',
																borderRadius: '1rem',
																color: 'grey.50',
															}}
														>
															{VACATIONTYPE[item[subItem.key].detailData.vacationType as vacationType]}
														</Typography>
													)}
													{item[subItem.key].detailData.workStatus === 'OUTSIDE' && (
														<Typography
															sx={{
																display: 'flex',
																justifyContent: 'center',
																alignItems: 'center',
																marginBottom: '0.5rem',
																padding: '0.125rem 0.5rem',
																fontSize: '0.75rem',
																fontWeight: 600,
																backgroundColor: 'secondary.main',
																borderRadius: '1rem',
																color: 'grey.50',
															}}
														>
															{WORKSTATUS[item[subItem.key].detailData.workStatus as workStatus]}
														</Typography>
													)}
												</Box>

												{item[subItem.key].detailData.startTime && (
													<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
														<Typography
															variant={'caption'}
															sx={{
																display: 'flex',
																justifyContent: 'center',
																alignItems: 'center',
																width: '1.125rem',
																height: '1.125rem',
																marginRight: '0.25rem',
																borderRadius: '100%',
																fontSize: '0.625rem',
																backgroundColor: 'primary.100',
																color: 'primary.600',
															}}
														>
															출
														</Typography>
														<Typography>
															{item[subItem.key]?.detailData.startTime
																? dayjs(item[subItem.key].detailData.startTime).format('HH:mm')
																: ''}
														</Typography>
													</Box>
												)}
												{item[subItem.key].detailData.endTime && (
													<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
														<Typography
															sx={{
																display: 'flex',
																justifyContent: 'center',
																alignItems: 'center',
																width: '1.125rem',
																height: '1.125rem',
																marginRight: '0.25rem',
																borderRadius: '100%',
																fontSize: '0.625rem',
																backgroundColor: 'primary.main',
																color: 'grey.50',
															}}
														>
															퇴
														</Typography>
														<Typography>
															{item[subItem.key]?.detailData.endTime
																? dayjs(item[subItem.key].detailData.endTime).format('HH:mm')
																: ''}
														</Typography>
													</Box>
												)}
											</Box>
										</Box>
									</Box>
								);
							})}
						</Box>
						{activeCell && Number(activeCell.split('_')[0]) === idx && (
							<Box sx={{ padding: '0.5rem', borderTop: `1px solid`, borderColor: 'grey.300' }}>
								<Box sx={{ minHeight: '12rem' }}>
									<Box sx={{ display: 'flex', width: '100%', height: '5rem' }}>
										{detailCol.map((detailItem, detailIdx) => {
											return (
												<Box key={`${activeCell}_${detailIdx}`} sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
													<Box
														className={'text-ellipsis'}
														sx={{
															width: '100%',
															height: '2.5rem',
															padding: '0.5rem',
															textAlign: 'center',
															borderBottom: `1px solid`,
															borderColor: 'grey.300',
														}}
													>
														{detailItem.header}
													</Box>
													<Box
														className={'text-ellipsis'}
														sx={{
															width: '100%',
															height: '2.5rem',
															padding: '0.5rem',
															textAlign: 'center',
														}}
													>
														{detailItem.formatter
															? detailItem.formatter(
																	item[calendarCol[Number(activeCell.split('_')[1])].key].detailData[detailItem.key],
																	item[calendarCol[Number(activeCell.split('_')[1])].key].detailData,
																)
															: getTimelineInnerData(
																	item[calendarCol[Number(activeCell.split('_')[1])].key].detailData[detailItem.key],
																)}
													</Box>
												</Box>
											);
										})}
									</Box>
									<Box
										sx={{
											overflow: 'hidden',
											width: '100%',
											minHeight: '6rem',
											mt: '0.5rem',
											padding: '1rem',
											backgroundColor: 'grey.50',
											borderRadius: '1rem',
										}}
									>
										<CustomReactCalendarTimeline
											itemList={activeTimelineData.data}
											visibleTimeStart={activeTimelineData.visibleTimeStart}
											visibleTimeEnd={activeTimelineData.visibleTimeEnd}
										/>
									</Box>
								</Box>
							</Box>
						)}
					</Grid>
				);
			})}
		</Grid>
	);
}
