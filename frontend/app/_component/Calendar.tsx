'use client';

import React, { useState } from 'react';

/** MUI */
import { Box, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';

/** lib */
import CustomReactCalendarTimeline from '../_lib/CustomReactCalendarTimeline';

type dayName = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

interface CalendarColData {
	key: dayName;
	header: string;
}

interface CalendarData {
	day: number;
	startTime?: string;
	endTime?: string;
	fulltime?: string;
	overtime?: string;
	vacation?: string;
	detail?: string;
	confirm?: string;
}

interface ColData {
	key: keyof CalendarData;
	header: string;
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

const calendarRow: Record<dayName, CalendarData>[] = [
	{
		mon: {
			day: 1,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
			confirm: '',
		},
		tue: {
			day: 2,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
			confirm: '',
		},
		wed: {
			day: 3,
			startTime: '08:00',
			endTime: '20:00',
			fulltime: '12h 00m',
			overtime: '04h 00m',
			vacation: '',
			confirm: '',
		},
		thu: {
			day: 4,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
			confirm: '',
		},
		fri: {
			day: 5,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
			confirm: '',
		},
		sat: {
			day: 6,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
			confirm: '',
		},
		sun: {
			day: 7,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
			confirm: '',
		},
	},
	{
		mon: {
			day: 1,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		tue: {
			day: 2,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		wed: {
			day: 3,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		thu: {
			day: 4,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		fri: {
			day: 5,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		sat: {
			day: 6,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		sun: {
			day: 7,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
	},
	{
		mon: {
			day: 1,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		tue: {
			day: 2,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		wed: {
			day: 3,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		thu: {
			day: 4,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		fri: {
			day: 5,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		sat: {
			day: 6,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		sun: {
			day: 7,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
	},
	{
		mon: {
			day: 1,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		tue: {
			day: 2,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		wed: {
			day: 3,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		thu: {
			day: 4,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		fri: {
			day: 5,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		sat: {
			day: 6,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		sun: {
			day: 7,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
	},
	{
		mon: {
			day: 1,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		tue: {
			day: 2,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		wed: {
			day: 3,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		thu: {
			day: 4,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		fri: {
			day: 5,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		sat: {
			day: 6,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
		sun: {
			day: 7,
			startTime: '',
			endTime: '',
			fulltime: '',
			overtime: '',
			vacation: '',
		},
	},
];

const detailCol: ColData[] = [
	{
		header: '근무시작',
		key: 'startTime',
	},
	{
		header: '근무종료',
		key: 'endTime',
	},
	{
		header: '총 근로시간',
		key: 'fulltime',
	},
	{
		header: '근무시간 상세',
		key: 'detail',
	},
	{
		header: '승인요청내용',
		key: 'confirm',
	},
];

export default function Calendar() {
	const theme = useTheme();
	const [activeCell, setActiveCell] = useState<string | null>(null);

	const onClickCell = (event: React.MouseEvent<HTMLElement>, target: string) => {
		event.preventDefault();

		if (target === activeCell) {
			setActiveCell(null);
		} else {
			setActiveCell(target);
		}
	};

	return (
		<Grid container sx={{ flexDirection: 'column', border: `1px solid ${theme.palette.grey[300]}`, borderRadius: '1rem' }}>
			{calendarRow.map((item: Record<string, any>, idx: number) => {
				return (
					<Grid
						key={idx}
						sx={{
							width: '100%',
							...(idx !== 0 && {
								marginTop: '-1px',
								borderTop: `1px solid ${theme.palette.grey[300]}`,
							}),
						}}
					>
						<Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
							{calendarCol.map((subItem: Record<string, any>, subIdx: number) => {
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
												borderLeft: `1px solid ${theme.palette.grey[300]}`,
											}),
											...(activeCell === idx + '_' + subIdx && {
												outline: `2px solid ${theme.palette.primary.main}`,
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
													borderBottom: `1px solid ${theme.palette.grey[300]}`,
												}}
											>
												<Typography sx={{ marginRight: '0.5rem', fontWeight: 'bold' }}>{item[subItem.key].day}</Typography>
												<Typography sx={{ display: { xs: 'none', md: 'block' } }}>{subItem.header}</Typography>
											</Box>
											<Box sx={{ height: '5rem', padding: '0.5rem' }}>
												{item[subItem.key].startTime && (
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
																backgroundColor: theme.palette.primary.main,
																color: theme.palette.grey[50],
															}}
														>
															출
														</Typography>
														<Typography>{item[subItem.key].startTime}</Typography>
													</Box>
												)}
												{item[subItem.key].endTime && (
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
																backgroundColor: theme.palette.primary.main,
																color: theme.palette.grey[50],
															}}
														>
															퇴
														</Typography>
														<Typography>{item[subItem.key].endTime}</Typography>
													</Box>
												)}
												{item[subItem.key].overtime && (
													<Box sx={{ display: 'flex', alignItems: 'center' }}>
														<Box
															sx={{
																width: '2px',
																height: '0.75rem',
																marginRight: '0.25rem',
																backgroundColor: theme.palette.primary.main,
															}}
														></Box>
														<Typography variant='body2'>{item[subItem.key].overtime}</Typography>
													</Box>
												)}

												{item[subItem.key].vacation && (
													<Box sx={{ display: 'flex', alignItems: 'center' }}>
														<Box
															sx={{
																width: '2px',
																height: '0.75rem',
																marginRight: '0.25rem',
																backgroundColor: theme.palette.primary.main,
															}}
														></Box>
														<Typography variant='body2'>{item[subItem.key].vacation}</Typography>
													</Box>
												)}
											</Box>
										</Box>
									</Box>
								);
							})}
						</Box>
						{activeCell && Number(activeCell.split('_')[0]) === idx && (
							<Box sx={{ padding: '0.5rem', borderTop: `1px solid ${theme.palette.grey[300]}` }}>
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
															borderBottom: `1px solid ${theme.palette.grey[300]}`,
															color: theme.palette.grey[500],
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
														{calendarRow[idx][calendarCol[Number(activeCell.split('_')[1])].key][detailItem.key]}
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
