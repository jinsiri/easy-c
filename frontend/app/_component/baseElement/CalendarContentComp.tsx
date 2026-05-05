'use client';

import React, { useState } from 'react';

/** MUI */
import { Box, Typography } from '@mui/material';

/** lib */
import { TimelineItemBase } from 'react-calendar-timeline';

/** type / interface */
import { AttendanceDayResDto } from '@/app/services/attendanceService';
import { dayName } from '@/type/types';
import { CalendarDayDto } from '@/app/services/scheduleService';
import CalendarItemComp from './CalendarItemComp';

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

export default function CalendarContentComp({
	calendarRow,
	calendarType,
}: {
	calendarRow: Record<dayName, CalendarDayDto>[];
	calendarType: 'attendance' | 'schedule';
}) {
	const [activeCell, setActiveCell] = useState<string | null>(null);

	const onClickCell = (target: string) => {
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
								<CalendarItemComp
									calendarType={calendarType}
									calendarCol={calendarCol}
									rowItem={item}
									rowIdx={idx}
									activeCell={activeCell}
									cellClickEvent={onClickCell}
								/>
							</Box>
						);
					})}
			</Box>
		</Box>
	);
}
