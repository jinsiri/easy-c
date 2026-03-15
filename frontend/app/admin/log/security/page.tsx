'use client';

import { Box } from '@mui/material';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import CustomAgGridComp from '../../../_lib/CustomAgGridComp';
import PathBreadcrumbs from '../../../_component/PathBreadcrumbs';
import { securityLogService, SecurityLogResponseDto, SecurityLogFilter } from '../../../services/securityLogService';
import LogFilterForm, { LogFilterField, LogFilterValues } from '../_component/LogFilterForm';

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

const FILTER_FIELDS: LogFilterField[] = [
	{ key: 'loginId', label: '로그인 ID', type: 'text' },
	{
		key: 'eventType',
		label: '이벤트',
		type: 'select',
		options: [
			{ value: 'LOGIN_SUCCESS', label: '로그인 성공' },
			{ value: 'LOGIN_FAILURE', label: '로그인 실패' },
			{ value: 'ACCESS_DENIED', label: '접근 거부' },
		],
	},
	{ key: 'ip', label: 'IP', type: 'text' },
];

const INIT_FILTER: LogFilterValues = { loginId: '', eventType: '', ip: '', fromDate: '', toDate: '' };
const PAGE_SIZE_OPTIONS = [20, 50, 100];

export default function AdminSecurityLogsPage() {
	const [rowData, setRowData] = useState<Record<string, any>[]>([]);
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(50);
	const [totalElements, setTotalElements] = useState(0);
	const [filter, setFilter] = useState<LogFilterValues>(INIT_FILTER);
	const [appliedFilter, setAppliedFilter] = useState<SecurityLogFilter>({});

	const fetchData = useCallback((p: number, size: number, f: SecurityLogFilter) => {
		securityLogService.getSecurityLogs(p, size, f).then((res: any) => {
			setTotalElements(res?.totalElements ?? 0);
			setRowData(
				(res?.content ?? []).map((log: SecurityLogResponseDto) => ({
					...log,
					loginId: log.loginId ?? '-',
					uri: log.uri ?? '-',
					detail: log.detail ?? '-',
				})),
			);
		});
	}, []);

	useEffect(() => {
		fetchData(page, pageSize, appliedFilter);
	}, [page, pageSize, appliedFilter, fetchData]);

	const handleSearch = () => {
		const f: SecurityLogFilter = {
			loginId: filter.loginId || undefined,
			eventType: filter.eventType || undefined,
			ip: filter.ip || undefined,
			fromDate: filter.fromDate || undefined,
			toDate: filter.toDate || undefined,
		};
		setAppliedFilter(f);
		setPage(0);
	};

	const handleReset = () => {
		setFilter(INIT_FILTER);
		setAppliedFilter({});
		setPage(0);
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs />
			<LogFilterForm
				fields={FILTER_FIELDS}
				values={filter}
				onChange={setFilter}
				onSearch={handleSearch}
				onReset={handleReset}
			/>
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
						onPageSizeChange: (s) => { setPageSize(s); setPage(0); },
					}}
				/>
			</Box>
		</Box>
	);
}
