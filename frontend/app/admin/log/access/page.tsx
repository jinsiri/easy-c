'use client';

import { Box } from '@mui/material';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import CustomAgGridComp from '../../../_lib/CustomAgGridComp';
import PathBreadcrumbs from '../../../_component/PathBreadcrumbs';
import { accessLogService, AccessLogResponseDto, AccessLogFilter } from '../../../services/accessLogService';
import LogFilterForm, { LogFilterField, LogFilterValues } from '../_component/LogFilterForm';

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

const FILTER_FIELDS: LogFilterField[] = [
	{ key: 'loginId', label: '로그인 ID', type: 'text' },
	{
		key: 'method',
		label: 'HTTP 메서드',
		type: 'select',
		options: [
			{ value: 'GET', label: 'GET' },
			{ value: 'POST', label: 'POST' },
			{ value: 'PUT', label: 'PUT' },
			{ value: 'DELETE', label: 'DELETE' },
		],
	},
	{ key: 'uri', label: 'URI', type: 'text' },
	{ key: 'status', label: '상태코드', type: 'text' },
	{
		key: 'deviceType',
		label: '기기',
		type: 'select',
		options: [
			{ value: 'DESKTOP', label: 'Desktop' },
			{ value: 'MOBILE', label: 'Mobile' },
			{ value: 'UNKNOWN', label: 'Unknown' },
		],
	},
];

const INIT_FILTER: LogFilterValues = { loginId: '', method: '', uri: '', status: '', deviceType: '', fromDate: '', toDate: '' };
const PAGE_SIZE_OPTIONS = [20, 50, 100];

export default function AdminAccessLogsPage() {
	const [rowData, setRowData] = useState<Record<string, any>[]>([]);
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(50);
	const [totalElements, setTotalElements] = useState(0);
	const [filter, setFilter] = useState<LogFilterValues>(INIT_FILTER);
	const [appliedFilter, setAppliedFilter] = useState<AccessLogFilter>({});

	const fetchData = useCallback((p: number, size: number, f: AccessLogFilter) => {
		accessLogService.getAccessLogs(p, size, f).then((res: any) => {
			setTotalElements(res?.totalElements ?? 0);
			setRowData(
				(res?.content ?? []).map((log: AccessLogResponseDto) => ({
					...log,
					loginId: log.loginId ?? '-',
					memberNm: log.memberNm ?? '-',
					memberRole: log.memberRole ?? '-',
					queryString: log.queryString ?? '-',
				})),
			);
		});
	}, []);

	useEffect(() => {
		fetchData(page, pageSize, appliedFilter);
	}, [page, pageSize, appliedFilter, fetchData]);

	const handleSearch = () => {
		const f: AccessLogFilter = {
			loginId: filter.loginId || undefined,
			method: filter.method || undefined,
			uri: filter.uri || undefined,
			status: filter.status || undefined,
			deviceType: filter.deviceType || undefined,
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
