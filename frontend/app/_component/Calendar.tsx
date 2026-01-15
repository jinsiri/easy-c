'use client';

import React, { useEffect, useState } from 'react';

/** MUI */
import { Box, Grid, Typography } from '@mui/material';

/** lib */
import dayjs from 'dayjs';
import CustomReactCalendarTimeline from '../_lib/CustomReactCalendarTimeline';

/** Custom */
import { formatMinutes } from '@/app/_utils/commonFunc';

/** type / interface */
import { AttendanceDayResInterface } from '@/type/AttendanceInterface';

type dayName = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

interface CalendarColData {
	key: dayName;
	header: string;
}

interface CalendarData {
	day: number;
	isCurrentMonth: boolean;
	detailData: AttendanceDayResInterface;
}

interface ColData {
	key: keyof AttendanceDayResInterface;
	header: string;
	formatter?: (value: any, row?: AttendanceDayResInterface) => React.ReactNode;
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
	const [targetCalendarRow, setTargetCalendarRow] = useState<Record<dayName, CalendarData>[]>(defaultCalendarRow);
	const [activeCell, setActiveCell] = useState<string | null>(null);

	useEffect(() => {
		if (calendarRow) {
			setTargetCalendarRow(calendarRow);
		}
	}, [calendarRow]);

	const onClickCell = (event: React.MouseEvent<HTMLElement>, target: string) => {
		event.preventDefault();

		if (target === activeCell) {
			setActiveCell(null);
		} else {
			setActiveCell(target);
		}
	};

	return (
		<Grid container sx={{ flexDirection: 'column', border: `1px solid`, borderColor: 'gray.300', borderRadius: '1rem' }}>
			{targetCalendarRow.map((item: Record<dayName, CalendarData>, idx: number) => {
				return (
					<Grid
						key={idx}
						sx={{
							width: '100%',
							...(idx !== 0 && {
								marginTop: '-1px',
								borderTop: `1px solid`,
								borderColor: 'gray.300',
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
												borderColor: 'gray.300',
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
													padding: '0.375rem 1rem',
													borderBottom: `1px solid`,
													borderColor: 'gray.300',
												}}
											>
												<Typography
													sx={{
														marginRight: '0.5rem',
														fontWeight: 'bold',
														...(item[subItem.key].isCurrentMonth ? {} : { color: 'gray.500' }),
													}}
												>
													{item[subItem.key].day}
												</Typography>
												<Typography
													sx={{
														display: { xs: 'none', md: 'block' },
														...(item[subItem.key].isCurrentMonth ? {} : { color: 'gray.500' }),
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
																color: 'gray.50',
															}}
														>
															출
														</Typography>
														<Typography>
															{item[subItem.key]?.detailData.startTime
																? dayjs(item[subItem.key].detailData.startTime).format('A HH:mm')
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
																color: 'gray.50',
															}}
														>
															퇴
														</Typography>
														<Typography>
															{item[subItem.key]?.detailData.endTime
																? dayjs(item[subItem.key].detailData.endTime).format('A HH:mm')
																: ''}
														</Typography>
													</Box>
												)}
												{/*item[subItem.key].detailData.overTime && (
													<Box sx={{ display: 'flex', alignItems: 'center' }}>
														<Box
															sx={{
																width: '2px',
																height: '0.75rem',
																marginRight: '0.25rem',
																backgroundColor: 'primary.main',
															}}
														></Box>
														<Typography variant='body2'>{item[subItem.key].detailData.overTime}</Typography>
													</Box>
												)*/}

												{/*item[subItem.key].detailData.fullTime && (
													<Box sx={{ display: 'flex', alignItems: 'center' }}>
														<Box
															sx={{
																width: '2px',
																height: '0.75rem',
																marginRight: '0.25rem',
																backgroundColor: 'primary.main',
															}}
														></Box>
														<Typography variant='body2'>{item[subItem.key].detailData.fullTime}</Typography>
													</Box>
												)*/}
											</Box>
										</Box>
									</Box>
								);
							})}
						</Box>
						{activeCell && Number(activeCell.split('_')[0]) === idx && (
							<Box sx={{ padding: '0.5rem', borderTop: `1px solid`, borderColor: 'gray.300' }}>
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
															borderColor: 'gray.300',
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
																	targetCalendarRow[idx][calendarCol[Number(activeCell.split('_')[1])].key]['detailData'][
																		detailItem.key
																	],
																)
															: targetCalendarRow[idx][calendarCol[Number(activeCell.split('_')[1])].key]['detailData'][
																	detailItem.key
																]}
													</Box>
												</Box>
											);
										})}
									</Box>
									<Box sx={{ overflow: 'hidden', width: '100%', height: '7rem', mt: '0.5rem' }}></Box>
								</Box>
							</Box>
						)}
					</Grid>
				);
			})}
		</Grid>
	);
}
