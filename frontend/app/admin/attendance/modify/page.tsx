'use client';

import { useEffect, useState } from 'react';

/** MUI */
import { Box } from '@mui/material';

/** Ag Grid */
import { ColDef } from 'ag-grid-community';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import GridInnerButton from '@/app/_component/GridInnerButton';

/** Type / Interface */
import { attendanceChangeRequestService } from '@/app/services/attendanceChangeRequestService';

export default function AttendanceModifyPage() {
	const [rowData, setRowData] = useState<Record<string, any>[]>([]);

	const colDefs: ColDef<Record<string, any>>[] = [
		{ field: 'status', headerName: '상태' },
		{ field: 'memberNm', headerName: '근무자' },
		{ field: 'workDate', headerName: '수정 근무일' },
		{ field: 'type', headerName: '수정 타입' },
		{ field: 'summary', headerName: '요약' },
		{ field: 'registerDate', headerName: '신청일' },
		{ field: 'lastUpdateDate', headerName: '처리일' },
		{ field: 'confirm', headerName: '상세', cellRenderer: GridInnerButton, minWidth: 160 },
	];

	useEffect(() => {
		getWorkRequestData();
	}, []);

	const getWorkRequestData = async () => {
		try {
			const res = await attendanceChangeRequestService.getWorkRequestData();
			setRowData(res.data);

			console.log(res);
		} catch (error: any) {
		} finally {
		}
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
			<Box sx={{ padding: '0 1.5rem' }}>
				<PathBreadcrumbs />
			</Box>
			<Box sx={{ flexDirection: 'column', flexGrow: 1 }}>
				<CustomAgGridComp rowData={rowData} colDefs={colDefs} rowSelect='single' />
			</Box>
		</Box>
	);
}
