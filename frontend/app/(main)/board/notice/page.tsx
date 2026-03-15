'use client';

import { useEffect, useState } from 'react';
import { boardPostService } from '../../../services/boardPostService';
import BoardListPage from '../_component/BoardListPage';

export default function BoardNoticePage() {
	const [rowData, setRowData] = useState<Record<string, any>[]>([]);

	useEffect(() => {
		boardPostService.findAllNotice().then((res: any) => setRowData(res ?? []));
	}, []);

	return <BoardListPage category="NOTICE" rowData={rowData} />;
}
