/** Ag Grid */
import { ColDef } from 'ag-grid-community';

/** Lib */
import dayjs from 'dayjs';

/** Mui */
import { Box, Typography } from '@mui/material';

/** Custom */
import GridStatusComp from '@/app/_component/baseElement/GridStatusComp';

/** Type / Interface */
import { transactionType, vacationCategory, vacationType } from '@/type/types';
import { VACATIONTYPE } from '@/constant/attendanceConst';
import { VACATIONCATEGORY, TRANSACTIONTYPE } from '@/constant/vacationConst';

export const colDefs: ColDef<Record<string, any>>[] = [
	{
		field: 'status',
		headerName: '상태',
		cellStyle: {
			display: 'flex',
			justifyContents: 'center',
			alignItems: 'center',
		},
		cellRenderer: (data) => {
			return data.value ? <GridStatusComp status={data.value} /> : '-';
		},
	},
	{
		field: 'registerDate',
		headerName: '휴가신청일',
		valueFormatter: (param) => (param.value ? dayjs(param.value).format('YYYY-MM-DD') : '-'),
	},
	{
		field: 'vacationType',
		headerName: '휴가 종류',
		valueFormatter: (data) => (data.value ? VACATIONTYPE[data.value as vacationType] : '-'),
	},
	{
		field: 'vacationDuration',
		headerName: '휴가일',
	},
	{
		field: 'time',
		headerName: '휴가기간',
		flex: 3,
		valueFormatter: (param) => {
			const start = param.data?.startDate ? dayjs(param.data.startDate).format('YYYY-MM-DD') : '-';
			const end = param.data?.endDate ? ` ~ ${dayjs(param.data.endDate).format('YYYY-MM-DD')}` : '';
			return start + end;
		},
	},
];

export const historyColDefs: ColDef<Record<string, any>>[] = [
	{
		field: 'transactionType',
		headerName: '휴가 관리 상태',
		flex: 1,
		cellStyle: { textAlign: 'center' },
		valueFormatter: (param) => (param.value ? TRANSACTIONTYPE[param.value as transactionType] : '-'),
	},
	{
		field: 'vacationCategory',
		headerName: '휴가 카테고리',
		flex: 1,
		cellStyle: { textAlign: 'center' },
		valueFormatter: (param) => (param.value ? VACATIONCATEGORY[param.value as vacationCategory] : '-'),
	},
	{
		field: 'day',
		headerName: '휴가일',
		flex: 1,
	},
	{
		field: 'accrualDate',
		headerName: '휴가 지급일',
		flex: 1,
		valueFormatter: (param) => (param.value ? dayjs(param.value).format('YYYY-MM-DD') : '-'),
	},
	{
		field: 'expireDate',
		headerName: '휴가 만료일',
		flex: 1,
		valueFormatter: (param) => (param.value ? dayjs(param.value).format('YYYY-MM-DD') : '-'),
	},
	{
		field: 'vacationDesc',
		headerName: '상세',
		flex: 3,
	},
];
