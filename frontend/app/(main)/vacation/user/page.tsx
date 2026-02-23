'use client';

/** MUI */
import { Box, Button, Typography, Grid, useTheme } from '@mui/material';

/** Ag Grid */
import { ColDef } from 'ag-grid-community';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';
import useLoaderStore from '@/store/useLoaderStore';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import VacationComp from '@/app/_component/layoutElement/VacationComp';

const vacationTypeList = [
	{ key: 'planVacation', label: '예정 휴가' },
	{ key: 'endVacation', label: '종료 휴가' },
];

export default function VacationUserPage() {
	const theme = useTheme();

	const colDefs: ColDef<Record<string, any>>[] = [
		{ field: 'workDate', headerName: '휴가상태', flex: 1 },
		{
			field: 'workType',
			headerName: '휴가종류',
			flex: 1,
		},
		{
			field: 'workStatus',
			headerName: '휴가일수',
			flex: 1,
		},
		{
			field: 'time',
			headerName: '휴가기간',
			flex: 3,
		},
	];

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
						<VacationComp />
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
								<CustomAgGridComp rowData={[]} colDefs={colDefs} rowSelectionMode='none' rowHeight={80} />
							</Box>
						</Box>
					))}
				</Grid>
			</Grid>
		</Box>
	);
}
