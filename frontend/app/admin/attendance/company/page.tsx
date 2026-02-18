'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

/** Lib */
import dayjs from 'dayjs';

/** MUI */
import { Box, Button, Grid, IconButton, Typography, TextField, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { ArrowLeftRounded, ArrowRightRounded } from '@mui/icons-material';

/** Ag Grid */
import { ColDef } from 'ag-grid-community';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';

/** Custom */
import { WORKSTATUS } from '@/constant/attendanceConst';
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import ButtonFieldDatePicker from '@/app/_component/ButtonFieldDatePicker';

/** Type / Interface */
import { workStatus } from '@/type/types';
import { AttendanceCompanyRequestDto, AttendanceCompanyResponseDto, attendancePolicyService } from '@/app/services/attendanceCompanyService';

const unNomalList = [
	{ key: 'allCount', label: '전체' },
	{ key: 'lateCount', label: WORKSTATUS['LATE'] },
	{ key: 'earlyLeaveCount', label: WORKSTATUS['EARLY_LEAVE'] },
	{ key: 'absentCount', label: WORKSTATUS['ABSENT'] },
	{ key: 'changeRequestCount', label: '정정신청' },
];

export default function AttendanceCompanyPage() {
	const [calendarDate, setCalendarDate] = useState<dayjs.Dayjs>(dayjs());
	const [countData, setCountData] = useState<Record<string, number>>({
		allCount: 0,
		lateCount: 0,
		earlyLeaveCount: 0,
		absentCount: 0,
		changeRequestCount: 0,
	});
	const [rowData, setRowData] = useState<Record<string, any>[]>([]);
	const [searchCategory, setSearchCategory] = useState<string>('memberNm');
	const [searchText, setSearchText] = useState<string>('');
	const [workStatus, setWorkStatus] = useState<workStatus>('PRESENT');

	const colDefs: ColDef<Record<string, any>>[] = [
		{ field: 'workDate', headerName: '근무일' },
		{
			field: 'dept',
			headerName: '부서/직급',
			valueFormatter: (param) => {
				const depthNm = param.data?.depthNm;
				const jobGrade = param.data?.jobGrade;

				return depthNm && jobGrade ? depthNm + ' / ' + jobGrade : '-';
			},
		},
		{
			field: 'name',
			headerName: '근무자',
			valueFormatter: (param) => (param.data ? param.data.registerUser.memberNm : '-'),
		},
		{
			field: 'workStatus',
			headerName: '근로 상태',
			valueFormatter: (param) => (param.data ? WORKSTATUS[param.data.workStatus as workStatus] : '-'),
		},
		{
			field: 'time',
			headerName: '근로 시간',
			cellRenderer: (param) => (
				<Box>
					<Typography>출근시간: {param.data.startTime ? dayjs(param.data.startTime).format('HH:mm') : '-'}</Typography>
					<Typography>퇴근시간: {param.data.endTime ? dayjs(param.data.endTime).format('HH:mm') : '-'}</Typography>
				</Box>
			),
		},
	];

	useEffect(() => {
		getAttendanceCompanyOnedayData();
	}, []);

	const getAttendanceCompanyOnedayData = async () => {
		try {
			const req: AttendanceCompanyRequestDto = {
				workDate: calendarDate.format('YYYY-MM-DD'),
			};

			const res: AttendanceCompanyResponseDto = await attendancePolicyService.getAttendanceCompanyOnedayData(req);

			setCountData({
				allCount: res.allCount,
				lateCount: res.lateCount,
				earlyLeaveCount: res.earlyLeaveCount,
				absentCount: res.absentCount,
				changeRequestCount: res.changeRequestCount,
			});

			setRowData(res.dayData);
		} catch (error: any) {
		} finally {
		}
	};

	const onChangeDatePicker = useCallback(
		(value) => {
			if (value != null) {
				setCalendarDate(value);
			}
		},
		[calendarDate],
	);

	const handleChangeSearchCategory = (event: SelectChangeEvent) => {
		setSearchCategory(event.target.value);
	};

	const onChangeWorkStatus = (event: SelectChangeEvent) => {
		setWorkStatus(event.target.value as workStatus);
	};

	const changeSearchCategoryContents = useMemo(() => {
		switch (searchCategory) {
			case 'workStatus':
				return (
					<Select name={'workStatus'} value={workStatus} onChange={onChangeWorkStatus} size='small' sx={{ minWidth: '10rem', marginRight: '0.5rem' }}>
						{Object.entries(WORKSTATUS).map(([key, value]) => (
							<MenuItem key={key} value={key}>
								{value}
							</MenuItem>
						))}
					</Select>
				);
			default:
				return <TextField variant='outlined' size='small' value={searchText} />;
		}
	}, [searchCategory, workStatus, searchText]);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
			<Box sx={{ padding: '0 1.5rem' }}>
				<PathBreadcrumbs />
			</Box>
			<Grid container sx={{ flexDirection: 'column', flexGrow: 1 }}>
				<Grid size={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
				<Grid sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 1, padding: '0.5rem 1.5rem' }}>
					{unNomalList.map((item, idx) => (
						<Box key={idx} sx={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1rem', bgcolor: 'grey.50', borderRadius: '1rem' }}>
							<Box sx={{ width: '100%' }}>{item.label}</Box>
							<Box sx={{ display: 'flex', justifyContent: 'end', width: '100%' }}>
								<Typography variant='h4'>{countData[item.key]}</Typography>
							</Box>
						</Box>
					))}
				</Grid>
				<Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', alignItems: 'center', padding: '0.5rem 1.5rem', gap: '0.5rem' }}>
					<Select id='demo-simple-select' value={searchCategory} onChange={handleChangeSearchCategory} size='small'>
						<MenuItem value={'depthNm'}>부서명</MenuItem>
						<MenuItem value={'memberNm'}>근무자</MenuItem>
						<MenuItem value={'workStatus'}>근로상태</MenuItem>
					</Select>
					{changeSearchCategoryContents}
					<Button variant='contained'>검색</Button>
				</Grid>
				<Grid sx={{ flexDirection: 'column', flexGrow: 1 }}>
					<CustomAgGridComp rowData={rowData} colDefs={colDefs} rowSelectionMode='single' rowHeight={60} />
				</Grid>
			</Grid>
		</Box>
	);
}
