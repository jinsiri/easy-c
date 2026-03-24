/** Ag Grid */
import { ColDef } from 'ag-grid-community';

/** Lib */
import dayjs from 'dayjs';

/** Custom */
import GridStatusComp from '@/app/_component/baseElement/GridStatusComp';
import GridMemberComp from '@/app/_component/baseElement/GridMemberComp';
import GridDetailButtonComp from '@/app/_component/baseElement/GridDetailButtonComp';
import GridActionButtonComp from '@/app/_component/baseElement/GridActionButtonComp';

export const adminBasicColDef: ColDef<Record<string, any>>[] = [
	{
		field: 'status',
		headerName: '상태',
		cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
		cellRenderer: (params: any) => (params.value ? <GridStatusComp status={params.value} /> : '-'),
	},
	{
		field: 'member',
		headerName: '근무자',
		cellStyle: { display: 'flex', alignItems: 'center' },
		cellRenderer: (params: any) => {
			const { deptNm, jobGrade, memberNm, vacationPolicyName } = params.data || {};
			return <GridMemberComp memberNm={memberNm} deptNm={deptNm} jobGrade={jobGrade} policyNm={vacationPolicyName} />;
		},
	},
	{
		field: 'registerDate',
		headerName: '신청일',
		valueFormatter: (param) => (param.value ? dayjs(param.value).format('YYYY-MM-DD') : '-'),
	},
];

export const getAdminBasicDetailColumn = (onClickDetail: (data: any) => void): ColDef => ({
	field: 'detail',
	headerName: '상세',
	cellRenderer: GridDetailButtonComp,
	cellRendererParams: { onClickDetail },
});

export const getAdminBasicActionColumn = (onClickAction: (data: any) => void): ColDef => ({
	field: 'action',
	headerName: '처리',
	cellRenderer: (params) => {
		if (params.data.status !== 'PENDING') return null;
		return <GridActionButtonComp {...params} />;
	},
	cellRendererParams: { onClickAction },
});
