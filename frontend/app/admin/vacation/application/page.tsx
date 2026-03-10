'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

/** Lib */
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import useLoaderStore from '@/store/useLoaderStore';
import useModalStore from '@/store/useModalStore';

/** MUI */
import { Box, Button, Grid, Typography, TextField, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

/** Ag Grid */
import { ColDef } from 'ag-grid-community';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';

/** Custom */
import { VACATIONTYPE } from '@/constant/attendanceConst';
import GridStatusComp from '@/app/_component/baseElement/GridStatusComp';
import GridMemberComp from '@/app/_component/baseElement/GridMemberComp';

import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';

/** Type / Interface */
import { SearchRequestDto } from '@/type/interface';
import { vacationApplicationDto, vacationApplicationService } from '@/app/services/vacationApplicationService';
import { BASICSTATUS } from '@/constant/commonConst';

dayjs.extend(duration);

export default function VacationApplicationPage() {
	const router = useRouter();
	const { setLoader } = useLoaderStore();
	const { setModalData } = useModalStore();
	const gridRef = useRef();

	const [searchCategory, setSearchCategory] = useState<string>('status');
	const [searchValue, setSearchValue] = useState<string>('all');
	const [rowData, setRowData] = useState<Record<string, any>[]>([]);

	const colDefs: ColDef<Record<string, any>>[] = [
		{
			field: 'status',
			headerName: '상태',
			flex: 1,
			cellRenderer: (data) => (
				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
					{data.value ? <GridStatusComp status={data.value} /> : '-'}
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
						<GridMemberComp memberNm={param.data.memberNm} deptNm={deptNm} jobGrade={jobGrade} policyNm={param.data.vacationPolicyName} />
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
					<Button variant='outlined' size='small'>
						상세 보기
					</Button>
				</Box>
			),
		},
		{
			field: 'action',
			headerName: '처리',
			cellRenderer: (param) => {
				return (
					param.data.status === 'PENDING' && (
						<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', gap: 1, py: '6px' }}>
							<Button variant='contained' size='small' onClick={(e) => clickEvent('approve', param.data)}>
								승인
							</Button>
							<Button variant='contained' size='small' color='error' onClick={(e) => clickEvent('reject', param.data)}>
								반려
							</Button>
						</Box>
					)
				);
			},
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
			setSearchCategory('status');
			setSearchValue('all');
		} finally {
			setLoader(false);
		}
	};

	const handleChangeSearchCategory = useCallback(
		(event: SelectChangeEvent) => {
			const targetValue = event.target.value;

			if (searchCategory !== targetValue) {
				switch (targetValue) {
					case 'status':
						setSearchValue('all');
						break;
					case 'workDate':
						setSearchValue(dayjs().format('YYYY-MM-DD'));
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
			case 'status':
				return (
					<Select name={'status'} value={searchValue} onChange={onChangeValue} size='small' sx={{ minWidth: '10rem', marginRight: '0.5rem' }}>
						<MenuItem value={'all'}>전체</MenuItem>
						{Object.entries(BASICSTATUS).map(([key, value]) => (
							<MenuItem key={key} value={key}>
								{value}
							</MenuItem>
						))}
					</Select>
				);
			case 'workDate':
				return <DatePicker value={dayjs(searchValue, 'YYYY-MM-DD')} onChange={(newValue) => setSearchValue(dayjs(newValue).format('YYYY-MM-DD'))} />;
			default:
				return <TextField variant='outlined' size='small' value={searchValue} onChange={onChangeValue} />;
		}
	}, [searchCategory, searchValue]);

	const clickEvent = async (type: 'reject' | 'approve', data: vacationApplicationDto) => {
		if (data !== null) {
			approveRejectData(type, [data]);
		}
	};

	const clickAllEvent = (type: 'reject' | 'approve') => {
		if (gridRef.current) {
			const selectedRows = gridRef.current.api.getSelectedRows();
			approveRejectData(type, selectedRows);
		}
	};

	const approveRejectData = async (type: 'reject' | 'approve', data: vacationApplicationDto[]) => {
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
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
			<Box sx={{ padding: '0 1.5rem' }}>
				<PathBreadcrumbs />
			</Box>
			<Grid container sx={{ flexDirection: 'column', flexGrow: 1 }}>
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
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							gap: '0.5rem',
						}}
					>
						<Select id='demo-simple-select' value={searchCategory} onChange={handleChangeSearchCategory} size='small'>
							<MenuItem value={'status'}>근로상태</MenuItem>
							<MenuItem value={'depthNm'}>부서명</MenuItem>
							<MenuItem value={'memberNm'}>근무자</MenuItem>
							<MenuItem value={'workDate'}>휴가일</MenuItem>
						</Select>
						{changeSearchCategoryContents}
						<Button variant='contained' onClick={onClickSearch}>
							검색
						</Button>
					</Box>
				</Grid>
				<Grid sx={{ flexDirection: 'column', flexGrow: 1 }}>
					<CustomAgGridComp
						ref={gridRef}
						rowData={rowData}
						colDefs={colDefs}
						rowSelectionMode='single'
						enableClickSelection={false}
						rowHeight={56}
						isRowSelectable={(rowNode) => {
							return rowNode.data.status ? rowNode.data.status === 'PENDING' : false;
						}}
					/>
				</Grid>
			</Grid>
		</Box>
	);
}
