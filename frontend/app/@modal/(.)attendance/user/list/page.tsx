'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** MUI */
import { Box, Button, Typography } from '@mui/material';

/** Ag Grid */
import { ColDef } from 'ag-grid-community';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';

/** Lib */
import useModalStore from '@/store/useModalStore';
import useLoaderStore from '@/store/useLoaderStore';

/** Custom */
import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import GridStatusComp from '@/app/_component/baseElement/GridStatusComp';
import GridMemberComp from '@/app/_component/baseElement/GridMemberComp';

/** Type / Interface */
import { WORKSTATUS } from '@/constant/attendanceConst';

export default function AttendanceUserModal() {
	const router = useRouter();
	const { setLoader } = useLoaderStore();
	const { modalData, setModalData, resetModalData } = useModalStore();

	const [isSaving, setIsSaving] = useState(false);

	const colDefs: ColDef<Record<string, any>>[] = [
		{
			field: 'status',
			headerName: '상태',
			flex: 1,
			cellRenderer: (data) => (
				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
					{data.value ? <GridStatusComp status={data.value} /> : '-'}
				</Box>
			),
		},
		{
			field: 'member',
			headerName: '수정 근무자',
			flex: 1,
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
		{
			field: 'detail',
			headerName: '상세',
			cellRenderer: (param) => (
				<Box
					sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', py: '6px' }}
					onClick={(e) => {
						const _sendData = {
							...param.data,
							list: modalData,
						};
						setModalData(_sendData);
						router.push('/attendance/user/modal?type=detail');
					}}
				>
					<Button variant='outlined'>상세 보기</Button>
				</Box>
			),
		},
	];

	return (
		<BaseDialog title={'근무시간 수정'} loading={isSaving}>
			<Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '30rem', height: '20rem' }}>
				<CustomAgGridComp rowData={modalData ?? []} colDefs={colDefs} rowSelectionMode='none' rowHeight={60} />
			</Box>
		</BaseDialog>
	);
}
