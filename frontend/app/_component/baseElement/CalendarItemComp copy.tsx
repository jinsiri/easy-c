'use client';

import React, { useState } from 'react';

/** MUI */
import { Box, Grid, Typography } from '@mui/material';

/** lib */
import dayjs from 'dayjs';
import { TimelineItemBase } from 'react-calendar-timeline';

/** Custom */
import CalendarItemDetailComp from './CalendarItemDetailComp';

/** type / interface */
import { AttendanceDayResDto, CalendarData } from '@/app/services/attendanceService';
import { dayName } from '@/type/types';
import { CalendarDayDto } from '@/app/services/scheduleService';

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

export default function CalendarItemComp({ calendarRow }: { calendarRow: Record<dayName, CalendarData | CalendarDayDto>[] }) {
	const [activeCell, setActiveCell] = useState<string | null>(null);

	//function
	const onClickCell = (event: React.MouseEvent<HTMLElement>, target: string) => {
		event.preventDefault();

		if (target === activeCell) {
			setActiveCell(null);
		} else {
			setActiveCell(target);
		}
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

	return (
		<Grid container sx={{ flexDirection: 'column', border: `1px solid`, borderColor: 'grey.300', borderRadius: '1rem' }}>
			{calendarRow &&
				calendarRow.map((item: Record<dayName, CalendarData | CalendarDayDto>, idx: number) => {
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
												overflow: 'hidden',
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
													zIndex: 15,
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
															textWrap: 'nowrap',
															textOverflow: 'ellipsis',
															whiteSpace: 'nowrap',
															color: getDayColor(item[subItem.key].isCurrentMonth, item[subItem.key].isHoliday, subItem.key),
														}}
													>
														{subItem.header}
													</Typography>
												</Box>
												<Box sx={{ display: 'flex', flexDirection: 'column', height: '6rem' }}>
													<Box
														sx={{
															width: '100%',
															zIndex: 10,
														}}
													>
														{item[subItem.key].detailData.workStatus === 'VACATION' &&
															item[subItem.key].detailData.vacationType === 'FULL' && (
																<Box
																	sx={{
																		padding: '0.125rem 0.5rem',
																		bgcolor: 'primary.50',
																		color: 'primary.500',
																	}}
																>
																	휴가
																</Box>
															)}
														{item[subItem.key].detailData.workStatus === 'OUTSIDE' && (
															<Box
																sx={{
																	padding: '0.125rem 0.5rem',
																	bgcolor: 'secondary.50',
																	color: 'secondary.500',
																}}
															>
																외근
															</Box>
														)}
														{item[subItem.key].detailData.workStatus === 'BUSINESS_TRIP' && (
															<Box
																sx={{
																	padding: '0.125rem 0.5rem',
																	bgcolor: 'info.50',
																	color: 'info.500',
																}}
															>
																출장
															</Box>
														)}
													</Box>

													<Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '0.5rem 0.5rem' }}>
														{item[subItem.key].isHoliday && (
															<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '0.5rem' }}>
																<Typography sx={{ color: 'error.500' }}>{item[subItem.key]?.holidaySubject ?? ''}</Typography>
															</Box>
														)}

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
										</Box>
									);
								})}
							</Box>
							<CalendarItemDetailComp activeCell={activeCell} idx={idx} item={item} />
						</Grid>
					);
				})}
		</Grid>
	);
}
