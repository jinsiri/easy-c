/** MUI */
import { Box, Button, Typography } from '@mui/material';

/** Ag Grid */
import { ColDef } from 'ag-grid-community';

/** Custom */
import { getAppStatusColumn, getAdminBasicDetailColumn } from '@/constant/commonColDef';
import GridMemberComp from '@/app/_component/baseElement/GridMemberComp';

export const colDefs = (onClickDetail: (data: any) => void, onClickRemove: (data: any) => void): ColDef<Record<string, any>>[] => {
	return [
		getAppStatusColumn(),
		{
			field: 'workDate',
			headerName: '수정 근무일',
			flex: 2,
			cellStyle: {
				textAlign: 'center',
			},
		},
		{
			field: 'member',
			headerName: '수정 근무자',
			flex: 2,
			cellRenderer: (param) => {
				const deptNm = param.data?.deptNm;
				const jobGrade = param.data?.jobGrade;

				return (
					<Box sx={{ py: '6px' }}>
						<GridMemberComp memberNm={param.data.memberNm} deptNm={deptNm} jobGrade={jobGrade} policyNm={param.data.attendancePolicyName} />
					</Box>
				);
			},
		},
		{
			field: 'summary',
			headerName: '수정 내용',
			flex: 2,
			cellRenderer: (param) => {
				const valueList: string[] = param?.value ? param.value.split(',') : [];
				return (
					<Box sx={{ py: '6px' }}>
						{valueList.map((item, idx) => (
							<Typography key={idx}>{item}</Typography>
						))}
					</Box>
				);
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
