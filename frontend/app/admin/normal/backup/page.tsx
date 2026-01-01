'use client';

/** MUI */
import { Box, Button, TextField } from '@mui/material';

/** Ag Grid */
import { ColDef } from 'ag-grid-community';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';

/** Custom */
import PathBreadcrumbs from '../../../_component/PathBreadcrumbs';

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
			<PathBreadcrumbs>
				<TextField id='outlined-basic' variant='outlined' placeholder='제목을 입력해주세요' />
			</PathBreadcrumbs>
			<Box sx={{ mb: '1rem' }}>
				<Button variant='contained'>백업 신청</Button>
			</Box>
			<Box sx={{ flexGrow: 1, width: '100%', minHeight: '20rem' }}>
				<CustomAgGridComp rowData={rowData} colDefs={colDefs} />
			</Box>
		</Box>
	);
}
