'use client';

import { useEffect, useState } from 'react';
import secureLocalStorage from 'react-secure-storage';

/** Lib */
import dayjs from 'dayjs';
import useLoaderStore from '@/store/useLoaderStore';

/** MUI */
import { Box, Button, Typography, Grid } from '@mui/material';

/** Ag Grid */
import { ColDef } from 'ag-grid-community';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import VacationComp from '@/app/_component/layoutElement/VacationComp';

/** Type / Interface */
import { vacationService, VacationDataDto } from '@/app/services/vacationService';
import { vacationApplicationDto, vacationApplicationService } from '@/app/services/vacationApplicationService';
import { VACATIONTYPE } from '@/constant/attendanceConst';
import { BASICSTATUS } from '@/constant/commonConst';
import { vacationType } from '@/type/types';

const vacationTypeList = [
	{ key: 'planVacation', label: '예정 휴가' },
	{ key: 'endVacation', label: '종료 휴가' },
];

export default function VacationUserPage() {
	const { loader, setLoader } = useLoaderStore();
	const [vacationData, setVacationData] = useState<VacationDataDto>(null);
	const [planVacationList, setPlanVacationList] = useState<vacationApplicationDto[]>([]);
	const [endVacationList, setEndVacationList] = useState<vacationApplicationDto[]>([]);

	const colDefs: ColDef<Record<string, any>>[] = [
		{
			field: 'status',
			headerName: '상태',
			flex: 1,
			valueFormatter: (data) => (data.value ? BASICSTATUS[data.value] : '-'),
		},
		{
			field: 'vacationType',
			headerName: '휴가종류',
			flex: 1,
			valueFormatter: (data) => (data.value ? VACATIONTYPE[data.value as vacationType] : '-'),
		},
		{
			field: 'vacationDuration',
			headerName: '휴가일수',
			flex: 1,
		},
		{
			field: 'time',
			headerName: '휴가기간',
			flex: 3,
			cellRenderer: (param) => (
				<Box sx={{ display: 'flex', flexDirection: 'row', py: '6px' }}>
					<Typography>{param.data.startDate ? dayjs(param.data.startDate).format('YYYY-MM-DD') : '-'}</Typography>
					{param.data.endDate && (
						<>
							<Typography>~</Typography>
							<Typography>{dayjs(param.data.endDate).format('YYYY-MM-DD')}</Typography>
						</>
					)}
				</Box>
			),
		},
	];

	useEffect(() => {
		getVacationData();
		getvacationApplicationList();
	}, []);

	const getVacationData = async () => {
		if (!loader) setLoader(true);

		try {
			const encodedMemberId = btoa(String(secureLocalStorage.getItem('memberId')));
			const res = await vacationService.getVacationData(encodedMemberId);

			if (res) {
				setVacationData(res);
			}
		} catch (error: any) {
		} finally {
			setLoader(false);
		}
	};

	const getvacationApplicationList = async () => {
		if (!loader) setLoader(true);

		try {
			const encodedMemberId = btoa(String(secureLocalStorage.getItem('memberId')));
			const res = await vacationApplicationService.getUserVacationApplicationData(encodedMemberId);

			if (res) {
				setPlanVacationList(res.planVacation);
				setEndVacationList(res.endVacation);
			}
		} catch (error: any) {
		} finally {
			setLoader(false);
		}
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs />
			<Grid container spacing={4} sx={{ flexGrow: 1, flexDirection: 'column', width: '100%', height: '100%' }}>
				<Grid
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', sm: 'column', md: 'row' },
						borderRadius: '1rem',
						borderWidth: '1px',
						borderStyle: 'solid',
						borderColor: 'grey.300',
						gap: '1rem',
					}}
				>
					<Box sx={{ width: { sm: '100%', md: '50%' } }}>
						<VacationComp vacationData={vacationData} />
					</Box>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							width: { sm: '100%', md: '50%' },
							padding: '1rem 1.5rem',
							borderLeftWidth: '1px',
							borderStyle: 'solid',
							borderColor: 'grey.300',
							gap: '1rem',
						}}
					></Box>
				</Grid>
				<Grid sx={{ display: 'flex', flexDirection: { lg: 'row', md: 'column', sm: 'column', xs: 'column' }, gap: '1rem' }}>
					{vacationTypeList.map((item) => (
						<Box
							key={item.key}
							sx={{
								width: { lg: `calc(100% / ${vacationTypeList.length})`, md: '100%', sm: '100%', xs: '100%' },
								backgroundColor: 'grey.50',
								border: '1px solid',
								borderColor: 'grey.200',
								borderRadius: '1rem',
							}}
						>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0.625rem 1rem 1.5rem' }}>
								<Typography variant='subtitle1'>{item.label}</Typography>
								<Button>더보기</Button>
							</Box>
							<Box sx={{ height: '15rem', pb: '1rem', borderRadius: '1rem', backgroundColor: '#fff' }}>
								<CustomAgGridComp
									rowData={item.key === 'planVacation' ? planVacationList : endVacationList}
									colDefs={colDefs}
									rowSelectionMode='none'
								/>
							</Box>
						</Box>
					))}
				</Grid>
			</Grid>
		</Box>
	);
}
