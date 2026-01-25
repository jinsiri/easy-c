'use client';

import { Box, Typography, Grid, Stack, IconButton, Button, useTheme, List, ListItem } from '@mui/material';
import { AddCircleOutline, Edit, RemoveCircleOutline } from '@mui/icons-material';
import { DeptResponseDto } from '@/type/dept';
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import CommonTabs from '@/app/_component/CommonTabs';
import CommonTreeview from '@/app/_component/Tree';
import { useRouter } from 'next/navigation';

interface Props {
	dbData: DeptResponseDto[];
}

type InfoItem = {
	label: string;
	value: React.ReactNode;
};

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

const mapDeptToTree = (dept: DeptResponseDto) => ({
	...dept,
	id: dept.deptId,
	label: dept.deptNm,
});

export default function AdminDeptListView({ dbData }: Props) {
	const router = useRouter();
	const theme = useTheme();

	const dummyDept = {
		deptNm: dbData?.[0]?.deptNm || '부서 선택 안됨',
		deptEmail: dbData?.[0]?.deptEmail || '-',
		deptCode: dbData?.[0]?.deptCode || '-',
		deptShortNm: dbData?.[0]?.deptShortNm || '-',
	};

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
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				height: '100%',
				padding: '0 1.5rem',
				bgcolor: theme.palette.grey[50],
			}}
		>
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
							<IconButton className='contained-primary light' onClick={() => router.push('/admin/dept/list/add')}>
								<AddCircleOutline className='svg-small' />
							</IconButton>
							<IconButton className='contained-primary light'>
								<RemoveCircleOutline className='svg-small' />
							</IconButton>
						</Stack>
					</Box>

					<Box sx={{ flexGrow: 1, padding: '1.125rem', borderRadius: '1rem', bgcolor: '#fff' }}>
						<CommonTreeview
							rawData={dbData || []}
							mapEntityToTree={mapDeptToTree}
							placeholder='부서명을 검색하세요.'
							onNodeClick={(node) => {
								console.log('선택된 부서의 코드:', node.label); // 원본 필드 접근 가능
							}}
						/>
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
						<Stack alignItems={'flex-end'} sx={{ mb: 2 }}>
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
	);
}
