'use client';

import { useEffect, useState } from 'react';
import { boardPostService } from '../../../services/boardPostService';
import BoardListPage from '../_component/BoardListPage';

export default function BoardGeneralPage() {
	const [rowData, setRowData] = useState<Record<string, any>[]>([]);

	useEffect(() => {
		boardPostService.findAllGeneral().then((res: any) => setRowData(res ?? []));
	}, []);

	return <BoardListPage category="GENERAL" rowData={rowData} />;
}
