'use client';

/** MUI */
import { Box, Button, Grid, IconButton, List, ListItem, Stack, Typography, useTheme } from '@mui/material';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import CommonTabs from '@/app/_component/CommonTabs';
import CommonTreeview from '@/app/_component/Tree';
import { AddCircleOutline, Edit, RemoveCircleOutline } from '@mui/icons-material';

const dummyDept = {
	deptId: 1,
	deptNm: '데모',
	deptShortNm: '부서 약어',
	deptCode: 'c014',
	deptEmail: 'test@gmail.com',
	treeLevel: 1,
	treeSiblingOrder: 1,
	treeParentId: 1,
	treeChildCount: 1,
	treeSortCode: '001',
};

type InfoItem = {
	label: string;
	value: React.ReactNode;
};

const departmentDummyData = [
	// 1단계: 본부
	{ id: 100, treeParentId: null, label: '경영지원본부', treeSiblingOrder: 1 },
	{ id: 200, treeParentId: null, label: '기술연구소', treeSiblingOrder: 2 },

	// 2단계: 경영지원본부 산하 부서
	{ id: 110, treeParentId: 100, label: '인사팀', treeSiblingOrder: 1 },
	{ id: 120, treeParentId: 100, label: '재무팀', treeSiblingOrder: 2 },

	// 3단계: 인사팀 소속 직원 (직원을 부서의 자식으로 처리)
	{ id: 111, treeParentId: 110, label: '김철수 팀장', treeSiblingOrder: 1 },
	{ id: 112, treeParentId: 110, label: '이영희 대리', treeSiblingOrder: 2 },

	// 2단계: 기술연구소 산하 부서
	{ id: 210, treeParentId: 200, label: '백엔드개발팀', treeSiblingOrder: 1 },
	{ id: 220, treeParentId: 200, label: '프론트엔드개발팀', treeSiblingOrder: 2 },

	// 3단계: 백엔드개발팀 소속 직원
	{ id: 211, treeParentId: 210, label: '박디비 과장', treeSiblingOrder: 1 },
	{ id: 212, treeParentId: 210, label: '최서버 사원', treeSiblingOrder: 2 },

	// 3단계: 프론트엔드개발팀 소속 직원
	{ id: 221, treeParentId: 220, label: '정리액트 팀장', treeSiblingOrder: 1 },
	{ id: 222, treeParentId: 220, label: '조넥스트 사원', treeSiblingOrder: 2 },
];

function InfoList({ items }: { items: InfoItem[] }) {
	return (
		<List disablePadding>
			{items.map(({ label, value }) => (
				<ListItem key={label} disableGutters disablePadding>
					<Stack direction='row' spacing={2} alignItems='center' width='100%'>
						<Typography variant='body2' color='text.primary' sx={{ minWidth: 216 }}>
							{label}
						</Typography>

						<Typography variant='body2'>
							{value}
							<IconButton sx={{ ml: 1 }}>
								<Edit fontSize={'small'} />
							</IconButton>
						</Typography>
					</Stack>
				</ListItem>
			))}
		</List>
	);
}

export default function AdminDeptListPage() {
	const theme = useTheme();

	const deptTabs = [
		{
			label: '부서 정보',
			content: (
				<InfoList
					items={[
						{ label: '부서명(한글)', value: dummyDept.deptNm },
						{ label: '부서메일아이디', value: dummyDept.deptEmail },
						{ label: '부서코드', value: dummyDept.deptCode },
						{ label: '부서 약어', value: dummyDept.deptShortNm },
					]}
				/>
			),
		},
		{ label: '부서원 목록', content: <>부서원 목록</> },
	];

	return (
		<>
			<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem', bgcolor: theme.palette.grey[50] }}>
				<PathBreadcrumbs />
				<Box component={'section'} sx={{ width: '100%', marginBottom: '1.5rem' }}>
					<Typography variant='h5' sx={{ fontWeight: '800' }}>
						조직설계
					</Typography>
				</Box>
				<Grid container spacing={3} sx={{ flexGrow: 1, width: '100%', height: '100%' }}>
					<Grid
						size={{
							xs: 12,
							md: 4,
							lg: 3,
						}}
						sx={{ display: 'flex', flexDirection: 'column' }}
					>
						<Box sx={{ display: 'flex', alignItems: 'center', mb: '1rem' }}>
							<Typography sx={{ mr: '1.5rem', fontSize: '1.125rem', fontWeight: 'bold' }}>조직도</Typography>
							<Box sx={{ flexGrow: 1, height: '1px', bgcolor: theme.palette.grey[300] }} />
						</Box>
						<Box sx={{ mb: 1 }}>
							<Stack direction={'row'} spacing={1} sx={{ alignItems: 'center' }}>
								<IconButton className='contained-primary light'>
									<AddCircleOutline className='svg-small' />
								</IconButton>
								<IconButton className='contained-primary light'>
									<RemoveCircleOutline className='svg-small' />
								</IconButton>
							</Stack>
						</Box>
						<Box sx={{ flexGrow: 1, padding: '1.125rem', borderRadius: '1rem', bgcolor: '#fff' }}>
							<Box>
								<CommonTreeview dbData={departmentDummyData} />
							</Box>
						</Box>
					</Grid>
					<Grid
						size={{
							xs: 12,
							md: 8,
							lg: 9,
						}}
						sx={{ display: 'flex', flexDirection: 'column' }}
					>
						<Box sx={{ display: 'flex', alignItems: 'center', mb: '1rem' }}>
							<Typography sx={{ mr: '1.5rem', fontSize: '1.125rem', fontWeight: 'bold' }}>{dummyDept.deptNm}</Typography>
							<Box sx={{ flexGrow: 1, height: '1px', bgcolor: theme.palette.grey[300] }} />
						</Box>
						<Box sx={{ flexGrow: 1, padding: '1.125rem', borderRadius: '1rem', bgcolor: '#fff' }}>
							<Stack alignItems={'flex-end'}>
								<Stack direction={'row'} spacing={1}>
									<Button variant='outlined'>부서원 추가</Button>
									<Button variant='outlined'>일괄 등록</Button>
								</Stack>
							</Stack>
							<CommonTabs tabs={deptTabs} />
						</Box>
					</Grid>
				</Grid>
			</Box>
		</>
	);
}
