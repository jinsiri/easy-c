'use client';

import { useCallback, useEffect, useMemo, useState, useRef } from 'react';

/** Lib */
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

/** MUI */
import { Box, Grid, IconButton, Typography } from '@mui/material';
import { ArrowLeftRounded, ArrowRightRounded } from '@mui/icons-material';

/** Ag Grid */
import { ColDef } from 'ag-grid-community';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';
import useLoaderStore from '@/store/useLoaderStore';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import ButtonFieldDatePicker from '@/app/_component/ButtonFieldDatePicker';
import DetailSearchFilterComp from '@/app/_component/layoutElement/DetailSearchFilterComp';
import GridMemberComp from '@/app/_component/baseElement/GridMemberComp';

import { formatMinutes } from '@/utils/commonFunc';
import { downloadExcel } from '@/utils/excelDownloadFunc';

/** Type / Interface */
import { WORKSTATUS, WORKTYPE } from '@/constant/attendanceConst';
import { PAGE_SIZE_OPTIONS } from '@/constant/commonConst';

import { FilterField, FilterValues, PageRequest } from '@/type/interface';
import { workStatus, workType } from '@/type/types';
import { ExcelRequestDto } from '@/type/interface';
import { attendanceCompanyService, AttendanceCompanySearchRequestDto, AttendanceCompanySearchResponseDto } from '@/app/services/attendanceCompanyService';
import { FilterRef } from '@/app/_component/layoutElement/DetailSearchFilterComp';

dayjs.extend(duration);

const unNomalList = [
	{ key: 'allCount', label: '전체' },
	{ key: 'lateCount', label: WORKSTATUS['LATE'] },
	{ key: 'earlyLeaveCount', label: WORKSTATUS['EARLY_LEAVE'] },
	{ key: 'absentCount', label: WORKSTATUS['ABSENT'] },
	{ key: 'changeRequestCount', label: '정정신청' },
];

const applicationFieldDefault: FilterValues = {
	startDate: dayjs(),
	endDate: dayjs(),
	deptNm: '',
	memberNm: '',
	workType: 'all',
	workStatus: 'all',
};

const detailAppSearchFields: FilterField[] = [
	{
		key: 'workType',
		label: '근로타입',
		type: 'select',
		options: Object.entries(WORKTYPE).map(([key, value]) => ({
			label: value,
			value: String(key),
		})),
	},
	{
		key: 'workStatus',
		label: '근로상태',
		type: 'select',
		options: Object.entries(WORKSTATUS).map(([key, value]) => ({
			label: value,
			value: String(key),
		})),
	},
	{
		key: 'deptNm',
		label: '부서명',
		type: 'text',
	},
	{
		key: 'memberNm',
		label: '근로자명',
		type: 'text',
	},
];

