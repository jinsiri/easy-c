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
import { accessLogService, AccessLogResponseDto } from '../../../services/accessLogService';

const colDefs: ColDef<Record<string, any>>[] = [
	{
		field: 'registerDate',
		headerName: '접근 시각',
		minWidth: 180,
		valueFormatter: (params: ValueFormatterParams) =>
			params.value ? dayjs(params.value).format('YYYY-MM-DD HH:mm:ss') : '-',
	},
	{ field: 'loginId', headerName: '로그인 ID', minWidth: 120 },
	{ field: 'memberNm', headerName: '이름', minWidth: 100 },
	{ field: 'memberRole', headerName: '역할', minWidth: 100 },
	{ field: 'method', headerName: '메서드', minWidth: 90 },
	{ field: 'uri', headerName: 'URI', minWidth: 200, flex: 1 },
	{ field: 'status', headerName: '상태', minWidth: 80 },
	{ field: 'ip', headerName: 'IP', minWidth: 140 },
	{ field: 'deviceType', headerName: '기기', minWidth: 90 },
	{
		field: 'success',
		headerName: '결과',
		minWidth: 80,
		cellRenderer: (params: any) => (
			<span style={{ color: params.value ? '#2e7d32' : '#c62828', fontWeight: 600 }}>
				{params.value ? '성공' : '실패'}
			</span>
		),
	},
];

export default function AdminAccessLogsPage() {
	const [rowData, setRowData] = useState<Record<string, any>[]>([]);

	useEffect(() => {
		accessLogService.getAccessLogs().then((res) => {
			const data = (res as any)?.content ?? res ?? [];
			setRowData(
				data.map((log: AccessLogResponseDto) => ({
					...log,
					loginId: log.loginId ?? '-',
					memberNm: log.memberNm ?? '-',
					memberRole: log.memberRole ?? '-',
					queryString: log.queryString ?? '-',
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
