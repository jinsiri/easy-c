'use client';

/** MUI */
import { Box, Typography, Button, TextField } from '@mui/material';

/** Ag Grid */
import { ColDef } from 'ag-grid-community';

/** Custom */
import PathBreadcrumbs from '../../../_component/PathBreadcrumbs';
import AggridComponent from '@/app/_component/AggridComponent';

const rowData: Record<string, any>[] = [
	{ make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
	{ make: 'Ford', model: 'F-Series', price: 33850, electric: false },
	{ make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
];

const colDefs: ColDef<Record<string, any>>[] = [
	{ field: 'make', headerName: '제조사' },
	{ field: 'model', headerName: '모델명' },
	{ field: 'price', headerName: '가격', type: 'numericColumn' },
	{ field: 'electric', headerName: '전기차 여부' },
];

export default function AdminNormalBackupPage() {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs />
			<Box component={'section'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '1.5rem' }}>
				<Typography variant='h5' sx={{ fontWeight: '800' }}>
					데이터 백업 관리
				</Typography>
				<TextField id='outlined-basic' variant='outlined' placeholder='제목을 입력해주세요' />
			</Box>
			<Box sx={{ mb: '1rem' }}>
				<Button variant='contained'>백업 신청</Button>
			</Box>
			<Box sx={{ flexGrow: 1, width: '100%', minHeight: '20rem' }}>
				<AggridComponent rowData={rowData} colDefs={colDefs} />
			</Box>
		</Box>
	);
}
