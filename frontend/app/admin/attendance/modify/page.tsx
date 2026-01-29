/** MUI */
import { Box } from '@mui/material';

/** Ag Grid */
import { ColDef } from 'ag-grid-community';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import GridInnerButton from '@/app/_component/GridInnerButton';

export default function AttendanceModifyPage() {
	const rowData: Record<string, any>[] = [
		{ workDate: '2026-01-26', name: '김호두', startTime: '2026-01-26T08:50:00', endTime: '2026-01-26T18:00:01', workStatus: '일반' },
	];

	const colDefs: ColDef<Record<string, any>>[] = [
		{ field: 'workDate', headerName: '근무일' },
		{ field: 'name', headerName: '근무자' },
		{ field: 'startTime', headerName: '출근시간' },
		{ field: 'endTime', headerName: '퇴근시간' },
		{ field: 'workStatus', headerName: '근로 상태' },
		{ field: 'modify', headerName: '', cellRenderer: GridInnerButton, minWidth: 160 },
	];
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs />
			<Box sx={{ flexDirection: 'column', flexGrow: 1 }}>
				<CustomAgGridComp rowData={rowData} colDefs={colDefs} rowSelect='single' />
			</Box>
		</Box>
	);
}
