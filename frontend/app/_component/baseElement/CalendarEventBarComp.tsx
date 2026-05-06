'use client';

import React, { ReactNode, useMemo, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import secureLocalStorage from 'react-secure-storage';

/** MUI */
import { Box, Typography } from '@mui/material';

/** lib */
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { TimelineItemBase } from 'react-calendar-timeline';
import useModalStore from '@/store/useModalStore';

dayjs.extend(isSameOrBefore);

/** Custom */
import { VACATIONTYPE } from '@/constant/attendanceConst';

/** type / interface */
import { AttendanceDayResDto } from '@/app/services/attendanceService';
import { dayName, vacationType } from '@/type/types';
import { CalendarEventDto } from '@/app/services/scheduleService';

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
	calendarType,
	event,
	dayTitleHeight,
}: {
	barType: 'calendar' | 'list';
	calendarType: 'PERSONAL' | 'DEPT';
	event: CalendarEventDto;
	dayTitleHeight?: string;
}) => {
	const router = useRouter();
	const targetMemberId = secureLocalStorage.getItem('memberId') as number;
	const setModalData = useModalStore((state) => state.setModalData);

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
		left: `calc(${startIdx} * (100% / 7) + 1px)`,
		width: `calc(${endIdx - startIdx + 1} * (100% / 7) - 2px)`,
		minWidth: `calc(${endIdx - startIdx + 1} * 8rem)`,
		height: `${barHeight}rem`,
	};

	const listBarStyle = {
		width: `100%`,
		height: `${barHeight}rem`,
	};

	const onClickBar = (e: MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();

		if (calendarType !== 'DEPT') {
			if (event.eventType === 'VACATION') {
				setModalData(event.vacationData);
				router.push('/vacation/user/modal?type=read');
			} else {
				setModalData(event.scheduleData);
				router.push(`/schedule/user/modal`);
			}
		}
	};

	const barTitle: ReactNode = useMemo(() => {
		if (event.eventType === 'VACATION')
			return (
				<Typography>
					{targetMemberId !== event.memberId && `[${event.memberNm}]  `} {VACATIONTYPE[event.vacationData.vacationType as vacationType]}
				</Typography>
			);

		const _startDate = event.scheduleData.startDate;
		const _endDate = event.scheduleData.endDate ?? _startDate;
		const _startTime = event.scheduleData.startTime;
		const _endTime = event.scheduleData.endTime;

		return (
			<Box sx={{ overflow: 'hidden', display: 'flex', flexDirection: 'row' }}>
				{_startDate === _endDate && _startTime && (
					<Typography>
						{dayjs(_startTime, 'HH:mm:ss').format('HH:mm')}
						{_endTime && ' ~ ' + dayjs(_endTime, 'HH:mm:ss').format('HH:mm')}
						&nbsp;&nbsp;&nbsp;&nbsp;
					</Typography>
				)}

				<Typography className='text-ellipsis'>
					{targetMemberId !== event.memberId && `[${event.memberNm}]  `} {event.scheduleData.scheduleName}
				</Typography>
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
				cursor: calendarType === 'DEPT' ? 'default' : 'pointer',

				'&:hover': {
					textDecoration: calendarType === 'DEPT' ? 'none' : 'underline',
				},
			}}
			onClick={onClickBar}
		>
			{barTitle}
		</Box>
	);
};
