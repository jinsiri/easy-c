'use client';

import { Box } from '@mui/material';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import CustomAgGridComp from '../../../_lib/CustomAgGridComp';
import PathBreadcrumbs from '../../../_component/PathBreadcrumbs';
import { activityLogService, ActivityLogResponseDto, ActivityLogFilter } from '../../../services/activityLogService';
import LogFilterForm, { LogFilterField, LogFilterValues } from '../_component/LogFilterForm';

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

const FILTER_FIELDS: LogFilterField[] = [
	{ key: 'loginId', label: '로그인 ID', type: 'text' },
	{ key: 'actionCode', label: '행위 코드', type: 'text' },
	{
		key: 'result',
		label: '결과',
		type: 'select',
		options: [
			{ value: 'S', label: '성공' },
			{ value: 'F', label: '실패' },
		],
	},
];

const INIT_FILTER: LogFilterValues = { loginId: '', actionCode: '', result: '', fromDate: '', toDate: '' };
const PAGE_SIZE_OPTIONS = [20, 50, 100];

export default function AdminActivityLogsPage() {
	const [rowData, setRowData] = useState<Record<string, any>[]>([]);
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(50);
	const [totalElements, setTotalElements] = useState(0);
	const [filter, setFilter] = useState<LogFilterValues>(INIT_FILTER);
	const [appliedFilter, setAppliedFilter] = useState<ActivityLogFilter>({});

	const fetchData = useCallback((p: number, size: number, f: ActivityLogFilter) => {
		activityLogService.getActivityLogs(p, size, f).then((res: any) => {
			setTotalElements(res?.totalElements ?? 0);
			setRowData(
				(res?.content ?? []).map((log: ActivityLogResponseDto) => ({
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

	useEffect(() => {
		fetchData(page, pageSize, appliedFilter);
	}, [page, pageSize, appliedFilter, fetchData]);

	const handleSearch = () => {
		const f: ActivityLogFilter = {
			loginId: filter.loginId || undefined,
			actionCode: filter.actionCode || undefined,
			result: filter.result || undefined,
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
