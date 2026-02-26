'use client';

import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';
import { useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { MemberResponseDto, memberService } from '@/app/services/memberService';
import { memberColDefs } from '@/type/ colDef';
import { Box } from '@mui/material';
import { useSearchParams } from 'next/navigation';

export default function AssignForm(props: {}) {
	const searchParams = useSearchParams();
	const deptIdStr = searchParams.get('deptId');
	const deptId = deptIdStr ? parseInt(deptIdStr) : null;
	const gridRef = useRef<AgGridReact>(null);
	const [unassignedMembers, setUnassignedMembers] = useState<MemberResponseDto[]>([]);

	const fetchUnassignedMembers = async () => {
		if (deptId === null) {
			console.error('기준 부서가 없습니다.');
			return;
		}

		const res = await memberService.getMembersNotMappedToDeptId(deptId);
		setUnassignedMembers(res);
	};

	useEffect(() => {
		fetchUnassignedMembers();
	}, []);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '70vh', padding: '0 1.5rem' }}>
			<CustomAgGridComp ref={gridRef} rowData={unassignedMembers} colDefs={memberColDefs} rowSelectionMode={'multiple'} />
		</Box>
	);
}
