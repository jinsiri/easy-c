/** Ag Grid */
import { ColDef } from 'ag-grid-community';

/** Lib */
import dayjs from 'dayjs';

/** Custom */
import GridStatusComp from '@/app/_component/baseElement/GridStatusComp';
import GridMemberComp from '@/app/_component/baseElement/GridMemberComp';
import GridDetailButtonComp from '@/app/_component/baseElement/GridDetailButtonComp';
import GridActionButtonComp from '@/app/_component/baseElement/GridActionButtonComp';

export const getAppStatusColumn = (): ColDef => ({
	field: 'status',
	headerName: '상태',
	minWidth: 90,
	flex: 1,
	cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
	cellRenderer: (params: any) => (params.value ? <GridStatusComp status={params.value} /> : '-'),
});

export const getMemberColumn = (type?: null | 'update'): ColDef => ({
	field: 'member',
	headerName: `${type && type === 'update' ? '수정 근무자' : '근무자'}`,
	minWidth: 150,
	flex: 2,
	cellStyle: { padding: '0.25rem 0' },
	cellRenderer: (params: any) => {
		const { deptNm, jobGrade, memberNm, vacationPolicyName } = params.data || {};
		return <GridMemberComp memberNm={memberNm} deptNm={deptNm} jobGrade={jobGrade} policyNm={vacationPolicyName} />;
	},
});

export const getAdminBasicDetailColumn = (onClickDetail: (data: any) => void): ColDef => ({
	field: 'detail',
	headerName: '상세',
	minWidth: 100,
	flex: 1,
	cellRenderer: GridDetailButtonComp,
	cellRendererParams: { onClickDetail },
});

export const getAdminBasicActionColumn = (onClickAction: (data: any) => void): ColDef => ({
	field: 'action',
	headerName: '처리',
	minWidth: 200,
	flex: 2,
	cellRenderer: (params) => {
		if (params.data.status !== 'PENDING') return null;
		return <GridActionButtonComp {...params} />;
	},
	cellRendererParams: { onClickAction },
});

export const adminBasicColDef: ColDef<Record<string, any>>[] = [
	getAppStatusColumn(),
	getMemberColumn(),
	{
		field: 'registerDate',
		headerName: '신청일',
		minWidth: 120,
		flex: 1,
		cellStyle: { textAlign: 'center' },
		valueFormatter: (param) => (param.value ? dayjs(param.value).format('YYYY-MM-DD') : '-'),
	},
];
