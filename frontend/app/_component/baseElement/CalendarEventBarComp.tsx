'use client';

import React, { ReactNode, useMemo, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';

/** MUI */
import { Box, Button, Typography } from '@mui/material';

/** lib */
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { TimelineItemBase } from 'react-calendar-timeline';
import useModalStore from '@/store/useModalStore';

dayjs.extend(isSameOrBefore);

/** Custom */
import { VACATIONTYPE } from '@/constant/attendanceConst';
import CalendarItemDetailComp from './CalendarItemDetailComp';

/** type / interface */
import { AttendanceDayResDto } from '@/app/services/attendanceService';
import { dayName, vacationType } from '@/type/types';
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

export const CalendarEventBarComp = ({
	barType,
	event,
	dayTitleHeight,
}: {
	barType: 'calendar' | 'list';
	event: CalendarEventDto;
	dayTitleHeight?: string;
}) => {
	const router = useRouter();
	const barHeight: number = 1.5; //rem기준
	const start = dayjs(event.startDate, 'YYYY-MM-DD');
	const end = event.endDate ? dayjs(event.endDate, 'YYYY-MM-DD') : dayjs(event.startDate, 'YYYY-MM-DD');

	const getIdx = (d: dayjs.Dayjs) => {
		const day = d.day();
		return day === 0 ? 6 : day - 1; // 월요일 시작 기준
	};

	const startIdx = getIdx(start);
	const endIdx = getIdx(end);

	const dayBarStyle = {
		position: 'absolute',
		top: `calc(${dayTitleHeight ?? 0} + ${(barHeight + 0.1) * event.line}rem)`,
		left: `calc(${startIdx} * (100% / 7))`,
		width: `calc(${endIdx - startIdx + 1} * (100% / 7))`,
		minWidth: `calc(${endIdx - startIdx + 1} * 8rem)`,
		height: `${barHeight}rem`,
	};

	const listBarStyle = {
		width: `100%`,
		height: `${barHeight}rem`,
	};

	const onClickBar = (e: MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();

		router.replace(`/schedule/user/data?id=${event.scheduleData.scheduleId}`);
		router.refresh();
	};

	const barTitle: ReactNode = useMemo(() => {
		if (event.eventType === 'VACATION') return <Typography>{VACATIONTYPE[event.vacationData.vacationType as vacationType]}</Typography>;

		const _startTime = event.scheduleData.startTime;
		const _endTime = event.scheduleData.endTime;

		return (
			<Box sx={{ overflow: 'hidden', display: 'flex', flexDirection: 'row' }}>
				{_startTime && (
					<Typography>
						{dayjs(_startTime, 'HH:mm:ss').format('HH:mm')}
						{_endTime && ' ~ ' + dayjs(_endTime, 'HH:mm:ss').format('HH:mm')}
						&nbsp;&nbsp;&nbsp;&nbsp;
					</Typography>
				)}
				<Typography className='text-ellipsis'>{event.scheduleData.scheduleName}</Typography>
			</Box>
		);
	}, [event]);

	return (
		<Box
			component={'a'}
			sx={{
				...(barType === 'calendar' ? dayBarStyle : listBarStyle),
				display: 'flex',
				alignItems: 'center',
				backgroundColor: event.groupId != null ? 'primary.100' : 'transparent',
				color: 'primary.500',
				px: 0.5,
				borderRadius: '4px',
				cursor: 'pointer',

				'&:hover': {
					textDecoration: 'underline',
				},
			}}
			onClick={onClickBar}
		>
			{barTitle}
		</Box>
	);
};
