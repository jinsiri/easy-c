'use client';

import React, { useMemo, useState } from 'react';

/** MUI */
import { Box, Button, Typography } from '@mui/material';

/** lib */
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { TimelineItemBase } from 'react-calendar-timeline';

dayjs.extend(isSameOrBefore);

/** Custom */
import { VACATIONTYPE } from '@/constant/attendanceConst';

/** type / interface */
import { AttendanceDayResDto } from '@/app/services/attendanceService';
import { dayName, vacationType } from '@/type/types';
import { CalendarDayDto, CalendarEventDto } from '@/app/services/scheduleService';
import CalendarItemDetailComp from './CalendarItemDetailComp';

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

export interface CalendarEventExtendDto extends CalendarEventDto {
	line: number;
}

const EventBar = ({ event, dayTitleHeight }: { event: CalendarEventExtendDto; dayTitleHeight: string }) => {
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
		top: `calc(${dayTitleHeight} + ${(barHeight + 0.1) * event.line}rem)`,
		left: `calc(${startIdx} * (100% / 7))`,
		display: 'flex',
		alignItems: 'center',
		width: `calc(${endIdx - startIdx + 1} * (100% / 7))`,
		minWidth: `calc(${endIdx - startIdx + 1} * 8rem)`,
		height: `${barHeight}rem`,
		px: 0.5,
		borderRadius: '4px',
	};

	return (
		<Box
			sx={{
				...dayBarStyle,
				backgroundColor: 'primary.100',
				color: 'primary.500',
			}}
		>
			{event.eventType === 'VACATION' ? VACATIONTYPE[event.vacationData.vacationType as vacationType] : event.scheduleName}
		</Box>
	);
};

const AttendanceBar = ({
	attendance,
	dayTitleHeight,
	dayLineCountMap,
}: {
	attendance: AttendanceDayResDto;
	dayTitleHeight: string;
	dayLineCountMap: Record<string, Set<number>>;
}) => {
	const barHeight: number = 1.5; //rem기준
	const start = dayjs(attendance.workDate, 'YYYY-MM-DD');

	const getIdx = (d: dayjs.Dayjs) => {
		const day = d.day();
		return day === 0 ? 6 : day - 1; // 월요일 시작 기준
	};

	const lineMap = dayLineCountMap[attendance.workDate as string];
	const line = lineMap ? (lineMap.size > 2 ? 2 : lineMap.size) : 0;

	const dayBarStyle = {
		position: 'absolute',
		top: `calc(${dayTitleHeight} + ${(barHeight + 0.1) * line}rem)`,
		left: `calc(${getIdx(start)} * (100% / 7))`,

		display: 'flex',
		alignItems: 'center',
		width: `calc( 100% / 7)`,
		minWidth: ` 8rem`,
		height: `${barHeight}rem`,
		px: 0.5,
		borderRadius: '4px',
	};
	const attendanceTimeStyle = {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '1.125rem',
		height: '1.125rem',
		marginRight: '0.25rem',
		borderRadius: '100%',
		fontSize: '0.625rem',
		backgroundColor: 'primary.500',
		color: 'background.default',
	};

	return (
		<Box
			sx={{
				...dayBarStyle,
				flexDirection: 'column',
				justifyContent: 'start',
				alignItems: 'start',
				padding: '0.5rem',
			}}
		>
			{attendance.startTime && (
				<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
					<Typography variant={'caption'} sx={attendanceTimeStyle}>
						출
					</Typography>
					<Typography>{dayjs(attendance.startTime).format('HH:mm')}</Typography>
				</Box>
			)}
			{attendance.endTime && (
				<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
					<Typography variant={'caption'} sx={attendanceTimeStyle}>
						퇴
					</Typography>
					<Typography>{dayjs(attendance.endTime).format('HH:mm')}</Typography>
				</Box>
			)}
		</Box>
	);
};