export default function AttendanceCompanyPage() {
	const { setLoader } = useLoaderStore();

	const detailSearchFilterRef = useRef<FilterRef>(null);

	const [calendarDate, setCalendarDate] = useState<dayjs.Dayjs>(dayjs());
	const [countData, setCountData] = useState<Record<string, number>>({
		allCount: 0,
		lateCount: 0,
		earlyLeaveCount: 0,
		absentCount: 0,
		changeRequestCount: 0,
	});
	const [rowData, setRowData] = useState<Record<string, any>[]>([]);
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(50);
	const [totalElements, setTotalElements] = useState(0);

	useEffect(() => {
		if (detailSearchFilterRef.current) {
			onClickSearch(detailSearchFilterRef.current.getFilterValues());
		} else {
			onClickSearch(applicationFieldDefault);
		}
	}, [calendarDate]);

	const onClickSearch = useCallback(async (data: FilterValues) => {
		setLoader(true);

		try {
			const req: PageRequest<AttendanceCompanySearchRequestDto> = {
				number: page,
				size: pageSize,
				request: {
					...data,
					startDate: data.startDate ? data.startDate.format('YYYY-MM-DD') : null,
					endDate: data.endDate ? data.endDate.format('YYYY-MM-DD') : null,
				},
			};

			const res: AttendanceCompanySearchResponseDto = await attendanceCompanyService.searchVacationApplication(req);
			setCountData({
				allCount: res.allCount,
				lateCount: res.lateCount,
				earlyLeaveCount: res.earlyLeaveCount,
				absentCount: res.absentCount,
				changeRequestCount: res.changeRequestCount,
			});

			console.log(res);
			setRowData(res.dayData.content);
			setTotalElements(res.dayData.totalElements);
		} finally {
			setLoader(false);
		}
	}, []);

	const onClickExcel = useCallback(async (data: FilterValues) => {
		setLoader(true);

		try {
			const req: ExcelRequestDto<AttendanceCompanySearchRequestDto> = {
				fileName: '전사근태내역',
				request: {
					...data,
					startDate: data.startDate ? data.startDate.format('YYYY-MM-DD') : null,
					endDate: data.endDate ? data.endDate.format('YYYY-MM-DD') : null,
				},
			};

			downloadExcel('/api/attendance/company/excel', req);
		} finally {
			setLoader(false);
		}
	}, []);

	const onChangeDatePicker = useCallback(
		(value) => {
			if (value != null) {
				setCalendarDate(value);
			}
		},
		[calendarDate],
	);

	const colDefs: ColDef<Record<string, any>>[] = useMemo(
		() => [
			{ field: 'workDate', headerName: '근무일', flex: 1 },
			{
				field: 'member',
				headerName: '근무자',
				cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
				cellRenderer: (params: any) => {
					const { deptNm, jobGrade, memberNm, vacationPolicyName } = params.data || {};
					return <GridMemberComp memberNm={memberNm} deptNm={deptNm} jobGrade={jobGrade} policyNm={vacationPolicyName} />;
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
				cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
				cellRenderer: (param) => (
					<Box>
						<Typography>총 근로시간(분): {formatMinutes(param.data.fullTime)}</Typography>
						<Typography>출근시간: {param.data.startTime ? dayjs(param.data.startTime).format('HH:mm') : '-'}</Typography>
						<Typography>퇴근시간: {param.data.endTime ? dayjs(param.data.endTime).format('HH:mm') : '-'}</Typography>
					</Box>
				),
			},
		],
		[],
	);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: 'grey.50' }}>
			<Box sx={{ padding: '0 1.5rem' }}>
				<PathBreadcrumbs sx={{ mb: 0 }} />
			</Box>
			<Grid container sx={{ flexDirection: 'column', flexGrow: 1 }}>
				<Grid size={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: '1rem' }}>
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
				<Grid
					size={12}
					sx={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'stretch',
						height: 'auto',
						padding: '0 1.5rem',
						gap: '1rem',
					}}
				>
					{unNomalList.map((item, idx) => (
						<Box
							key={idx}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								flex: 1,
								padding: '1rem',
								bgcolor: 'background.default',
								borderRadius: '1rem',
								border: '1px solid',
								borderColor: 'grey.200',
							}}
						>
							<Box sx={{ width: '100%' }}>{item.label}</Box>
							<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', width: '100%' }}>
								<Typography variant='h4'>{countData[item.key]}</Typography>
							</Box>
						</Box>
					))}
				</Grid>
				<Grid size={12} sx={{ backgroundColor: 'grey.50' }}>
					<DetailSearchFilterComp
						ref={detailSearchFilterRef}
						fields={detailAppSearchFields}
						fieldDefault={applicationFieldDefault}
						isExcel={true}
						isDate={false}
						onSearch={onClickSearch}
						onReset={() => {}}
						onClickExcelDown={onClickExcel}
					/>
				</Grid>
				<Grid size={12} sx={{ flexDirection: 'column', flexGrow: 1 }}>
					<CustomAgGridComp
						rowData={rowData}
						colDefs={colDefs}
						rowSelectionMode='none'
						rowHeight={80}
						serverPagination={{
							page,
							pageSize,
							totalElements,
							pageSizeOptions: PAGE_SIZE_OPTIONS,
							onPageChange: setPage,
							onPageSizeChange: (s) => {
								setPageSize(s);
								setPage(0);
							},
						}}
					/>
				</Grid>
			</Grid>
		</Box>
	);
}
