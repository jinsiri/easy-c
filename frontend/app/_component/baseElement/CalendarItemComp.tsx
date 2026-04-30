'use client';

import React, { useMemo, useState } from 'react';

/** MUI */
import { Box, Button, Grid, Typography } from '@mui/material';

/** lib */
import dayjs from 'dayjs';
import { TimelineItemBase } from 'react-calendar-timeline';

/** Custom */
import CalendarItemDetailComp from './CalendarItemDetailComp';

/** type / interface */
import { AttendanceDayResDto } from '@/app/services/attendanceService';
import { dayName } from '@/type/types';
import { CalendarDayDto, CalendarEventDto } from '@/app/services/scheduleService';

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

const DayEventList = ({ eventData, calendarType }: { eventData: CalendarEventDto; calendarType: 'attendance' | 'schedule' }) => {
	const attendanceTimeStyle = {
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
	};

	const vacationEvent = useMemo(() => {
		return (
			eventData.detailData.workStatus === 'VACATION' && (
				<Box
					sx={{
						padding: '0.125rem 0.5rem',
						bgcolor: 'primary.50',
						color: 'primary.500',
					}}
				>
					{eventData.detailData.vacationType === 'HALF_AM' ? '오전 반차' : eventData.detailData.vacationType === 'HALF_PM' ? '오후 반차' : '휴가'}
				</Box>
			)
		);
	}, [eventData]);

	const outsideEvent = useMemo(() => {
		return (
			eventData.detailData.workStatus === 'OUTSIDE' && (
				<Box
					sx={{
						padding: '0.125rem 0.5rem',
						bgcolor: 'secondary.50',
						color: 'secondary.500',
					}}
				>
					외근
				</Box>
			)
		);
	}, [eventData]);

	const businesstripEvent = useMemo(() => {
		return (
			eventData.detailData.workStatus === 'BUSINESS_TRIP' && (
				<Box
					sx={{
						padding: '0.125rem 0.5rem',
						bgcolor: 'info.50',
						color: 'info.500',
					}}
				>
					출장
				</Box>
			)
		);
	}, [eventData]);

	const attendanceEvent = useMemo(() => {
		return (
			calendarType === 'attendance' && (
				<Box sx={{ padding: '0.5rem' }}>
					{eventData.detailData.startTime && (
						<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
							<Typography variant={'caption'} sx={attendanceTimeStyle}>
								출
							</Typography>
							<Typography>{dayjs(eventData.detailData.startTime).format('HH:mm')}</Typography>
						</Box>
					)}

					{eventData.detailData.endTime && (
						<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
							<Typography variant={'caption'} sx={attendanceTimeStyle}>
								퇴
							</Typography>
							<Typography>{dayjs(eventData.detailData.endTime).format('HH:mm')}</Typography>
						</Box>
					)}
				</Box>
			)
		);
	}, [calendarType]);

	return (
		<Box>
			{vacationEvent}
			{outsideEvent}
			{businesstripEvent}
			{attendanceEvent}
		</Box>
	);
};

export default function CalendarItemComp({
	calendarRow,
	calendarType,
}: {
	calendarRow: Record<dayName, CalendarDayDto>[];
	calendarType: 'attendance' | 'schedule';
}) {
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
		<Box>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					height: '2.5rem',
				}}
			>
				{calendarCol.map((subItem: CalendarColData, subIdx: number) => {
					return (
						<Box
							key={`${subIdx}`}
							sx={{
								overflow: 'hidden',
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',
								width: `calc(100% /${calendarCol.length - 1})`,
								minWidth: '8rem',
								padding: '0.375rem 0.625rem',
							}}
						>
							<Typography
								sx={{
									textWrap: 'nowrap',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
									color: getDayColor(true, false, subItem.key),
									fontWeight: 'bold',
								}}
							>
								{subItem.header}
							</Typography>
						</Box>
					);
				})}
			</Box>
			<Box sx={{ flexDirection: 'column', border: `1px solid`, borderColor: 'grey.300', borderRadius: '1rem' }}>
				{calendarRow &&
					calendarRow.map((item: Record<dayName, CalendarDayDto>, idx: number) => {
						return (
							<Box
								key={idx}
								sx={{
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
													flexDirection: 'column',
													width: `calc(100% /${calendarCol.length - 1})`,
													minWidth: '8rem',
													minHeight: '10rem',
													...(subIdx !== 0 && {
														marginLeft: '-1px',
														borderLeft: `1px solid`,
														borderColor: 'grey.300',
													}),
													...(activeCell === idx + '_' + subIdx && {
														outline: `2px solid`,
														outlineColor: 'primary.main',
														zIndex: 10,
													}),
													cursor: 'pointer',
												}}
												onClick={(e) => onClickCell(e, `${idx}_${subIdx}`)}
											>
												<Box
													sx={{
														display: 'flex',
														justifyContent: 'space-between',
														width: '100%',
														height: '2rem',
														padding: '0.375rem 0.625rem',
														borderBottom: `1px solid`,
														borderColor: 'grey.300',
														gap: 2,
													}}
												>
													<Typography
														sx={{
															fontWeight: 'bold',
															color: getDayColor(item[subItem.key].isCurrentMonth, item[subItem.key].isHoliday, subItem.key),
														}}
													>
														{dayjs(item[subItem.key].date).format('DD')}
													</Typography>
													{item[subItem.key].isHoliday && (
														<Typography
															variant='body2'
															sx={{
																overflow: 'hidden',
																textWrap: 'nowrap',
																textOverflow: 'ellipsis',
																whiteSpace: 'nowrap',
																color: 'error.500',
															}}
														>
															{item[subItem.key]?.holidaySubject ?? ''}
														</Typography>
													)}
												</Box>
												<Box
													sx={{
														display: 'flex',
														flexDirection: 'column',
														flexGrow: 1,
														width: '100%',
													}}
												>
													<Box
														sx={{
															display: 'flex',
															flexDirection: 'column',
															flexGrow: 1,
														}}
													>
														{calendarType === 'attendance' &&
															item[subItem.key].events.slice(0, 3).map((eventItem: CalendarEventDto, eventIdx: number) => {
																return <DayEventList key={eventIdx} eventData={eventItem} calendarType={calendarType} />;
															})}
													</Box>
													{item[subItem.key].events.length > 3 && (
														<Box
															sx={{
																display: 'flex',
																flexDirection: 'row',
																justifyContent: 'end',
																alignItems: 'start',
																width: '100%',
																padding: '0.25rem 0.5rem',
															}}
														>
															<Button className='text-only'> + {item[subItem.key].events.length - 3}</Button>
														</Box>
													)}
												</Box>
											</Box>
										);
									})}
								</Box>
							</Box>
						);
					})}
			</Box>
		</Box>
	);
}
