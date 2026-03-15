'use client';

/** MUI */
import { Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

import secureLocalStorage from 'react-secure-storage';

/** Ag Grid */
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';
import dayjs from 'dayjs';

/** Custom */
import PathBreadcrumbs from '../../../_component/PathBreadcrumbs';

const colDefs: ColDef<Record<string, any>>[] = [
	{ field: 'id', headerName: '번호', minWidth: 80, maxWidth: 100 },
	{ field: 'title', headerName: '제목', minWidth: 200, flex: 1 },
	{ field: 'registerUser.memberNm', headerName: '작성자', minWidth: 100, maxWidth: 120 },
	{
		field: 'registerDate',
		headerName: '작성일',
		minWidth: 130,
		valueFormatter: (params: ValueFormatterParams) =>
			params.value ? dayjs(params.value).format('YYYY-MM-DD') : '-',
	},
	{ field: 'viewCount', headerName: '조회수', minWidth: 90, maxWidth: 100 },
];

interface Props {
	category: 'NOTICE' | 'GENERAL';
	rowData: Record<string, any>[];
}

export default function BoardListPage({ category, rowData }: Props) {
	const router = useRouter();
	const isAdmin = secureLocalStorage.getItem('memberRole') === 'ROLE_ADMIN';
	const canWrite = category === 'GENERAL' || isAdmin;

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs>
				{canWrite && (
					<Button variant="contained" size="small" onClick={() => router.push(`/board/write?category=${category}`)}>등록</Button>
				)}
			</PathBreadcrumbs>
			<Box sx={{ flexGrow: 1, width: '100%', minHeight: 0 }}>
				<CustomAgGridComp
					rowData={rowData}
					colDefs={colDefs}
					onRowClicked={(e) => router.push(`/board/${e.data.id}`)}
				/>
			</Box>
		</Box>
	);
}
