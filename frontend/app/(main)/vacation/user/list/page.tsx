'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import secureLocalStorage from 'react-secure-storage';

/** Lib */
import dayjs from 'dayjs';

import useLoaderStore from '@/store/useLoaderStore';

/** MUI */
import { Box, Grid, Button } from '@mui/material';
import { ArrowBackRounded } from '@mui/icons-material';

/** Ag Grid */
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';

/** Custom */
import DetailSearchFilterComp from '@/app/_component/layoutElement/DetailSearchFilterComp';

/** Type / Interface */
import { FilterField, FilterValues, PageRequest, PageResponse } from '@/type/interface';
import { BASICSTATUS, PAGE_SIZE_OPTIONS } from '@/constant/commonConst';
import { VACATIONTYPE } from '@/constant/attendanceConst';
import { TRANSACTIONTYPE, VACATIONCATEGORY } from '@/constant/vacationConst';

import { colDefs, historyColDefs } from '@/constant/vacationColDef';
import { vacationService, VacationHistorySearchRequestDto, VacationHistoryDto } from '@/app/services/vacationService';
import { vacationApplicationService, VacationAppSearchRequestDto, vacationApplicationDataDto } from '@/app/services/vacationApplicationService';
import { FilterRef } from '@/app/_component/layoutElement/DetailSearchFilterComp';

const historyFieldDefault: FilterValues = {
	startDate: dayjs().startOf('year'),
	endDate: dayjs().endOf('year'),
	transactionType: 'all',
	vacationCategory: 'all',
	vacationDesc: '',
};

const applicationFieldDefault: FilterValues = {
	startDate: dayjs().startOf('year'),
	endDate: dayjs().endOf('year'),
	status: 'all',
	vacationType: 'all',
	vacationStart: 'all',
	vacationEnd: 'all',
};

const detailHistorySearchFields: FilterField[] = [
	{
		key: 'transactionType',
		label: '휴가 관리 상태',
		type: 'select',
		options: Object.entries(TRANSACTIONTYPE).map(([key, value]) => ({
			label: value,
			value: String(key),
		})),
	},
	{
		key: 'vacationCategory',
		label: '휴가 카테고리',
		type: 'select',
		options: Object.entries(VACATIONCATEGORY).map(([key, value]) => ({
			label: value,
			value: String(key),
		})),
	},
	{
		key: 'vacationDesc',
		label: '상세',
		type: 'text',
	},
];

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
];

export default function VacationUserListPage() {
	const router = useRouter();
	const searchParam = useSearchParams();
	const type = searchParam.get('type');
	const { loader, setLoader } = useLoaderStore();

	const detailSearchFilterRef = useRef<FilterRef>(null);

	const [gridColDef, setGridColDef] = useState(historyColDefs);
	const [gridData, setGridData] = useState<Record<string, any>[]>([]);
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(50);
	const [totalElements, setTotalElements] = useState(0);

	useEffect(() => {
		setGridColDef(type === 'vacationHistory' ? historyColDefs : colDefs);

		if (detailSearchFilterRef.current) {
			getListData(detailSearchFilterRef.current.getFilterValues());
		} else {
			if (type === 'planVacation') {
				getListData({ ...applicationFieldDefault, startDate: dayjs() });
			} else if (type === 'endVacation') {
				getListData({ ...applicationFieldDefault, endDate: dayjs() });
			} else {
				getListData(historyFieldDefault);
			}
		}
	}, [type]);

	const getListData = async (data: FilterValues) => {
		if (!loader) setLoader(true);

		try {
			const req: PageRequest<VacationHistorySearchRequestDto> = {
				number: page,
				size: pageSize,
			};

			if (type === 'vacationHistory') {
				const _request: VacationHistorySearchRequestDto = {
					memberId: Number(secureLocalStorage.getItem('memberId')),
					startDate: data.startDate ? data.startDate.format('YYYY-MM-DD') : null,
					endDate: data.endDate ? data.endDate.format('YYYY-MM-DD') : null,
					transactionType: data.transactionType,
					vacationCategory: data.vacationCategory,
					vacationDesc: data.vacationDesc,
				};

				const res: PageResponse<VacationHistoryDto> = await vacationService.searchVacationHistoryData({ ...req, request: _request });
				setGridData(res.content);
				setTotalElements(res.totalElements);
			} else {
				const _request: VacationAppSearchRequestDto = {
					memberId: Number(secureLocalStorage.getItem('memberId')),
					startDate: data.startDate ? data.startDate.format('YYYY-MM-DD') : null,
					endDate: data.endDate ? data.endDate.format('YYYY-MM-DD') : null,
					status: data.status,
					vacationType: data.vacationType,
					vacationStart: data.vacationStart,
					vacationEnd: data.vacationEnd,
				};

				const res: PageResponse<vacationApplicationDataDto> = await vacationApplicationService.searchUserVacationApplicationData(
					{
						...req,
						request: _request,
					},
					type === 'planVacation' ? 'plan' : 'end',
				);

				setGridData(res.content);
				setTotalElements(res.totalElements);
			}
		} finally {
			setLoader(false);
		}
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
			<Box sx={{ p: '1rem 1.5rem' }}>
				<Button startIcon={<ArrowBackRounded fontSize='small' />} onClick={(e) => router.back()}>
					뒤로 가기
				</Button>
			</Box>
			<Grid container sx={{ flexGrow: 1, flexDirection: 'column', width: '100%', height: 'auto', backgroundColor: 'grey.50' }}>
				<DetailSearchFilterComp
					ref={detailSearchFilterRef}
					title={'연차 내역'}
					fields={type === 'vacationHistory' ? detailHistorySearchFields : detailAppSearchFields}
					fieldDefault={
						type === 'planVacation'
							? { ...applicationFieldDefault, startDate: dayjs() }
							: type === 'endVacation'
								? { ...applicationFieldDefault, endDate: dayjs() }
								: historyFieldDefault
					}
					startDateMin={type === 'planVacation' ? dayjs() : null}
					startDateMax={type === 'endVacation' ? dayjs() : null}
					endDateMin={type === 'planVacation' ? dayjs() : null}
					endDateMax={type === 'endVacation' ? dayjs() : null}
					onSearch={getListData}
					onReset={() => {}}
				/>

				<Grid sx={{ width: '100%', flexGrow: 1 }}>
					<CustomAgGridComp
						rowData={gridData}
						colDefs={gridColDef}
						rowSelectionMode='none'
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
