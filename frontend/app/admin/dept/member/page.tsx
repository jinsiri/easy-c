'use client';

/** MUI */
import {Box, Button, Grid, Stack, Typography, useTheme} from '@mui/material';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';
import {ColDef} from 'ag-grid-community';
import {Add, Remove, Reorder} from '@mui/icons-material';
import {useEffect, useState} from 'react';
import {MemberResponseDto, memberService} from "@/app/services/memberService";

const memberColDefs: ColDef<Record<string, any>>[] = [
	{ field: 'employeeId', headerName: '사번', editable: false },
	{ field: 'deptNm', headerName: '소속', editable: false },
	{ field: 'memberNm', headerName: '이름', editable: false },
	{ field: 'loginId', headerName: '로그인아이디', editable: false },
	{ field: 'positionTitle', headerName: '직위', editable: false },
	{ field: 'employmentType', headerName: '직원구분', editable: false },
	{ field: 'employmentStatus', headerName: '근무상태', editable: false },
	{ field: 'email', headerName: '사내이메일', editable: false },
	{ field: 'phoneNumber', headerName: '휴대전화', editable: false },
	{ field: 'memberRole', headerName: '권한', editable: false },
	{ field: 'accountStatus', headerName: '계정상태', editable: false },
];

export default function AdminDeptRolePage() {
	const theme = useTheme();

	const [members, setMembers] = useState<MemberResponseDto[]>([]);

	useEffect(() => {
		const fetchMembers = async () => {
			try {
				const res = await memberService.getAllMembers();
				if (res) {
					const data = Array.isArray(res) ? res : [res];
					setMembers(data);
				}
			} catch (error) {
				console.error('멤버 조회 실패:', error); // 에러 로깅
			}
		};

		fetchMembers();

	}, []);

	return (
		<>
			<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem', bgcolor: theme.palette.grey[50] }}>
				<PathBreadcrumbs />
				<Box component={'section'} sx={{ width: '100%', marginBottom: '1.5rem' }}>
					<Typography variant='h5' sx={{ fontWeight: '800' }}>
						멤버관리
					</Typography>
				</Box>

				<Grid container direction={'row'} spacing={2} sx={{ flexGrow: 1, width: '100%', p: 2 }}>
					<Grid
						size={{
							xs: 12
						}}
						sx={{ display: 'flex', flexDirection: 'column' }}
					>
						<Grid container justifyContent={'space-between'} alignItems={'center'}>
							<Grid>
								<Typography variant='h6'>직위 목록</Typography>
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
										<Button variant='outlined' size='small' startIcon={<Add />}>
											추가
										</Button>
									</Stack>
									<Stack>
										<Button variant='outlined' size='small' startIcon={<Remove />}>
											삭제
										</Button>
									</Stack>
									<Stack>
										<Button variant='outlined' size='small' startIcon={<Reorder />}>
											순서바꾸기
										</Button>
									</Stack>
								</Stack>
							</Grid>
						</Grid>
						<CustomAgGridComp rowData={members} colDefs={memberColDefs} />
					</Grid>
				</Grid>
			</Box>
		</>
	);
}
