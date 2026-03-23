'use client';

import { useCallback, useEffect, useState } from 'react';
import { boardPostService, BoardPostFilter } from '../../../services/boardPostService';
import BoardListPage, { INIT_FILTER } from '../_component/BoardListPage';
import { LogFilterValues } from '@/app/admin/log/_component/LogFilterForm';

const PAGE_SIZE_OPTIONS = [20, 50, 100];

export default function BoardGeneralPage() {
	const [rowData, setRowData] = useState<Record<string, any>[]>([]);
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(20);
	const [totalElements, setTotalElements] = useState(0);
	const [filter, setFilter] = useState<LogFilterValues>(INIT_FILTER);
	const [appliedFilter, setAppliedFilter] = useState<BoardPostFilter>({});

	const fetchData = useCallback(() => {
		boardPostService.findAllGeneral(page, pageSize, appliedFilter).then((res: any) => {
			setRowData(res?.content ?? []);
			setTotalElements(res?.totalElements ?? 0);
		});
	}, [page, pageSize, appliedFilter]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleSearch = () => {
		setAppliedFilter({ title: filter.title || undefined, content: filter.content || undefined, author: filter.author || undefined });
		setPage(0);
	};

	const handleReset = () => {
		setFilter(INIT_FILTER);
		setAppliedFilter({});
		setPage(0);
	};

	return (
		<BoardListPage
			category="GENERAL"
			rowData={rowData}
			serverPagination={{
				page,
				pageSize,
				totalElements,
				pageSizeOptions: PAGE_SIZE_OPTIONS,
				onPageChange: setPage,
				onPageSizeChange: (size) => { setPageSize(size); setPage(0); },
			}}
			filter={filter}
			onFilterChange={setFilter}
			onSearch={handleSearch}
			onReset={handleReset}
		/>
	);
}
