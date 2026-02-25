'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

/** Lib */
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

/** MUI */
import { Box, Button, Grid, IconButton, Typography, TextField, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { ArrowLeftRounded, ArrowRightRounded } from '@mui/icons-material';

/** Ag Grid */
import { ColDef } from 'ag-grid-community';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';
import useLoaderStore from '@/store/useLoaderStore';

/** Custom */
import { WORKSTATUS, WORKTYPE } from '@/constant/attendanceConst';
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import ButtonFieldDatePicker from '@/app/_component/ButtonFieldDatePicker';
import { formatMinutes } from '@/utils/commonFunc';

/** Type / Interface */
import { workStatus, workType } from '@/type/types';
import { AttendanceDayResDto } from '@/app/services/attendanceService';
import { AttendanceCompanyRequestDto, AttendanceCompanyResponseDto, attendancePolicyService } from '@/app/services/attendanceCompanyService';

dayjs.extend(duration);

const unNomalList = [
	{ key: 'allCount', label: '전체' },
	{ key: 'lateCount', label: WORKSTATUS['LATE'] },
	{ key: 'earlyLeaveCount', label: WORKSTATUS['EARLY_LEAVE'] },
	{ key: 'absentCount', label: WORKSTATUS['ABSENT'] },
	{ key: 'changeRequestCount', label: '정정신청' },
];

export default function AttendanceCompanyPage() {
	const { setLoader } = useLoaderStore();

	const [searchCategory, setSearchCategory] = useState<string>('memberNm');
	const [searchValue, setSearchValue] = useState<string>('');

	const [calendarDate, setCalendarDate] = useState<dayjs.Dayjs>(dayjs());
	const [rowData, setRowData] = useState<Record<string, any>[]>([]);
	const [countData, setCountData] = useState<Record<string, number>>({
		allCount: 0,
		lateCount: 0,
		earlyLeaveCount: 0,
		absentCount: 0,
		changeRequestCount: 0,
	});

	const colDefs: ColDef<Record<string, any>>[] = [
		{ field: 'workDate', headerName: '근무일', flex: 1 },
		{
			field: 'member',
			headerName: '근무자',
			flex: 1,
			cellRenderer: (param) => {
				const deptNm = param.data?.deptNm;
				const jobGrade = param.data?.jobGrade;

				return (
					<Box sx={{ py: '6px' }}>
						<Typography>{param.data.memberNm}</Typography>
						<Typography variant='body2'>{deptNm && jobGrade ? deptNm + ' / ' + jobGrade : '-'}</Typography>
						<Typography>{param.data.attendancePolicyName}</Typography>
					</Box>
				);
			},
		},
		{
			field: 'workType',
			headerName: '근로타입',
			flex: 1,
			valueFormatter: (param) => (param.data ? WORKTYPE[param.data.workType as workType] : '-'),
		},
		{
			field: 'workStatus',
			headerName: '근로상태',
			flex: 1,
			valueFormatter: (param) => (param.data ? WORKSTATUS[param.data.workStatus as workStatus] : '-'),
		},
		{
			field: 'time',
			headerName: '근로시간',
			flex: 3,
			cellRenderer: (param) => (
				<Box sx={{ py: '6px' }}>
					<Typography>총 근로시간(분): {formatMinutes(param.data.fullTime)}</Typography>

					<Typography>출근시간: {param.data.startTime ? dayjs(param.data.startTime).format('HH:mm') : '-'}</Typography>
					<Typography>퇴근시간: {param.data.endTime ? dayjs(param.data.endTime).format('HH:mm') : '-'}</Typography>
				</Box>
			),
		},
	];

	useEffect(() => {
		getAttendanceCompanyOnedayData();
	}, [calendarDate]);

	const getAttendanceCompanyOnedayData = async () => {
		setLoader(true);

		try {
			const res: AttendanceCompanyResponseDto = await attendancePolicyService.getAttendanceCompanyOnedayData({
				workDate: calendarDate.format('YYYY-MM-DD'),
			});

			setCountData({
				allCount: res.allCount,
				lateCount: res.lateCount,
				earlyLeaveCount: res.earlyLeaveCount,
				absentCount: res.absentCount,
				changeRequestCount: res.changeRequestCount,
			});

			setRowData(res.dayData);
			setSearchCategory('memberNm');
			setSearchValue('');
		} catch (error: any) {
		} finally {
			setLoader(false);
		}
	};

	const onClickSearch = async () => {
		setLoader(true);

		try {
			const req: AttendanceCompanyRequestDto = {
				workDate: calendarDate.format('YYYY-MM-DD'),
				searchCategory: searchCategory,
				searchValue: searchValue,
			};

			const res: AttendanceDayResDto[] = await attendancePolicyService.getAttendanceCompanySearch(req);
			setRowData(res);
		} catch (error: any) {
		} finally {
			setLoader(false);
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

	const handleChangeSearchCategory = useCallback(
		(event: SelectChangeEvent) => {
			const targetValue = event.target.value;

			if (searchCategory !== targetValue) {
				switch (targetValue) {
					case 'workStatus':
						setSearchValue('PRESENT');
						break;
					default:
						setSearchValue('');
				}

				setSearchCategory(targetValue);
			}
		},
		[searchCategory],
	);

	const onChangeValue = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
		setSearchValue(event.target.value);
	}, []);

	const changeSearchCategoryContents = useMemo(() => {
		switch (searchCategory) {
			case 'workStatus':
				return (
					<Select name={'workStatus'} value={searchValue} onChange={onChangeValue} size='small' sx={{ minWidth: '10rem', marginRight: '0.5rem' }}>
						{Object.entries(WORKSTATUS).map(([key, value]) => (
							<MenuItem key={key} value={key}>
								{value}
							</MenuItem>
						))}
					</Select>
				);
			default:
				return <TextField variant='outlined' size='small' value={searchValue} onChange={onChangeValue} />;
		}
	}, [searchCategory, searchValue]);

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
					<Button variant='contained' onClick={onClickSearch}>
						검색
					</Button>
				</Grid>
				<Grid sx={{ flexDirection: 'column', flexGrow: 1 }}>
					<CustomAgGridComp rowData={rowData} colDefs={colDefs} rowSelectionMode='none' rowHeight={80} />
				</Grid>
			</Grid>
		</Box>
	);
}
