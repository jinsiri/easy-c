'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

/** Lib */
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import useLoaderStore from '@/store/useLoaderStore';
import useModalStore from '@/store/useModalStore';

/** MUI */
import { Box, Button, Grid } from '@mui/material';

/** Ag Grid */
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';

/** Custom */
import { downloadExcel } from '@/utils/excelDownloadFunc';

import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import DetailSearchFilterComp from '@/app/_component/layoutElement/DetailSearchFilterComp';

/** Type / Interface */
import { ExcelRequestDto, FilterField, FilterValues, PageRequest, PageResponse } from '@/type/interface';
import { BASICSTATUS, PAGE_SIZE_OPTIONS } from '@/constant/commonConst';
import { VACATIONTYPE } from '@/constant/attendanceConst';
import { adminBasicColDef, getAdminBasicDetailColumn, getAdminBasicActionColumn } from '@/constant/commonColDef';
import {
	vacationApplicationDto,
	vacationApplicationService,
	VacationAppSearchRequestDto,
	vacationApplicationDataDto,
} from '@/app/services/vacationApplicationService';
import { FilterRef } from '@/app/_component/layoutElement/DetailSearchFilterComp';

dayjs.extend(duration);

const applicationFieldDefault: FilterValues = {
	startDate: dayjs().startOf('year'),
	endDate: dayjs().endOf('year'),
	status: 'all',
	vacationType: 'all',
	vacationStart: 'all',
	vacationEnd: 'all',
	deptNm: '',
	memberNm: '',
};

