'use client';

/** MUI */
import { Box, Button, Grid, Stack, Typography, useTheme } from '@mui/material';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';
import { CellDoubleClickedEvent, ColDef } from 'ag-grid-community';
import { Add, Remove, Reorder } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { MemberResponseDto, memberService } from '@/app/services/memberService';
import { AgGridReact } from 'ag-grid-react';
import { useDialogStore } from '@/store/useDialogStore';
import { useRouter } from 'next/navigation';
import { memberColDefs } from '@/type/ colDef';

export default function AdminDeptRolePage() {
	const theme = useTheme();
	const router = useRouter();

	const { alert } = useDialogStore();

	const gridRef = useRef<AgGridReact>(null);
	const [members, setMembers] = useState<MemberResponseDto[]>([]);

	useEffect(() => {
		fetchMembers();
	}, []);

	const fetchMembers = async () => {
		await memberService
			.getAllMembers()
			.then((res) => {
				const data = Array.isArray(res) ? res : [res];
				setMembers(data);
			})
			.catch((error) => {
				if (error.status === 403) {
					alert('인증 정보가 유효하지 않습니다.');
				} else {
					alert(error.message);
				}
				console.error('멤버 조회 실패:', error); // 에러 로깅
			});
	};

	const deleteMembers = async () => {
		const selectedRows = gridRef.current?.api.getSelectedRows() || [];
		selectedRows.forEach((row: any) => console.log(row));
		const memberIds = selectedRows.map((row: any) => row.memberId);

		await memberService
			.deleteMembers({
				ids: memberIds,
			})
			.then((res) => {
				alert('삭제되었습니다.');
				fetchMembers();
			})
			.catch((error) => {
				if (error.status === 403) {
					alert('인증 정보가 유효하지 않습니다.');
				} else {
					alert(error.message);
				}
				console.error('멤버 삭제 실패:', error); // 에러 로깅
			});
	};

	const handleCellDoubleClicked = (e: CellDoubleClickedEvent) => {
		const memberId = (e.data as any)?.memberId;
		if (!memberId) return;

		router.push(`/admin/member/detail?memberId=${memberId}`);
	};

	return (
		<>
			<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem', bgcolor: theme.palette.grey[50] }}>
				<PathBreadcrumbs />
				<Grid container direction={'row'} spacing={2} sx={{ flexGrow: 1, width: '100%' }}>
					<Grid
						size={{
							xs: 12,
						}}
						sx={{ display: 'flex', flexDirection: 'column' }}
					>
						<Grid container justifyContent={'space-between'} alignItems={'center'}>
							<Grid>
								<Typography variant='h6'>회원 목록</Typography>
							</Grid>
							<Grid>
								<Stack
									direction='row'
									spacing={1}
									justifyContent='flex-end'
									sx={{
										mb: '.875rem',
										'& .MuiButton-startIcon svg': {
											fill: theme.palette.primary.main,
										},
									}}
								>
									<Stack>
										<Button variant='outlined' size='small' startIcon={<Add />} onClick={() => router.push('/admin/member/new')}>
											추가
										</Button>
									</Stack>
									<Stack>
										<Button variant='outlined' size='small' startIcon={<Remove />} onClick={deleteMembers}>
											삭제
										</Button>
									</Stack>
								</Stack>
							</Grid>
						</Grid>
						<CustomAgGridComp
							ref={gridRef}
							rowData={members}
							colDefs={memberColDefs}
							rowSelectionMode={'multiple'}
							onCellDoubleClicked={handleCellDoubleClicked}
						/>
					</Grid>
				</Grid>
			</Box>
		</>
	);
}
