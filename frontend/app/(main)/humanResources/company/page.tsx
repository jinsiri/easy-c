'use client';

/** MUI */
import { Box, useTheme } from '@mui/material';

/** Ag Grid */
import { ColDef } from 'ag-grid-community';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';

/** Custom */
import PathBreadcrumbs from '../../../_component/PathBreadcrumbs';

const _colDefs: ColDef<Record<string, any>>[] = [
	{ field: '사번', headerName: '사번' },
	{ field: '소속', headerName: '소속' },
	{ field: '이름', headerName: '이름' },
	{ field: '직위', headerName: '직위' },
	{ field: '이메일', headerName: '이메일' },
	{ field: '내선번호', headerName: '내선번호' },
];

const _rowData: Record<string, any>[] = [
	{
		사번: '202501015',
		소속: '경영지원본부',
		이름: '박지호',
		직위: '사원',
		이메일: 'lsk0112@easy_c.com',
		내선번호: '070-0000-0000',
	},
	{
		사번: '202501060',
		소속: '경영지원본부',
		이름: '김윤경',
		직위: '차장',
		이메일: 'kyk88@easy_c.com',
		내선번호: '070-1200-0000',
	},
];

export default function HumanResourceCompanyPage() {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
			<Box sx={{ padding: '0 1.5rem' }}>
				<PathBreadcrumbs />
			</Box>
			<Box sx={{ flexGrow: 1, width: '100%', height: '100%' }}>
				<CustomAgGridComp rowData={_rowData} colDefs={_colDefs} />
			</Box>
		</Box>
	);
}
