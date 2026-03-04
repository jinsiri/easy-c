'use client';

import { Box, Button, Checkbox, Grid, Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';
import { AgGridReact } from 'ag-grid-react';
import { MemberResponseDto, memberService } from '@/app/services/memberService';
import { ColDef, ICellRendererParams } from 'ag-grid-community';

interface Props {
	deptId: number;
}

export default function AdminDeptDetailView({ deptId = 1 }: Props) {
	const theme = useTheme();
	const gridRef = useRef<AgGridReact>(null);
	const [checked, setChecked] = useState(false);
	const [deptMembers, setDeptMembers] = useState<MemberResponseDto[]>([]);
	const PhotoRenderer = (params: ICellRendererParams) => {
		const photo = params.value ? params.value : '/images/blank_profile.png';
		const name = params.data.memberNm;
		const jobTitle = params.data.jobTitle;
		const loginId = params.data.loginId;

		return (
			<Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
				<img src={photo} alt={'프로필'} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
				<Typography sx={{ display: 'flex', flexDirection: 'column', '& small': { color: theme.palette.grey[600] } }}>
					<span>
						{name} {jobTitle}
					</span>
					<small style={{}}>{loginId}</small>
				</Typography>
			</Box>
		);
	};

	const deptMemberColDefs: ColDef<Record<string, any>>[] = [
		{
			headerName: '프로필',
			field: 'photoUrl',
			cellRenderer: PhotoRenderer,
			cellStyle: { display: 'flex', alignItems: 'center' },
		},
	];

	const fetchMembersMappedToDeptId = async (deptId: number) => {
		if (deptId === null) {
			console.error('기준 부서가 없습니다.');
			return;
		}

		const res = await memberService.getMembersMappedToDeptId(deptId);
		setDeptMembers(res);
	};

	useEffect(() => {
		fetchMembersMappedToDeptId(deptId);
	}, [deptId]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(event.target.checked);
	};

	const handleCellDoubleClicked = () => {
		console.log('double clicked!');
	};

	return (
		<>
			<Stack direction='row' spacing={1} alignItems={'center'} sx={{ py: 2 }}>
				<Checkbox
					checked={checked}
					onChange={handleChange}
					slotProps={{
						input: { 'aria-label': 'controlled' },
					}}
				/>
				<Button variant='contained' size='small'>
					직위 변경
				</Button>
				<Button variant='contained' size='small'>
					부서장 위임
				</Button>
				<Button variant='contained' size='small'>
					부서 이동
				</Button>
			</Stack>
			<Grid container spacing={2} sx={{ flexGrow: 1 }}>
				<Grid size={{ xs: 12, md: 4 }} sx={{ height: '100%' }}>
					<CustomAgGridComp
						ref={gridRef}
						rowData={deptMembers}
						colDefs={deptMemberColDefs}
						headerHeight={0}
						rowHeight={80}
						pagination={false}
						rowSelectionMode={'multiple'}
						onCellDoubleClicked={handleCellDoubleClicked}
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 8 }}>test2</Grid>
			</Grid>
		</>
	);
}
