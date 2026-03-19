'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

/** Lib */
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import useLoaderStore from '@/store/useLoaderStore';
import useModalStore from '@/store/useModalStore';

/** MUI */
import { Box, Button, Grid, Typography } from '@mui/material';

/** Ag Grid */
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';

/** Custom */
import { downloadExcel } from '@/utils/excelDownloadFunc';
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import DetailSearchFilterComp from '@/app/_component/layoutElement/DetailSearchFilterComp';

/** Type / Interface */
import { ExcelRequestDto, FilterField, FilterValues, PageRequest, PageResponse } from '@/type/interface';
import { BASICSTATUS, PAGE_SIZE_OPTIONS } from '@/constant/commonConst';
import { adminBasicColDef, getAdminBasicDetailColumn, getAdminBasicActionColumn } from '@/constant/commonColDef';
import { AttendanceApplicationResponseDto, attendanceApplicationService, AttendanceAppSearchRequestDto } from '@/app/services/attendanceApplicationService';
import { FilterRef } from '@/app/_component/layoutElement/DetailSearchFilterComp';

dayjs.extend(duration);

const applicationFieldDefault: FilterValues = {
	startDate: dayjs().startOf('year'),
	endDate: dayjs().endOf('year'),
	status: 'all',
	deptNm: '',
	memberNm: '',
	summary: '',
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
		key: 'deptNm',
		label: '부서명',
		type: 'text',
	},
	{
		key: 'memberNm',
		label: '근로자명',
		type: 'text',
	},
	{
		key: 'summary',
		label: '수정 내용',
		type: 'text',
	},
];

export default function AttendanceApplicationPage() {
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
			const req: PageRequest<AttendanceAppSearchRequestDto> = {
				number: page,
				size: pageSize,
				request: {
					...data,
					memberId: null,
					startDate: data.startDate ? data.startDate.format('YYYY-MM-DD') : null,
					endDate: data.endDate ? data.endDate.format('YYYY-MM-DD') : null,
				},
			};

			const res: PageResponse<AttendanceApplicationResponseDto> = await attendanceApplicationService.searchAttendanceApplication(req);
			setGridData(res.content);
			setTotalElements(res.totalElements);
		} finally {
			setLoader(false);
		}
	}, []);

	const onClickExcel = useCallback(async (data: FilterValues) => {
		setLoader(true);

		try {
			const req: ExcelRequestDto<AttendanceAppSearchRequestDto> = {
				fileName: '근태요청내역',
				request: {
					...data,
					memberId: null,
					startDate: data.startDate ? data.startDate.format('YYYY-MM-DD') : null,
					endDate: data.endDate ? data.endDate.format('YYYY-MM-DD') : null,
				},
			};

			downloadExcel('/api/attendance/application/excel', req);
		} finally {
			setLoader(false);
		}
	}, []);

	const approveRejectData = useCallback(
		async (type: 'reject' | 'approve', data: AttendanceApplicationResponseDto[]) => {
			try {
				if (type === 'reject') {
					await attendanceApplicationService.rejectAttendanceApplication(data);
					alert('반려처리가 성공적으로 완료되었습니다.');
				} else {
					await attendanceApplicationService.approveAttendanceApplication(data);
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

	const clickAllEvent = useCallback(
		(type: 'reject' | 'approve') => {
			if (gridRef.current) {
				const selectedRows = gridRef.current.api.getSelectedRows();
				approveRejectData(type, selectedRows);
			}
		},
		[gridRef.current, approveRejectData],
	);

	const colDefs = useMemo(() => {
		const onClickDetail = (param: any) => {
			setModalData(param.data);
			router.push('/vacation/user/modal?type=read');
		};

		const clickEvent = async (type: 'reject' | 'approve', data: AttendanceApplicationResponseDto) => {
			if (data !== null) {
				approveRejectData(type, [data]);
			}
		};

		const uniqueCols = [
			{
				field: 'workDate',
				headerName: '수정 근무일',
				cellStyle: {
					textAlign: 'center',
				},
			},
			{
				field: 'summary',
				headerName: '수정 내용',
				cellRenderer: (param) => {
					const valueList: string[] = param?.value ? param.value.split(',') : [];
					return (
						<Box sx={{ py: '6px' }}>
							{valueList.map((item, idx) => (
								<Typography key={idx}>{item}</Typography>
							))}
						</Box>
					);
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
			<Grid container sx={{ flexDirection: 'column', flexGrow: 1 }}>
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
						<Button variant='contained' onClick={(e) => clickAllEvent('approve')}>
							일괄승인
						</Button>
						<Button variant='contained' color='error' onClick={(e) => clickAllEvent('reject')}>
							일괄반려
						</Button>
					</Box>
				</Grid>
				<Grid sx={{ flexDirection: 'column', flexGrow: 1 }}>
					<CustomAgGridComp
						ref={gridRef}
						rowData={gridData}
						colDefs={colDefs}
						rowSelectionMode='multiple'
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
