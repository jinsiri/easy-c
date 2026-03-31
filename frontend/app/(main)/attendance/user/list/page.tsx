'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import secureLocalStorage from 'react-secure-storage';

/** Lib */
import dayjs from 'dayjs';

import useLoaderStore from '@/store/useLoaderStore';
import useModalStore from '@/store/useModalStore';

/** MUI */
import { Box, Grid, Button } from '@mui/material';
import { ArrowBackRounded } from '@mui/icons-material';

/** Ag Grid */
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';

/** Custom */
import DetailSearchFilterComp from '@/app/_component/layoutElement/DetailSearchFilterComp';
import { colDefs } from '@/constant/attendanceColDef';

/** Type / Interface */
import { FilterField, FilterValues, PageRequest, PageResponse } from '@/type/interface';
import { BASICSTATUS, PAGE_SIZE_OPTIONS } from '@/constant/commonConst';

import { FilterRef } from '@/app/_component/layoutElement/DetailSearchFilterComp';
import { attendanceApplicationService, AttendanceAppSearchRequestDto } from '@/app/services/attendanceApplicationService';

const applicationFieldDefault: FilterValues = {
	startDate: dayjs().startOf('year'),
	endDate: dayjs().endOf('year'),
	workDate: null,
	status: 'all',
	summary: '',
};

const detailAppSearchFields: FilterField[] = [
	{
		key: 'workDate',
		label: '수정 근무일',
		type: 'date',
	},
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
		key: 'summary',
		label: '수정 내용',
		type: 'text',
	},
];

export default function AttendanceUserListPage() {
	const router = useRouter();
	const { loader, setLoader } = useLoaderStore();
	const { setModalData } = useModalStore();

	const detailSearchFilterRef = useRef<FilterRef>(null);

	const [gridData, setGridData] = useState<Record<string, any>[]>([]);
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(50);
	const [totalElements, setTotalElements] = useState(0);

	useEffect(() => {
		if (detailSearchFilterRef.current) {
			getListData(detailSearchFilterRef.current.getFilterValues());
		} else {
			getListData(applicationFieldDefault);
		}
	}, []);

	const getListData = async (data: FilterValues) => {
		if (!loader) setLoader(true);

		try {
			const req: PageRequest<AttendanceAppSearchRequestDto> = {
				number: page,
				size: pageSize,
				request: {
					...data,
					memberId: Number(secureLocalStorage.getItem('memberId')),
					startDate: data.startDate ? data.startDate.format('YYYY-MM-DD') : null,
					endDate: data.endDate ? data.endDate.format('YYYY-MM-DD') : null,
					workDate: data.workDate ? data.workDate.format('YYYY-MM-DD') : null,
				},
			};

			const res: PageResponse<AttendanceAppSearchRequestDto> = await attendanceApplicationService.searchAttendanceApplication(req);

			setGridData(res.content);
			setTotalElements(res.totalElements);
		} finally {
			setLoader(false);
		}
	};

	const onClickDetail = (data: any) => {
		setModalData(data);
		router.push('/attendance/user/modal?mode=detail');
	};

	const onClickRemove = (data: any) => {
		if (data.attendanceApplicationId) {
			if (confirm('근태수정요청을 취소하시겠습니까>')) {
				attendanceApplicationService.deleteUserAttendanceApplication(data.attendanceApplicationId);
				alert('근태수정요청이 성공적으로 취소되었습니다.');
			}
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
					fields={detailAppSearchFields}
					fieldDefault={applicationFieldDefault}
					startDateLabel={'신청일 기준 조회 시작일'}
					endDateLabel={'신청일 기준 조회 종료일'}
					onSearch={getListData}
					onReset={() => {}}
				/>

				<Grid sx={{ width: '100%', flexGrow: 1 }}>
					<CustomAgGridComp
						rowData={gridData}
						colDefs={colDefs(onClickDetail, onClickRemove)}
						rowSelectionMode='none'
						rowHeight={56}
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
