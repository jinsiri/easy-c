'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';

/** MUI */
import { Box, Button, Typography, useTheme } from '@mui/material';

/** lib */
import dayjs from 'dayjs';
import { TimelineItemBase } from 'react-calendar-timeline';
import CustomReactCalendarTimeline from '../../_lib/CustomReactCalendarTimeline';
import useModalStore from '@/store/useModalStore';

/** Custom */
import { formatMinutes, getTimelineInnerData } from '@/utils/commonFunc';

/** type / interface */
import { AttendanceDayResDto } from '@/app/services/attendanceService';
import { VACATIONTYPE, WORKSTATUS, WORKTYPE } from '@/constant/attendanceConst';
import { vacationType, workStatus, dayName, workType } from '@/type/types';
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

export default function CalendarItemDetailComp({ activeCell, idx, item }: { activeCell: string | null; idx: number; item: Record<dayName, CalendarDayDto> }) {
	const theme = useTheme();
	const router = useRouter();
	const { setModalData } = useModalStore();

	const activeSplit = activeCell ? activeCell.split('_') : null;
	const activeRowIdx = activeSplit ? Number(activeSplit[0]) : null;
	const activeColIdx = activeSplit ? Number(activeSplit[1]) : null;
	const useComp = activeRowIdx === idx;

	//memo
	const detailCol = useMemo((): ColData[] => {
		return [
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
				header: '근로 타입',
				key: 'workType',
				formatter: (value, row) => {
					return <Typography>{WORKTYPE[value as workType]}</Typography>;
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
				header: '수정 요청 상세',
				key: 'applicationList',
				formatter: (value, row) => {
					if (value)
						return (
							value &&
							value.length > 0 && (
								<Box
									sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', py: '6px' }}
									onClick={(e) => {
										setModalData(value);
										router.push('/attendance/user/modal?mode=list');
									}}
								>
									<Button variant='text'>상세 보기 ({value.length})</Button>
								</Box>
							)
						);
				},
			},
		];
	}, []);

	const detailData: AttendanceDayResDto | null = useMemo(() => {
		if (activeColIdx) {
			const targetDay: dayName = calendarCol[activeColIdx].key;
			const attendace = item[targetDay].attendance;

			if (attendace) return attendace;
		}

		return null;
	}, [activeColIdx, item]);

	const activeTimelineData = useMemo((): TimelineDataInterface => {
		if (detailData != null) {
			const baseDate = dayjs(detailData.workDate, 'YYYY-MM-DD');
			const visibleTimeStart = baseDate.startOf('day').valueOf();
			const visibleTimeEnd = baseDate.endOf('day').valueOf();

			if (!detailData?.startTime || !detailData?.endTime) {
				return {
					visibleTimeStart,
					visibleTimeEnd,
					data: [],
				};
			}

			const start = dayjs(detailData.startTime);
			const end = dayjs(detailData.endTime);

			return {
				// 해당 날짜의 00:00:00와 23:59:59
				visibleTimeStart: visibleTimeStart,
				visibleTimeEnd: visibleTimeEnd,
				data: [
					{
						id: `item-${activeRowIdx}_${activeRowIdx}`, // ID 중복 방지를 위해 target 활용 권장
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
		} else {
			return { visibleTimeStart: undefined, visibleTimeEnd: undefined, data: [] };
		}
	}, [detailData]);

	return (
		detailData &&
		useComp && (
			<Box sx={{ width: '100%', minHeight: '12rem', padding: '0.5rem', borderTop: `1px solid`, borderColor: 'grey.300' }}>
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
										? detailItem.formatter(detailData[detailItem.key], detailData)
										: getTimelineInnerData(detailData[detailItem.key])}
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
					<Box sx={{ width: '100%' }}>
						<CustomReactCalendarTimeline
							itemList={activeTimelineData.data}
							visibleTimeStart={activeTimelineData.visibleTimeStart}
							visibleTimeEnd={activeTimelineData.visibleTimeEnd}
						/>
					</Box>
				</Box>
			</Box>
		)
	);
}
