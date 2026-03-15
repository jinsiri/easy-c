'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/** MUI */
import { Box } from '@mui/material';

/** Ag Grid */
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';
import { ColDef } from 'ag-grid-community';

/** Lib */
import useModalStore from '@/store/useModalStore';

/** Custom */
import BaseDialog from '@/app/_component/baseElement/BaseDialog';

/** Type & Interface */
import { attendancePolicyService, AttendancePolicyMappingRequestDto } from '@/app/services/attendancePolicyService';

const memberColDefs: ColDef<Record<string, any>>[] = [
	{ field: 'employeeId', headerName: '사번', editable: false },
	{ field: 'displayDeptInfo', headerName: '부서-직책', editable: false },
	{ field: 'memberNm', headerName: '이름', editable: false },
	{ field: 'employmentType', headerName: '직원구분', editable: false },
	{ field: 'employmentStatus', headerName: '근무상태', editable: false },
	{ field: 'attendancePolicyName', headerName: '정책명', editable: false },
];

export default function AttendancePolicyModal() {
	const router = useRouter();
	const { modalData, resetModalData } = useModalStore();

	const gridRef = useRef();

	const [members, setMembers] = useState<Record<string, any>[]>([]);

	useEffect(() => {
		fetchMembers();
	}, []);

	useEffect(() => {
		if (gridRef.current && modalData) {
			gridRef.current.api.forEachNode((node) => {
				if (node.data.attendancePolicyId === modalData.policyId) {
					node.setSelected(true);
				}
			});
		}
	}, [members]);

	const fetchMembers = async () => {
		await attendancePolicyService.getPolicyMemberData().then((res) => {
			setMembers(res);
		});
	};

	const handleSave = async () => {
		if (modalData && gridRef.current) {
			const selectedRows = gridRef.current.api.getSelectedRows();
			const req: AttendancePolicyMappingRequestDto = {
				policyId: modalData.policyId,
				memberIdList: selectedRows.map((item) => item.memberId),
			};

			await attendancePolicyService.savePolicyMemberMapping(req);
			if (confirm('근로자가 성공적으로 적용되었습니다.')) {
				resetModalData();
				router.refresh();
				router.back();
			}
		}
	};

	const onClose = () => {
		resetModalData();
		router.back();
	};

	return (
		<BaseDialog title={'근로자 목록'} onConfirm={handleSave} onClose={onClose} maxWidth={'lg'} className='none-padding'>
			<Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '50rem', height: '20rem' }}>
				<CustomAgGridComp ref={gridRef} rowData={members} colDefs={memberColDefs} rowSelectionMode={'multiple'} />
			</Box>
		</BaseDialog>
	);
}
