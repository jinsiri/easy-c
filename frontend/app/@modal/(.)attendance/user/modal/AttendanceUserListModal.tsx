'use client';

import { useState, Dispatch, SetStateAction } from 'react';

/** MUI */
import { Box, Button, Typography } from '@mui/material';

/** Ag Grid */
import { ColDef } from 'ag-grid-community';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';

/** Custom */
import GridStatusComp from '@/app/_component/baseElement/GridStatusComp';
import GridMemberComp from '@/app/_component/baseElement/GridMemberComp';

/** Type / Interface */
import { AttendanceApplicationResponseDto } from '@/app/services/attendanceApplicationService';

export default function AttendanceUserListModal({
	setModalMode,
	modalData,
	setModalData,
}: {
	setModalMode: Dispatch<SetStateAction<string | null>>;
	modalData: AttendanceApplicationResponseDto[];
	setModalData: Dispatch<SetStateAction<any | null>>;
}) {
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
						setModalMode('detail');
					}}
				>
					<Button variant='outlined'>상세 보기</Button>
				</Box>
			),
		},
	];

	return <CustomAgGridComp rowData={modalData ?? []} colDefs={colDefs} rowSelectionMode='none' rowHeight={60} />;
}
