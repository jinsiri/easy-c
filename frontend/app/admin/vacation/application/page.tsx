'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

/** Lib */
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import useLoaderStore from '@/store/useLoaderStore';
import useModalStore from '@/store/useModalStore';

/** MUI */
import { Box, Button, Grid, Typography, TextField, Select, MenuItem, SelectChangeEvent } from '@mui/material';

/** Ag Grid */
import { ColDef } from 'ag-grid-community';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';

/** Custom */
import { VACATIONTYPE, WORKSTATUS, WORKTYPE } from '@/constant/attendanceConst';
import { BASICSTATUS } from '@/constant/commonConst';
import StatusComp from '@/app/_component/baseElement/StatusComp';

import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';

/** Type / Interface */
import { SearchRequestDto } from '@/type/interface';
import { vacationApplicationDto, vacationApplicationService } from '@/app/services/vacationApplicationService';
import { useRouter } from 'next/navigation';

dayjs.extend(duration);

export default function VacationApplicationPage() {
	const router = useRouter();
	const { setLoader } = useLoaderStore();
	const { setModalData } = useModalStore();

	const [searchCategory, setSearchCategory] = useState<string>('memberNm');
	const [searchValue, setSearchValue] = useState<string>('');
	const [rowData, setRowData] = useState<Record<string, any>[]>([]);

	const colDefs: ColDef<Record<string, any>>[] = [
		{
			field: 'status',
			headerName: '상태',
			flex: 1,
			cellRenderer: (data) => (
				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
					{data.value ? <StatusComp status={data.value} /> : '-'}
				</Box>
			),
		},
		{
			field: 'member',
			headerName: '근무자',
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
			cellRenderer: (param) => (
				<Box sx={{ py: '6px' }}>
					<Typography>
						{param.data.startDate ? dayjs(param.data.startDate).format('YYYY-MM-DD') : '-'}
						{param.data.endDate ? ' ~ ' + dayjs(param.data.endDate).format('YYYY-MM-DD') : ''}
					</Typography>
				</Box>
			),
		},
		{
			field: 'detail',
			headerName: '상세',
			cellRenderer: (param) => (
				<Box
					sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', py: '6px' }}
					onClick={(e) => {
						setModalData(param.data);
						router.push('/vacation/user/modal?type=read');
					}}
				>
					<Button variant='outlined'>상세 보기</Button>
				</Box>
			),
		},
		{
			field: 'action',
			headerName: '처리',
			cellRenderer: (param) => (
				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', gap: 1, py: '6px' }}>
					<Button variant='contained' onClick={(e) => clickEvent('approve', param.data)}>
						승인
					</Button>
					<Button variant='contained' color='error' onClick={(e) => clickEvent('reject', param.data)}>
						반려
					</Button>
				</Box>
			),
		},
	];

	useEffect(() => {
		onClickSearch();
	}, []);

	const onClickSearch = async () => {
		setLoader(true);

		try {
			const req: SearchRequestDto = {
				searchCategory: searchCategory,
				searchValue: searchValue,
			};

			const res: vacationApplicationDto[] = await vacationApplicationService.searchVacationApplication(req);
			setRowData(res);
		} finally {
			setLoader(false);
		}
	};

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

	const clickEvent = async (type: 'reject' | 'approve', data: vacationApplicationDto) => {
		if (data !== null) {
			if (type === 'reject') {
				await vacationApplicationService.rejectAttendanceApplication(data);
				if (confirm('반려처리가 성공적으로 완료되었습니다.')) {
					onClickSearch();
				}
			} else {
				await vacationApplicationService.approveAttendanceApplication(data);
				if (confirm('승인처리가 성공적으로 완료되었습니다.')) {
					onClickSearch();
				}
			}
		}
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
			<Box sx={{ padding: '0 1.5rem' }}>
				<PathBreadcrumbs />
			</Box>
			<Grid container sx={{ flexDirection: 'column', flexGrow: 1 }}>
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
					<CustomAgGridComp rowData={rowData} colDefs={colDefs} rowSelectionMode='single' enableClickSelection={false} rowHeight={80} />
				</Grid>
			</Grid>
		</Box>
	);
}
