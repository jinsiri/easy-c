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
import { securityLogService, SecurityLogResponseDto } from '../../../services/securityLogService';

const EVENT_TYPE_LABEL: Record<string, { label: string; color: string }> = {
	LOGIN_SUCCESS: { label: '로그인 성공', color: '#2e7d32' },
	LOGIN_FAILURE: { label: '로그인 실패', color: '#c62828' },
	ACCESS_DENIED: { label: '접근 거부', color: '#e65100' },
};

const colDefs: ColDef<Record<string, any>>[] = [
	{
		field: 'registerDate',
		headerName: '발생 시각',
		minWidth: 180,
		valueFormatter: (params: ValueFormatterParams) =>
			params.value ? dayjs(params.value).format('YYYY-MM-DD HH:mm:ss') : '-',
	},
	{
		field: 'eventType',
		headerName: '이벤트',
		minWidth: 130,
		cellRenderer: (params: any) => {
			const info = EVENT_TYPE_LABEL[params.value] ?? { label: params.value, color: '#555' };
			return <span style={{ color: info.color, fontWeight: 600 }}>{info.label}</span>;
		},
	},
	{ field: 'loginId', headerName: '로그인 ID', minWidth: 130 },
	{ field: 'ip', headerName: 'IP', minWidth: 140 },
	{ field: 'deviceType', headerName: '기기', minWidth: 90 },
	{ field: 'uri', headerName: 'URI', minWidth: 200 },
	{ field: 'detail', headerName: '상세', minWidth: 250, flex: 1 },
];

const PAGE_SIZE_OPTIONS = [20, 50, 100];

export default function AdminSecurityLogsPage() {
	const [rowData, setRowData] = useState<Record<string, any>[]>([]);
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(50);
	const [totalElements, setTotalElements] = useState(0);

	useEffect(() => {
		securityLogService.getSecurityLogs(page, pageSize).then((res: any) => {
			setTotalElements(res?.totalElements ?? 0);
			const data = res?.content ?? [];
			setRowData(
				data.map((log: SecurityLogResponseDto) => ({
					...log,
					loginId: log.loginId ?? '-',
					uri: log.uri ?? '-',
					detail: log.detail ?? '-',
				})),
			);
		});
	}, [page, pageSize]);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs />
			<Box sx={{ flexGrow: 1, width: '100%', minHeight: 0 }}>
				<CustomAgGridComp
					rowData={rowData}
					colDefs={colDefs}
					serverPagination={{
						page,
						pageSize,
						totalElements,
						pageSizeOptions: PAGE_SIZE_OPTIONS,
						onPageChange: setPage,
						onPageSizeChange: setPageSize,
					}}
				/>
			</Box>
		</Box>
	);
}
