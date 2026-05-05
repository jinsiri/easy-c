'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

/** MUI */
import { Box, IconButton, Typography } from '@mui/material';
import { ArrowLeftRounded, ArrowRightRounded } from '@mui/icons-material';

/** lib */
import dayjs, { Dayjs } from 'dayjs';
import { TimelineItemBase } from 'react-calendar-timeline';

/** Custom */
import CalendarContentComp from './CalendarContentComp';
import ButtonFieldDatePicker from '@/app/_component/ButtonFieldDatePicker';

/** type / interface */
import { AttendanceDayResDto } from '@/app/services/attendanceService';
import { CalendarDayDto } from '@/app/services/scheduleService';
import { dayName } from '@/type/types';

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

export default function CalendarComp({
	calendarType,
	calendarRow,
	onChangeDate,
}: {
	calendarType: 'attendance' | 'schedule';
	calendarRow: Record<dayName, CalendarDayDto>[];
	onChangeDate: (calendarDate: Dayjs) => void;
}) {
	const searchParams = useSearchParams();
	const initialDate = searchParams.get('date') ? dayjs(searchParams.get('date')) : dayjs();
	const [calendarDate, setCalendarDate] = useState<dayjs.Dayjs>(initialDate);

	const onChangeDatePicker = (value) => {
		if (value != null) {
			setCalendarDate(value);
		}
	};

	useEffect(() => {
		if (onChangeDate) {
			onChangeDate(calendarDate);
		}
	}, [calendarDate]);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
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
			</Box>
			<Box sx={{ width: '100%' }}>
				<CalendarContentComp calendarRow={calendarRow} calendarType={calendarType} />
			</Box>
		</Box>
	);
}
