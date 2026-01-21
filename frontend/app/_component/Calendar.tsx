'use client';

import React, { ReactNode, useEffect, useState } from 'react';

/** MUI */
import { Box, Grid, Typography, useTheme } from '@mui/material';

/** lib */
import dayjs, { Dayjs } from 'dayjs';
import CustomReactCalendarTimeline from '../_lib/CustomReactCalendarTimeline';
import { TimelineItemBase } from 'react-calendar-timeline';

/** Custom */
import { formatMinutes } from '@/utils/commonFunc';

/** type / interface */
import { AttendanceDayResInterface } from '@/type/attendanceInterface';
import { VACATIONTYPE, WORKSTATUS } from '@/constant/attendanceConst';
import { vacationType, workStatus } from '@/type/types';

type dayName = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

interface CalendarColData {
	key: dayName;
	header: string;
}

interface CalendarData {
	year: number;
	month: number;
	day: number;
	isCurrentMonth: boolean;
	defaultStartTime: Date | null;
	defaultEndTime: Date | null;
	detailData: AttendanceDayResInterface;
}

interface ColData {
	key: keyof AttendanceDayResInterface;
	header: string;
	formatter?: (value: any, row?: AttendanceDayResInterface) => React.ReactNode;
}

interface TimelineDataInterface {
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

const defaultCalendarRow: Record<dayName, CalendarData>[] = [
	{
		mon: {
			year: 2026,
			month: 1,
			day: 1,
			isCurrentMonth: true,
			detailData: {
				startTime: null,
				endTime: null,
				fullTime: null,
				overTime: null,
				vacation: '',
				confirm: '',
			},
		},
		tue: {
			year: 2026,
			month: 1,
			day: 1,
			isCurrentMonth: true,
			detailData: {
				startTime: null,
				endTime: null,
				fullTime: null,
				overTime: null,
				vacation: '',
				confirm: '',
			},
		},
		wed: {
			year: 2026,
			month: 1,
			day: 1,
			isCurrentMonth: true,
			detailData: {
				startTime: null,
				endTime: null,
				fullTime: null,
				overTime: null,
				vacation: '',
				confirm: '',
			},
		},
		thu: {
			year: 2026,
			month: 1,
			day: 1,
			isCurrentMonth: true,
			detailData: {
				startTime: null,
				endTime: null,
				fullTime: null,
				overTime: null,
				vacation: '',
				confirm: '',
			},
		},
		fri: {
			year: 2026,
			month: 1,
			day: 1,
			isCurrentMonth: true,
			detailData: {
				startTime: null,
				endTime: null,
				fullTime: null,
				overTime: null,
				vacation: '',
				confirm: '',
			},
		},
		sat: {
			year: 2026,
			month: 1,
			day: 1,
			isCurrentMonth: true,
			detailData: {
				startTime: null,
				endTime: null,
				fullTime: null,
				overTime: null,
				vacation: '',
				confirm: '',
			},
		},
		sun: {
			year: 2026,
			month: 1,
			day: 1,
			isCurrentMonth: true,
			detailData: {
				startTime: null,
				endTime: null,
				fullTime: null,
				overTime: null,
				vacation: '',
				confirm: '',
			},
		},
	},
];

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
			console.log(row);
			console.log(row?.vacationType);
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
	},
];

export default function Calendar({ calendarRow }: { calendarRow: Record<dayName, CalendarData>[] }) {
	const theme = useTheme();

	const [targetCalendarRow, setTargetCalendarRow] = useState<Record<dayName, CalendarData>[]>(defaultCalendarRow);
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

	const getDayColor = (currentMonth: boolean, dayKey: dayName) => {
		if (!currentMonth) return 'grey.500';

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
														color: getDayColor(item[subItem.key].isCurrentMonth, subItem.key),
													}}
												>
													{item[subItem.key].day}
												</Typography>
												<Typography
													sx={{
														display: { xs: 'none', md: 'block' },
														color: getDayColor(item[subItem.key].isCurrentMonth, subItem.key),
													}}
												>
													{subItem.header}
												</Typography>
											</Box>
											<Box sx={{ height: '5rem', padding: '0.5rem' }}>
												{item[subItem.key].detailData.startTime && (
													<Box sx={{ display: 'flex', flexDirection: 'row' }}>
														<Typography
															variant={'caption'}
															sx={{
																display: 'flex',
																justifyContent: 'center',
																alignItems: 'center',
																width: '1.25rem',
																height: '1.25rem',
																marginRight: '0.25rem',
																borderRadius: '100%',
																fontSize: '0.75rem',
																backgroundColor: 'primary.main',
																color: 'grey.50',
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
													<Box sx={{ display: 'flex', flexDirection: 'row' }}>
														<Typography
															sx={{
																display: 'flex',
																justifyContent: 'center',
																alignItems: 'center',
																width: '1.25rem',
																height: '1.25rem',
																marginRight: '0.25rem',
																borderRadius: '100%',
																fontSize: '0.75rem',
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
								<Box sx={{ height: '12rem' }}>
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
									<Box sx={{ overflow: 'hidden', width: '100%', height: '6rem', mt: '0.5rem' }}>
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
