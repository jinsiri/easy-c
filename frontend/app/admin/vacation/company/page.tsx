'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

/** Lib */
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

/** MUI */
import { Box, Button, Grid, Typography, TextField, Select, MenuItem, SelectChangeEvent } from '@mui/material';

/** Ag Grid */
import { ColDef } from 'ag-grid-community';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';
import useLoaderStore from '@/store/useLoaderStore';

/** Custom */
import { WORKSTATUS } from '@/constant/attendanceConst';
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';

/** Type / Interface */
import { workStatus, workType } from '@/type/types';
import { VacationDataDto, vacationService } from '@/app/services/vacationService';
import { SearchRequestDto } from '@/type/interface';

dayjs.extend(duration);

export default function VacationCompanyPage() {
	const { setLoader } = useLoaderStore();

	const [searchCategory, setSearchCategory] = useState<string>('memberNm');
	const [searchValue, setSearchValue] = useState<string>('');
	const [rowData, setRowData] = useState<Record<string, any>[]>([]);

	const colDefs: ColDef<Record<string, any>>[] = [
		{
			field: 'member',
			headerName: '근무자',
			flex: 2,
			cellRenderer: (param) => {
				const deptNm = param.data?.deptNm;
				const jobGrade = param.data?.jobGrade;

				return (
					<Box sx={{ py: '6px' }}>
						<Typography>{param.data.memberNm}</Typography>
						<Typography variant='body2'>{deptNm && jobGrade ? deptNm + ' / ' + jobGrade : '-'}</Typography>
						<Typography variant='body2'>{param.data ? param.data.vacationPolicyName : '-'}</Typography>
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
		{
			field: 'detail',
			headerName: '상세내역',
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

			const res: VacationDataDto[] = await vacationService.searchVacationData(req);
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
