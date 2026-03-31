/** MUI */
import { Button } from '@mui/material';

/** Ag Grid */
import { ColDef } from 'ag-grid-community';

/** Lib */
import dayjs from 'dayjs';

/** Custom */
import { getAppStatusColumn, getAdminBasicDetailColumn } from '@/constant/commonColDef';

/** Type / Interface */
import { transactionType, vacationCategory, vacationType } from '@/type/types';
import { VACATIONTYPE } from '@/constant/attendanceConst';
import { VACATIONCATEGORY, TRANSACTIONTYPE } from '@/constant/vacationConst';

export const colDefs = (onClickDetail: (data: any) => void, onClickRemove: (data: any) => void): ColDef<Record<string, any>>[] => {
	return [
		getAppStatusColumn(),
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
		getAdminBasicDetailColumn(onClickDetail),
		{
			field: 'remove',
			headerName: '신청취소',
			cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
			cellRenderer: (params: any) => {
				return (
					<Button
						variant='contained'
						color='error'
						size='small'
						disabled={params.data.status !== 'PENDING'}
						onClick={() => onClickRemove(params.data)}
					>
						신청 취소
					</Button>
				);
			},
		},
	];
};

export const historyColDefs = (): ColDef<Record<string, any>>[] => {
	return [
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
			cellStyle: { textAlign: 'center' },
			valueFormatter: (param) => (param.value ? param.value + '일' : '-'),
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
			field: 'violationReason',
			headerName: '상세',
			flex: 3,
		},
	];
};