export default function CalendarItemComp({
	calendarType,
	calendarCol,
	rowItem,
	rowIdx,
	activeCell,
	cellClickEvent,
}: {
	calendarType: 'attendance' | 'schedule';
	calendarCol: CalendarColData[];
	rowItem: Record<dayName, CalendarDayDto>;
	rowIdx: number;
	activeCell: string | null;
	cellClickEvent: (data: string) => void;
}) {
	const dayTitleHeight = '2rem';
	const maxLine = calendarType === 'attendance' ? 2 : 3;

	const onClickCell = (event: React.MouseEvent<HTMLElement>, target: string) => {
		event.preventDefault();
		if (cellClickEvent) cellClickEvent(target);
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

	const { barEvents, dayLineCountMap, dayOverflowMap } = useMemo<{
		barEvents: CalendarEventExtendDto[];
		dayLineCountMap: Record<string, Set<number>>;
		dayOverflowMap: Record<string, number>;
	}>(() => {
		const groupEventMap = new Map<string, CalendarEventExtendDto>();
		const noneGroupEvents: CalendarEventExtendDto[] = [];

		// 1.그룹이 있는지 아닌지 구분 후 그룹 중복 제거
		Object.values(rowItem).forEach((day) => {
			(day.events ?? []).forEach((eventItem) => {
				if (eventItem.groupId) {
					if (!groupEventMap.has(eventItem.groupId)) {
						groupEventMap.set(eventItem.groupId, { ...eventItem, line: 0 });
					}
				} else {
					noneGroupEvents.push({ ...eventItem, line: 0 });
				}
			});
		});

		const allEvent = [...groupEventMap.values(), ...noneGroupEvents];
		let attendanceEvent;

		// 2. 시작일 기준 정렬
		allEvent.sort((a, b) => dayjs(a.startDate).diff(dayjs(b.startDate)));

		// 3. 라인 배치 (겹칠 때만 내려감)
		const lines: CalendarEventExtendDto[][] = [];

		allEvent.forEach((event) => {
			let placed = false;

			// 전체 라인을 돌면서 겹치는 것이 있는지 여부 판별
			const eventStart = dayjs(event.startDate);
			const eventEnd = event.endDate ? dayjs(event.endDate) : eventStart;

			for (let i = 0; i < lines.length; i++) {
				const isOverlap = lines[i].some((existing) => {
					const existingStart = dayjs(existing.startDate);
					const existingEnd = existing.endDate ? dayjs(existing.endDate) : existingStart;

					// 1.현재 이벤트 끝 점이 기존 이벤트(어떤 곳이든)보다 이전
					// 2. 현재 이벤트 시작점이 기존 이벤트(어떤 곳이든)보다 이후
					// 두 조건이 아닌경우
					return !(eventEnd.isBefore(existingStart) || eventStart.isAfter(existingEnd));
				});

				if (!isOverlap) {
					event.line = i;
					lines[i].push(event);
					placed = true;
					break;
				}
			}

			if (!placed) {
				event.line = lines.length;
				lines.push([event]);
			}
		});

		// 4. 날짜별 라인 개수 계산 (= +N용)
		const dayLineCountMap: Record<string, Set<number>> = {};

		allEvent.forEach((event) => {
			const start = dayjs(event.startDate);
			const end = event.endDate ? dayjs(event.endDate) : start;

			for (let d = start; d.isSameOrBefore(end); d = d.add(1, 'day')) {
				const key = d.format('YYYY-MM-DD');

				if (!dayLineCountMap[key]) {
					dayLineCountMap[key] = new Set();
				}

				dayLineCountMap[key].add(event.line);
			}
		});

		// 5. +N 계산
		const dayOverflowMap: Record<string, number> = {};

		//attendance의 경우 스케줄은 2개까지 + 근태
		//schedule의 경우 최대 스케줄 3개까지
		Object.entries(dayLineCountMap).forEach(([dateKey, lineSet]) => {
			const count = lineSet.size;

			if (count > maxLine) {
				dayOverflowMap[dateKey] = count - maxLine;
			}
		});

		return {
			barEvents: allEvent,
			attendanceEvent,
			dayLineCountMap,
			dayOverflowMap,
		};
	}, [rowItem, calendarType]);

	return (
		<>
			<Box sx={{ position: 'relative', width: '100%' }}>
				<Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
					{calendarCol.map((colItem: CalendarColData, colIdx: number) => {
						const dateKey = dayjs(rowItem[colItem.key].date).format('YYYY-MM-DD');

						return (
							<Box
								key={`${rowIdx}_${colIdx}`}
								sx={{
									overflow: 'hidden',
									display: 'flex',
									flexDirection: 'column',
									width: `calc(100% /${calendarCol.length - 1})`,
									minWidth: '8rem',
									minHeight: '10rem',
									...(colIdx !== 0 && {
										marginLeft: '-1px',
										borderLeft: `1px solid`,
										borderColor: 'grey.300',
									}),
									...(activeCell === rowIdx + '_' + colIdx && {
										outline: `2px solid`,
										outlineColor: 'primary.main',
										zIndex: 10,
									}),
									cursor: calendarType === 'attendance' ? 'pointer' : 'default',
								}}
								onClick={(e) => calendarType === 'attendance' && onClickCell(e, `${rowIdx}_${colIdx}`)}
							>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										width: '100%',
										height: dayTitleHeight,
										padding: '0.375rem 0.625rem',
										borderBottom: `1px solid`,
										borderColor: 'grey.300',
										gap: 2,
									}}
								>
									<Typography
										sx={{
											fontWeight: 'bold',
											color: getDayColor(rowItem[colItem.key].isCurrentMonth, rowItem[colItem.key].isHoliday, colItem.key),
										}}
									>
										{dayjs(rowItem[colItem.key].date).format('DD')}
									</Typography>
									{rowItem[colItem.key].isHoliday && (
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
											{rowItem[colItem.key]?.holidaySubject ?? ''}
										</Typography>
									)}
								</Box>
								<Box
									sx={{
										position: 'relative',
										display: 'flex',
										flexDirection: 'column',
										flexGrow: 1,
										width: '100%',
									}}
								>
									{dayOverflowMap[dateKey] && (
										<Box
											sx={{
												position: 'absolute',
												bottom: 0,
												display: 'flex',
												flexDirection: 'row',
												justifyContent: 'end',
												alignItems: 'center',
												width: '100%',
											}}
										>
											<Button>+{dayOverflowMap[dateKey]}</Button>
										</Box>
									)}
								</Box>
							</Box>
						);
					})}
				</Box>
				{barEvents &&
					barEvents
						.slice(0, maxLine)
						.map((barEventItem: CalendarEventExtendDto, barEventIdx: number) => (
							<EventBar key={`event_${rowIdx}_${barEventIdx}`} event={barEventItem} dayTitleHeight={dayTitleHeight} />
						))}

				{calendarCol.map((colItem: CalendarColData, colIdx: number) => {
					const targets: AttendanceDayResDto[] = rowItem[colItem.key].attendances;
					return (
						targets.length > 0 && (
							<AttendanceBar
								key={`attendance_${rowIdx}_${colIdx}`}
								attendance={targets[0]}
								dayTitleHeight={dayTitleHeight}
								dayLineCountMap={dayLineCountMap}
							/>
						)
					);
				})}

				<CalendarItemDetailComp activeCell={activeCell} idx={rowIdx} item={rowItem} />
			</Box>
		</>
	);
}
