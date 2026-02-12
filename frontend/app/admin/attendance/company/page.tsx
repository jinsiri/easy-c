'use client';

import { useEffect, useState } from 'react';

/** Lib */
import dayjs from 'dayjs';

/** MUI */
import { Box, Grid, IconButton, Typography, TextField, Select, MenuItem } from '@mui/material';
import { ArrowLeftRounded, ArrowRightRounded } from '@mui/icons-material';

/** Ag Grid */
import { ColDef } from 'ag-grid-community';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';

/** Custom */
import { WORKSTATUS } from '@/constant/attendanceConst';
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import ButtonFieldDatePicker from '@/app/_component/ButtonFieldDatePicker';
import axiosConfig from '@/app/_lib/axiosConfig';

export default function AttendanceCompanyPage() {
	const [calendarDate, setCalendarDate] = useState<dayjs.Dayjs>(dayjs());
	const [rowData, setRowData] = useState<Record<string, any>[]>([]);
	const [searchCategory, setSearchCategory] = useState<string>('memberNm');

	const colDefs: ColDef<Record<string, any>>[] = [
		{ field: 'workDate', headerName: '근무일' },
		{
			field: 'dept',
			headerName: '부서/직급',
			valueFormatter: (param) => {
				return param.data ? (param.data.deptNm ? param.data.deptNm + '/' : '') + (param.data.jobGrade ? param.data.jobGrade : '') : '';
			},
		},
		{
			field: 'name',
			headerName: '근무자',
			valueFormatter: (param) => {
				return param.data ? param.data.registerUser.memberNm : '';
			},
		},
		{
			field: 'workStatus',
			headerName: '근로 상태',
			valueFormatter: (param) => {
				return param.value ? WORKSTATUS[param.value] : '';
			},
		},
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
			setRowData(res);
		});
	};

	const onChangeDatePicker = (value) => {
		if (value != null) {
			setCalendarDate(value);
		}
	};

	const handleChangeSearchCategory = () => {};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
			<Box sx={{ padding: '0 1.5rem' }}>
				<PathBreadcrumbs />
			</Box>
			<Grid container sx={{ flexDirection: 'column', flexGrow: 1 }}>
				<Grid size={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
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
				<Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', padding: '0.5rem 1.5rem' }}>
					<Select id='demo-simple-select' value={searchCategory} onChange={handleChangeSearchCategory} size='small' sx={{ marginRight: '0.5rem' }}>
						<MenuItem value={'depthNm'}>부서명</MenuItem>
						<MenuItem value={'memberNm'}>근무자</MenuItem>
					</Select>
					<TextField id='outlined-basic' variant='outlined' size='small' />
				</Grid>
				<Grid sx={{ flexDirection: 'column', flexGrow: 1 }}>
					<CustomAgGridComp rowData={rowData} colDefs={colDefs} rowSelectionMode='single' rowHeight={60} />
				</Grid>
			</Grid>
		</Box>
	);
}