const detailAppSearchFields: FilterField[] = [
	{
		key: 'status',
		label: '상태',
		type: 'select',
		options: Object.entries(BASICSTATUS).map(([key, value]) => ({
			label: value,
			value: String(key),
		})),
	},
	{
		key: 'vacationType',
		label: '휴가 종류',
		type: 'select',
		options: Object.entries(VACATIONTYPE).map(([key, value]) => ({
			label: value,
			value: String(key),
		})),
	},
	{
		key: 'vacationStart',
		label: '시작 휴가일 수',
		type: 'select',
		options: [
			{
				label: '1일 이상',
				value: '1',
			},
			{
				label: '2일 이상',
				value: '2',
			},
			{
				label: '3일 이상',
				value: '3',
			},
			{
				label: '4일 이상',
				value: '4',
			},
			{
				label: '5일 이상',
				value: '5',
			},
		],
		validate: (data, watchAllFields) => {
			if (data != 'all' && watchAllFields['vacationEnd'] != 'all' && Number(data) > Number(watchAllFields['vacationEnd'])) {
				return '종료일 수보다 작아야 합니다.';
			}
			return true;
		},
	},
	{
		key: 'vacationEnd',
		label: '종료 휴가일 수',
		type: 'select',
		options: [
			{
				label: '1일 이하',
				value: '1',
			},
			{
				label: '2일 이하',
				value: '2',
			},
			{
				label: '3일 이하',
				value: '3',
			},
			{
				label: '4일 이하',
				value: '4',
			},
			{
				label: '5일 이하',
				value: '5',
			},
		],
		validate: (data, watchAllFields) => {
			if (data != 'all' && watchAllFields['vacationStart'] != 'all' && Number(data) < Number(watchAllFields['vacationStart'])) {
				return '시작일 수보다 커야 합니다.';
			}
			return true;
		},
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

export default function VacationApplicationPage() {
	const router = useRouter();
	const { setLoader } = useLoaderStore();
	const { setModalData } = useModalStore();

	const gridRef = useRef();
	const detailSearchFilterRef = useRef<FilterRef>(null);

	const [gridData, setGridData] = useState<Record<string, any>[]>([]);
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(50);
	const [totalElements, setTotalElements] = useState(0);

	useEffect(() => {
		if (detailSearchFilterRef.current) {
			onClickSearch(detailSearchFilterRef.current.getFilterValues());
		} else {
			onClickSearch(applicationFieldDefault);
		}
	}, []);

	const onClickSearch = useCallback(async (data: FilterValues) => {
		setLoader(true);

		try {
			const _request: PageRequest<VacationAppSearchRequestDto> = {
				number: page,
				size: pageSize,
				request: {
					...data,
					memberId: null,
					startDate: data.startDate ? data.startDate.format('YYYY-MM-DD') : null,
					endDate: data.endDate ? data.endDate.format('YYYY-MM-DD') : null,
				},
			};

			const res: PageResponse<vacationApplicationDataDto> = await vacationApplicationService.searchVacationApplication(_request);
			setGridData(res.content);
			setTotalElements(res.totalElements);
		} finally {
			setLoader(false);
		}
	}, []);

	const onClickExcel = useCallback(async (data: FilterValues) => {
		setLoader(true);

		try {
			const req: ExcelRequestDto<VacationAppSearchRequestDto> = {
				fileName: '휴가신청내역',
				request: {
					...data,
					memberId: null,
					startDate: data.startDate ? data.startDate.format('YYYY-MM-DD') : null,
					endDate: data.endDate ? data.endDate.format('YYYY-MM-DD') : null,
				},
			};

			downloadExcel('/api/vacation/application/excel', req);
		} finally {
			setLoader(false);
		}
	}, []);

	const approveRejectData = useCallback(
		async (type: 'reject' | 'approve', data: vacationApplicationDto[]) => {
			try {
				if (type === 'reject') {
					await vacationApplicationService.rejectAttendanceApplication(data);
					alert('반려처리가 성공적으로 완료되었습니다.');
				} else {
					await vacationApplicationService.approveAttendanceApplication(data);
					alert('승인처리가 성공적으로 완료되었습니다.');
				}

				if (detailSearchFilterRef.current) {
					onClickSearch(detailSearchFilterRef.current.getFilterValues());
				} else {
					onClickSearch(applicationFieldDefault);
				}
			} catch (error) {
				console.error(error);
			}
		},
		[onClickSearch],
	);

	const onClickAllEvent = useCallback(
		(type: 'reject' | 'approve') => {
			if (gridRef.current) {
				const selectedRows = gridRef.current.api.getSelectedRows();
				approveRejectData(type, selectedRows);
			}
		},
		[approveRejectData],
	);

	const colDefs = useMemo(() => {
		const onClickDetail = (param: any) => {
			setModalData(param.data);
			router.push('/vacation/user/modal?type=read');
		};

		const clickEvent = async (type: 'reject' | 'approve', data: vacationApplicationDto) => {
			if (data !== null) {
				approveRejectData(type, [data]);
			}
		};

		const uniqueCols = [
			{
				field: 'vacationType',
				headerName: '휴가종류',
				valueFormatter: (param) => (param.value ? VACATIONTYPE[param.value] : '-'),
			},
			{
				field: 'vacationDuration',
				headerName: '휴가일수',
			},
			{
				field: 'time',
				headerName: '휴가기간',
				flex: 3,
				valueFormatter: (param) => {
					const start = param.data?.startDate ? dayjs(param.data.startDate).format('YYYY-MM-DD') : '-';
					const end = param.data?.endDate ? ` ~ ${dayjs(param.data.endDate).format('YYYY-MM-DD')}` : '';
					return start + end;
				},
			},
		];

		return [...adminBasicColDef, ...uniqueCols, getAdminBasicDetailColumn(onClickDetail), getAdminBasicActionColumn(clickEvent)];
	}, [router, setModalData, approveRejectData]);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: 'grey.50' }}>
			<Box sx={{ padding: '0 1.5rem' }}>
				<PathBreadcrumbs sx={{ mb: 0 }} />
			</Box>
			<Grid container sx={{ flexDirection: 'column', flexGrow: 1, backgroundColor: 'grey.50' }}>
				<Grid>
					<DetailSearchFilterComp
						ref={detailSearchFilterRef}
						fields={detailAppSearchFields}
						fieldDefault={applicationFieldDefault}
						isExcel={true}
						onSearch={onClickSearch}
						onReset={() => {}}
						onClickExcelDown={onClickExcel}
					/>
				</Grid>
				<Grid
					sx={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						padding: '0.5rem 1.5rem',
						gap: '0.5rem',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							gap: '0.5rem',
						}}
					>
						<Button variant='contained' onClick={(e) => onClickAllEvent('approve')}>
							일괄승인
						</Button>
						<Button variant='contained' color='error' onClick={(e) => onClickAllEvent('reject')}>
							일괄반려
						</Button>
					</Box>
				</Grid>
				<Grid sx={{ flexDirection: 'column', flexGrow: 1 }}>
					<CustomAgGridComp
						ref={gridRef}
						rowData={gridData}
						colDefs={colDefs}
						rowSelectionMode='single'
						enableClickSelection={false}
						rowHeight={56}
						isRowSelectable={(rowNode) => {
							return rowNode.data.status ? rowNode.data.status === 'PENDING' : false;
						}}
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
