import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';
import { useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { MemberResponseDto, memberService } from '@/app/services/memberService';
import { memberColDefs } from '@/type/ colDef';
import { Box } from '@mui/material';

export default function AssignForm(props: {}) {
	const gridRef = useRef<AgGridReact>(null);
	const [unassignedMembers, setUnassignedMembers] = useState<MemberResponseDto[]>([]);

	const fetchUnassignedMembers = async () => {
		await memberService.getMembersNotMappedToDeptId(1);
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
