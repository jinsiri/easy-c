'use client';

/** MUI */
import { Box } from '@mui/material';

/** Ag Grid */
import { ColDef, ValueFormatterParams } from 'ag-grid-community';

/** React */
import { useEffect, useState } from 'react';

/** Lib */
import dayjs from 'dayjs';
import CustomAgGridComp from '../../../_lib/CustomAgGridComp';

/** Components */
import PathBreadcrumbs from '../../../_component/PathBreadcrumbs';

/** Services */
import { activityLogService, ActivityLogResponseDto } from '../../../services/activityLogService';

const colDefs: ColDef<Record<string, any>>[] = [
	{
		field: 'registerDate',
		headerName: '발생 시각',
		minWidth: 180,
		valueFormatter: (params: ValueFormatterParams) =>
			params.value ? dayjs(params.value).format('YYYY-MM-DD HH:mm:ss') : '-',
	},
	{ field: 'loginId', headerName: '로그인 ID', minWidth: 120 },
	{ field: 'memberNm', headerName: '이름', minWidth: 100 },
	{ field: 'actionName', headerName: '행위', minWidth: 140 },
	{ field: 'actionCode', headerName: '코드', minWidth: 140 },
	{ field: 'targetType', headerName: '대상 유형', minWidth: 100 },
	{ field: 'targetId', headerName: '대상 ID', minWidth: 90 },
	{ field: 'status', headerName: '상태코드', minWidth: 100 },
	{ field: 'ip', headerName: 'IP', minWidth: 140 },
	{
		field: 'result',
		headerName: '결과',
		minWidth: 80,
		cellRenderer: (params: any) => (
			<span style={{ color: params.value === 'S' ? '#2e7d32' : '#c62828', fontWeight: 600 }}>
				{params.value === 'S' ? '성공' : '실패'}
			</span>
		),
	},
	{ field: 'message', headerName: '메시지', minWidth: 200, flex: 1 },
];

export default function AdminActivityLogsPage() {
	const [rowData, setRowData] = useState<Record<string, any>[]>([]);

	useEffect(() => {
		activityLogService.getActivityLogs().then((res) => {
			const data = (res as any)?.content ?? res ?? [];
			setRowData(
				data.map((log: ActivityLogResponseDto) => ({
					...log,
					loginId: log.loginId ?? '-',
					memberNm: log.memberNm ?? '-',
					targetType: log.targetType || '-',
					targetId: log.targetId ?? '-',
					message: log.message ?? '-',
				})),
			);
		});
	}, []);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs />
			<Box sx={{ flexGrow: 1, width: '100%' }}>
				<CustomAgGridComp rowData={rowData} colDefs={colDefs} pagination={true} />
			</Box>
		</Box>
	);
}
