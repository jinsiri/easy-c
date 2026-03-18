'use client';

import { useCallback, useEffect, useMemo, useState, useRef } from 'react';

/** Lib */
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import useLoaderStore from '@/store/useLoaderStore';

/** MUI */
import { Box, Grid } from '@mui/material';

/** Ag Grid */
import { ColDef } from 'ag-grid-community';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';

/** Custom */
import { downloadExcel } from '@/utils/excelDownloadFunc';

import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import GridMemberComp from '@/app/_component/baseElement/GridMemberComp';
import DetailSearchFilterComp from '@/app/_component/layoutElement/DetailSearchFilterComp';

/** Type / Interface */
import { ExcelRequestDto, FilterField, FilterValues, PageRequest, PageResponse } from '@/type/interface';
import { PAGE_SIZE_OPTIONS } from '@/constant/commonConst';
import { VacationCompanySearchRequestDto, VacationDataDto, vacationService } from '@/app/services/vacationService';
import { FilterRef } from '@/app/_component/layoutElement/DetailSearchFilterComp';

dayjs.extend(duration);

const applicationFieldDefault: FilterValues = {
	startDate: null,
	endDate: null,
	deptNm: '',
	memberNm: '',
};

const detailAppSearchFields: FilterField[] = [
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

export default function VacationCompanyPage() {
	const { setLoader } = useLoaderStore();

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
			const req: PageRequest<VacationCompanySearchRequestDto> = {
				number: page,
				size: pageSize,
				request: {
					...data,
					year: dayjs().get('year'),
				},
			};

			const res: PageResponse<VacationDataDto> = await vacationService.searchVacationData(req);
			setGridData(res.content);
			setTotalElements(res.totalElements);
		} finally {
			setLoader(false);
		}
	}, []);

	const onClickExcel = useCallback(async (data: FilterValues) => {
		setLoader(true);

		try {
			const req: ExcelRequestDto<VacationCompanySearchRequestDto> = {
				fileName: '전사휴가내역',
				request: {
					...data,
					year: dayjs().get('year'),
				},
			};

			downloadExcel('/api/vacation/excel', req);
		} finally {
			setLoader(false);
		}
	}, []);

	const colDefs: ColDef<Record<string, any>>[] = useMemo(() => {
		return [
			{
				field: 'member',
				headerName: '근무자',
				flex: 2,
				cellRenderer: (param) => {
					const deptNm = param.data?.deptNm;
					const jobGrade = param.data?.jobGrade;

					return (
						<Box sx={{ py: '6px' }}>
							<GridMemberComp memberNm={param.data.memberNm} deptNm={deptNm} jobGrade={jobGrade} policyNm={param.data.vacationPolicyName} />
						</Box>
					);
				},
			},
			{
				field: 'grantedDay',
				headerName: '전체 휴가',
			},
			{
				field: 'usedDay',
				headerName: '사용 휴가',
			},

			{
				field: 'annualVacation',
				headerName: '연차',
			},
			{
				field: 'sickVacation',
				headerName: '병가',
			},
			{
				field: 'holidayVacation',
				headerName: '휴일연차',
			},
			{
				field: 'specialVacation',
				headerName: '특별연차',
			},
			{
				field: 'carryOverDay',
				headerName: '이월연차',
			},
		];
	}, []);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
			<Box sx={{ padding: '0 1.5rem' }}>
				<PathBreadcrumbs />
			</Box>
			<Grid container sx={{ flexDirection: 'column', flexGrow: 1 }}>
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
						rowData={gridData}
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
