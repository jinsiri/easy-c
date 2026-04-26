'use client';

import { useRouter } from 'next/navigation';
import secureLocalStorage from 'react-secure-storage';

/** Lib */
import dayjs from 'dayjs';
import { Box, Button } from '@mui/material';

/** Ag Grid */
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';

/** Custom */
import PathBreadcrumbs from '../../../_component/PathBreadcrumbs';
import { ServerPaginationConfig } from '@/app/_lib/AgStylePagination';
import LogFilterForm, { LogFilterField, LogFilterValues } from '@/app/admin/log/_component/LogFilterForm';

const colDefs: ColDef<Record<string, any>>[] = [
	{
		field: 'idx',
		headerName: 'No',
		minWidth: 60,
		maxWidth: 60,
		cellStyle: { 'text-align': 'center' },
		valueGetter: (params) => {
			const pageSize = params.api.paginationGetPageSize();
			const currentPage = params.api.paginationGetCurrentPage();
			const total = params.api.getDisplayedRowCount();
			const index = params.node?.rowIndex;

			if (index == null) return '';

			return total - (currentPage * pageSize + index);
		},
	},
	{ field: 'title', headerName: '제목', minWidth: 200, flex: 1 },
	{ field: 'registerUser.memberNm', headerName: '작성자', minWidth: 100, maxWidth: 120 },
	{
		field: 'registerDate',
		headerName: '작성일',
		minWidth: 130,
		valueFormatter: (params: ValueFormatterParams) => (params.value ? dayjs(params.value).format('YYYY-MM-DD') : '-'),
	},
	{ field: 'viewCount', headerName: '조회수', minWidth: 90, maxWidth: 100 },
];

const FILTER_FIELDS: LogFilterField[] = [
	{ key: 'title', label: '제목', type: 'text' },
	{ key: 'content', label: '내용', type: 'text' },
	{ key: 'author', label: '작성자', type: 'text' },
];

const INIT_FILTER: LogFilterValues = { title: '', content: '', author: '', fromDate: '', toDate: '' };

interface Props {
	category: 'NOTICE' | 'GENERAL';
	rowData: Record<string, any>[];
	serverPagination: ServerPaginationConfig;
	filter: LogFilterValues;
	onFilterChange: (v: LogFilterValues) => void;
	onSearch: () => void;
	onReset: () => void;
}

export default function BoardListPage({ category, rowData, serverPagination, filter, onFilterChange, onSearch, onReset }: Props) {
	const router = useRouter();
	const isAdmin = secureLocalStorage.getItem('memberRole') === 'ROLE_ADMIN';
	const canWrite = category === 'GENERAL' || isAdmin;

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
			<Box sx={{ padding: '0 1.5rem' }}>
				<PathBreadcrumbs>
					{canWrite && (
						<Button variant='contained' size='small' onClick={() => router.push(`/board/write?category=${category}`)}>
							등록
						</Button>
					)}
				</PathBreadcrumbs>
				<LogFilterForm fields={FILTER_FIELDS} values={filter} onChange={onFilterChange} onSearch={onSearch} onReset={onReset} showDateRange={false} />
			</Box>

			<Box sx={{ flexGrow: 1, width: '100%', minHeight: 0 }}>
				<CustomAgGridComp
					rowData={rowData}
					colDefs={colDefs}
					onRowClicked={(e) => router.push(`/board/${e.data.id}`)}
					serverPagination={serverPagination}
				/>
			</Box>
		</Box>
	);
}

export { INIT_FILTER };
