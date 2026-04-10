'use client';

import { Box, Button, Checkbox, Grid, Stack, Typography, useTheme } from '@mui/material';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';
import { AgGridReact } from 'ag-grid-react';
import { MemberResponseDto, memberService } from '@/app/services/memberService';
import { CellClickedEvent, ColDef, FirstDataRenderedEvent, ICellRendererParams, SelectionChangedEvent } from 'ag-grid-community';
import MemberDetail from '@/app/admin/member/_component/MemberDetail';
import DropdownButton from '@/app/_component/DropdownButton';
import { useDialogStore } from '@/store/useDialogStore';
import { deptService } from '@/app/services/deptService';
import BatchJobUpdateDialog from '@/app/admin/dept/_component/BatchJobUpdateDialog';
import { RoleCategory } from '@/constant/deptConst';
import BatchReassignDeptDialog from '@/app/admin/dept/_component/BatchReassignDeptDialog';
import useRefreshStore from '@/store/useRefreshStore';

interface Props {
	deptId: number;
}

type DeptRole = 'MANAGER' | 'SUB_MANAGER' | 'MEMBER';

const deptRoleNm: Record<DeptRole, string> = {
	MANAGER: '부서장',
	SUB_MANAGER: '부부서장',
	MEMBER: '부서원',
};

export default function AdminDeptDetailView({ deptId }: Props) {
	const { alert, confirm } = useDialogStore();
	const refreshTicket = useRefreshStore((state) => state.refreshTicket);
	const theme = useTheme();
	const gridRef = useRef<AgGridReact>(null);
	const [checked, setChecked] = useState(false);
	const [selectedId, setSelectedId] = useState();
	const [checkedMemberIds, setCheckedMemberIds] = useState<number[]>([]);
	const [deptMembers, setDeptMembers] = useState<MemberResponseDto[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<RoleCategory>('POSITION');
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [openReassignModal, setOpenReassignModal] = useState(false);

	const PhotoRenderer = (params: ICellRendererParams) => {
		const photo = params.value ? params.value : '/images/blank_profile.png';
		const { memberNm, jobTitle, loginId } = params.data;
		const { deptRole } = params.data as { deptRole: DeptRole };

		return (
			<Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
				<img src={photo} alt={'프로필'} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
				<Box sx={{ '& small': { color: theme.palette.grey[600] } }}>
					<Typography>
						{deptRole && deptRole !== 'MEMBER' && (
							<Typography
								component={'span'}
								sx={{
									display: 'inline-block',
									padding: '2px 6px',
									borderRadius: '4px',
									backgroundColor: theme.palette.secondary.dark,
									fontSize: '.625rem',
									color: theme.palette.secondary.contrastText,
								}}
							>
								{deptRoleNm[deptRole]}
							</Typography>
						)}
						<Typography component={'span'} sx={{ display: 'block' }}>
							{memberNm} {jobTitle}
						</Typography>
						<small>{loginId}</small>
					</Typography>
				</Box>
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
	}, [deptId, refreshTicket]);

	const handleCellClicked = (params: CellClickedEvent) => {
		setSelectedId(params.data.memberId);
	};

	const handleFirstDataRendered = (params: FirstDataRenderedEvent) => {
		params.api.setFocusedCell(0, 'photoUrl');
	};

	const handleToggleAll = (e: ChangeEvent<HTMLInputElement>) => {
		if (!gridRef.current) return;

		setChecked(e.target.checked);
		if (e.target.checked) {
			gridRef.current.api.selectAll();
		} else {
			gridRef.current.api.deselectAll();
		}
	};

	const onSelectionChanged = (e: SelectionChangedEvent) => {
		const selectedNodes = e.api.getSelectedNodes();
		const selectedData = selectedNodes.map((node) => node.data.memberId);

		setCheckedMemberIds(selectedData);
	};

	const validateSelection = async (min = 1, max = Infinity, message = '적용할 부서원을 선택하세요.') => {
		const count = checkedMemberIds.length;

		if (count < min) {
			await alert(message);
			return false;
		}
		if (count > max) {
			await alert(`최대 ${max}명까지만 선택 가능합니다.`);
			return false;
		}
		return true;
	};

	const assignDeptRole = async (deptRole: DeptRole) => {
		if (!(await validateSelection(1, 1, '위임할 대상을 선택해 주세요.'))) return;

		if (deptRole === 'MANAGER' || deptRole === 'SUB_MANAGER') {
			const currentManager = deptMembers.find((m) => m.deptRole === deptRole);

			if (currentManager?.memberId === checkedMemberIds[0]) {
				await alert(`이미 ${deptRoleNm[deptRole]}으로 지정되어 있습니다.`);
				return;
			}

			if (currentManager && !(await confirm(`${deptRoleNm[deptRole]}이 이미 존재합니다. 바꾸시겠습니까?`))) {
				return;
			}
		}

		await deptService.assignDeptRole({
			deptId,
			memberId: checkedMemberIds[0],
			deptRole: deptRole,
		});

		await fetchMembersMappedToDeptId(deptId);
	};

	const openReassignDept = async () => {
		if (!(await validateSelection())) return;

		setOpenReassignModal(true);
	};

	const openChangeRankModal = async (category: RoleCategory) => {
		if (!(await validateSelection())) return;

		setSelectedCategory(category);
		setOpenUpdateModal(true);
	};

	const menuOptions = [
		{ label: '직위 변경', onClick: () => openChangeRankModal('POSITION') },
		{ label: '직급 변경', onClick: () => openChangeRankModal('GRADE') },
		{ label: '직무 변경', onClick: () => openChangeRankModal('ROLE') },
	];

	const assignOptions = [
		{ label: '부서장 위임', onClick: () => assignDeptRole('MANAGER') },
		{ label: '부부서장 위임', onClick: () => assignDeptRole('SUB_MANAGER') },
	];

	return (
		<>
			{openUpdateModal && (
				<BatchJobUpdateDialog
					category={selectedCategory}
					checkedIds={checkedMemberIds}
					onClose={() => setOpenUpdateModal(false)}
					reloadList={() => fetchMembersMappedToDeptId(deptId)}
				/>
			)}

			{openReassignModal && <BatchReassignDeptDialog prevDeptId={deptId} checkedIds={checkedMemberIds} onClose={() => setOpenReassignModal(false)} />}

			<Stack direction='row' spacing={1} alignItems={'center'} sx={{ py: 2 }}>
				<Checkbox
					checked={checked}
					onChange={handleToggleAll}
					slotProps={{
						input: { 'aria-label': 'controlled' },
					}}
				/>
				<DropdownButton initialLabel='일괄 변경' variant={'contained'} color={'primary'} options={menuOptions} />
				<DropdownButton initialLabel='부서장 위임' variant={'contained'} color={'primary'} options={assignOptions} />
				<Button variant='contained' size='small' onClick={openReassignDept}>
					부서 이동
				</Button>
			</Stack>
			<Grid container spacing={2} sx={{ flexGrow: 1 }}>
				{!deptMembers || deptMembers.length === 0 ? (
					<Grid justifyContent={'center'} alignItems={'center'} size={{ xs: 12 }} sx={{ display: 'flex', height: '150px' }}>
						<Typography>추가된 하위 부서원이 없습니다.</Typography>
					</Grid>
				) : (
					<>
						<Grid size={{ xs: 12, md: 4 }} sx={{ height: '500px' }}>
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
								onSelectionChanged={onSelectionChanged}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 8 }}>
							<MemberDetail selectedId={selectedId} />
						</Grid>
					</>
				)}
			</Grid>
		</>
	);
}
