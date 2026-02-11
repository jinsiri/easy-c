'use client';

import { useEffect, useState } from 'react';

/** Lib */
import dayjs from 'dayjs';

/** MUI */
import { Box, Grid, IconButton, Typography } from '@mui/material';
import { ArrowLeftRounded, ArrowRightRounded } from '@mui/icons-material';

/** Ag Grid */
import { ColDef } from 'ag-grid-community';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import ButtonFieldDatePicker from '@/app/_component/ButtonFieldDatePicker';
import { getTimelineInnerData } from '@/utils/commonFunc';
import axiosConfig from '@/app/_lib/axiosConfig';

export default function AttendanceCompanyPage() {
	const [calendarDate, setCalendarDate] = useState<dayjs.Dayjs>(dayjs());
	const [rowData, setRowData] = useState<Record<string, any>[]>();

	const colDefs: ColDef<Record<string, any>>[] = [
		{ field: 'workDate', headerName: '근무일' },
		{ field: 'dept', headerName: '부서/직급' },
		{ field: 'name', headerName: '근무자' },
		{ field: 'workStatus', headerName: '근로 상태' },
		{
			field: 'time',
			headerName: '근로 시간',
			cellRenderer: (param) => {
				return (
					<Box>
						<Typography>출근시간: {param.data.startTime}</Typography>
						<Typography>퇴근시간: {param.data.endTime}</Typography>
					</Box>
				);
			},
		},
	];

	useEffect(() => {
		getAttendanceCompanyOnedayData();
	}, []);

	const getAttendanceCompanyOnedayData = () => {
		axiosConfig.post('/api/attendance/company/oneday', { workDate: calendarDate.format('YYYY-MM-DD') }).then((res) => {
			console.log(res);
			setRowData(res);
		});
	};

	const onChangeDatePicker = (value) => {
		if (value != null) {
			setCalendarDate(value);
		}
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
			<Box sx={{ padding: '0 1.5rem' }}>
				<PathBreadcrumbs />
			</Box>
			<Grid container sx={{ flexDirection: 'column', flexGrow: 1 }}>
				<Grid size={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem', paddingBottom: '1rem' }}>
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
						onClick={(e) => setCalendarDate((prev) => prev.subtract(1, 'day'))}
					>
						<ArrowLeftRounded sx={{ fontSize: '1.5rem', strokeWidth: 5 }} />
					</IconButton>

					<Box sx={{ display: 'flex', alignItems: 'center', margin: '0 2rem' }}>
						<Typography variant='h5' sx={{ marginRight: 0.5 }}>
							{calendarDate.format('YYYY-MM-DD')}
						</Typography>
						<ButtonFieldDatePicker value={calendarDate} onChange={onChangeDatePicker} />
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
						onClick={(e) => setCalendarDate((prev) => prev.add(1, 'day'))}
					>
						<ArrowRightRounded sx={{ fontSize: '1.5rem' }} />
					</IconButton>
				</Grid>
				<Grid sx={{ display: 'flex', flexDirection: 'row', padding: '0 1.5rem' }}>
					<Box sx={{ flex: 1 }}>ssaqew</Box>
					<Box sx={{ flex: 1 }}>ssaqew</Box>
					<Box sx={{ flex: 1 }}>ssaqew</Box>
					<Box sx={{ flex: 1 }}>ssaqew</Box>
				</Grid>
				<Grid sx={{ flexDirection: 'column', flexGrow: 1 }}>
					<CustomAgGridComp rowData={rowData} colDefs={colDefs} rowSelectionMode='single' />
				</Grid>
			</Grid>
		</Box>
	);
}
