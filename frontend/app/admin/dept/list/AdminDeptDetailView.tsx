'use client';

import { Box, Button, Checkbox, Grid, Stack, Typography, useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';
import { AgGridReact } from 'ag-grid-react';
import { MemberResponseDto, memberService } from '@/app/services/memberService';
import { CellClickedEvent, ColDef, FirstDataRenderedEvent, ICellRendererParams } from 'ag-grid-community';
import MemberDetail from '@/app/admin/member/_component/MemberDetail';
import { useRouter } from 'next/navigation';
import DropdownButton from '@/app/_component/DropdownButton';

interface Props {
	deptId: number;
}

export default function AdminDeptDetailView({ deptId = 1 }: Props) {
	const router = useRouter();
	const theme = useTheme();
	const gridRef = useRef<AgGridReact>(null);
	const [checked, setChecked] = useState(false);
	const [selectedId, setSelectedId] = useState();
	const [deptMembers, setDeptMembers] = useState<MemberResponseDto[]>([]);

	const PhotoRenderer = (params: ICellRendererParams) => {
		const photo = params.value ? params.value : '/images/blank_profile.png';
		const { memberNm, jobTitle, loginId } = params.data;

		return (
			<Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
				<img src={photo} alt={'프로필'} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
				<Typography sx={{ display: 'flex', flexDirection: 'column', '& small': { color: theme.palette.grey[600] } }}>
					<span>
						{memberNm} {jobTitle}
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

		if (res && res.length > 0) {
			setSelectedId(res[0].memberId);
		} else {
			setSelectedId(undefined);
		}
	};

	useEffect(() => {
		fetchMembersMappedToDeptId(deptId);
	}, [deptId]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(event.target.checked);
	};

	const handleCellClicked = (params: CellClickedEvent) => {
		setSelectedId(params.data.memberId);
	};

	const handleFirstDataRendered = (params: FirstDataRenderedEvent) => {
		params.api.setFocusedCell(0, 'photoUrl');
	};

	const menuOptions = [
		{ label: '직위 변경', onClick: () => console.log('직위 변경 클릭') },
		{ label: '직급 변경', onClick: () => console.log('직급 변경 클릭') },
	];

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
				<DropdownButton initialLabel='일괄 변경' variant={'contained'} color={'primary'} options={menuOptions} />
				<Button variant='contained' size='small'>
					부서장 위임
				</Button>
				<Button variant='contained' size='small'>
					부서 이동
				</Button>
			</Stack>
			<Grid container spacing={2} sx={{ flexGrow: 1 }}>
				<Grid size={{ xs: 12, md: deptMembers?.length !== 0 ? 4 : 12 }} sx={{ height: '100%' }}>
					<CustomAgGridComp
						ref={gridRef}
						rowData={deptMembers}
						colDefs={deptMemberColDefs}
						headerHeight={0}
						rowHeight={80}
						pagination={false}
						rowSelectionMode={'multiple'}
						onFirstDataRendered={handleFirstDataRendered}
						onCellClicked={handleCellClicked}
					/>
				</Grid>
				{selectedId && (
					<Grid size={{ xs: 12, md: 8 }}>
						<MemberDetail selectedId={selectedId} />
					</Grid>
				)}
			</Grid>
		</>
	);
}
