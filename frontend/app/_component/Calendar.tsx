'use client';

import React, { useState } from 'react';

/** MUI */
import { Box, Grid, Typography, useTheme } from '@mui/material';

interface CalendarData {
	day: number;
	attendance: string;
	leave: string;
	overtime: string;
	vacation: string;
}

const calendarRow: Record<string, CalendarData>[] = [
	{
		mon: {
			day: 1,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		tue: {
			day: 2,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		wed: {
			day: 3,
			attendance: '08:00',
			leave: '20:00',
			overtime: '8h 00m 초과',
			vacation: '',
		},
		thu: {
			day: 4,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '2h 00m 휴가',
		},
		fri: {
			day: 5,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		sat: {
			day: 6,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		sun: {
			day: 7,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
	},
	{
		mon: {
			day: 1,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		tue: {
			day: 2,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		wed: {
			day: 3,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		thu: {
			day: 4,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		fri: {
			day: 5,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		sat: {
			day: 6,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		sun: {
			day: 7,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
	},
	{
		mon: {
			day: 1,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		tue: {
			day: 2,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		wed: {
			day: 3,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		thu: {
			day: 4,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		fri: {
			day: 5,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		sat: {
			day: 6,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		sun: {
			day: 7,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
	},
	{
		mon: {
			day: 1,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		tue: {
			day: 2,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		wed: {
			day: 3,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		thu: {
			day: 4,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		fri: {
			day: 5,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		sat: {
			day: 6,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		sun: {
			day: 7,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
	},
	{
		mon: {
			day: 1,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		tue: {
			day: 2,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		wed: {
			day: 3,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		thu: {
			day: 4,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		fri: {
			day: 5,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		sat: {
			day: 6,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
		sun: {
			day: 7,
			attendance: '',
			leave: '',
			overtime: '',
			vacation: '',
		},
	},
];
const calendarCol = [
	{ key: 'mon', header: '월요일' },
	{ key: 'tue', header: '화요일' },
	{ key: 'wed', header: '수요일' },
	{ key: 'thu', header: '목요일' },
	{ key: 'fri', header: '금요일' },
	{ key: 'sat', header: '토요일' },
	{ key: 'sun', header: '일요일' },
];

export default function Calendar() {
	const theme = useTheme();
	const [activeCell, setActiveCell] = useState<string | null>(null);

	const onClickCell = (event: React.MouseEvent<HTMLAnchorElement>, target: string) => {
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
										component={'a'}
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
												border: `2px solid ${theme.palette.primary.main}`,
												borderLeftColor: 'primary.main',
												zIndex: 1,
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
												<Typography>{subItem.header}</Typography>
											</Box>
											<Box sx={{ height: '5rem', padding: '0.5rem' }}>
												{item[subItem.key].attendance && (
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
														<Typography>{item[subItem.key].attendance}</Typography>
													</Box>
												)}
												{item[subItem.key].leave && (
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
														<Typography>{item[subItem.key].leave}</Typography>
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
								<Box sx={{ height: '10rem', padding: '0.5rem', border: `1px solid ${theme.palette.grey[300]}`, borderRadius: '1rem' }}></Box>
							</Box>
						)}
					</Grid>
				);
			})}
		</Grid>
	);
}
