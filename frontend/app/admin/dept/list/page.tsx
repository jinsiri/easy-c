'use client';

/** MUI */
import { Box, Button, Grid, IconButton, List, ListItem, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import SettingLayoutElement from '@/app/_component/layoutElement/SettingLayoutElement';
import { AddCircleOutline, Edit, RemoveCircleOutline, Search } from '@mui/icons-material';
import { useCallback, useMemo, useState } from 'react';
import CommonTabs from '@/app/_component/CommonTabs';
import MyTreeView from '@/app/_component/Tree';

const dummyDept = {
	deptId: 1,
	deptNm: '데모',
	deptShortNm: '부서 약어',
	email: 'test@gmail.com',
	deptLevel: 1,
	deptOrder: 1,
	upperDeptNo: 1,
	lowerDeptCount: 1,
	deptMngCode: 'c014',
	deptSortCode: '001',
};

type InfoItem = {
	label: string;
	value: React.ReactNode;
};

const departmentDummyData = [
	// 1단계: 본부
	{ id: 100, upperNo: null, label: '경영지원본부', sortOrder: 1 },
	{ id: 200, upperNo: null, label: '기술연구소', sortOrder: 2 },

	// 2단계: 경영지원본부 산하 부서
	{ id: 110, upperNo: 100, label: '인사팀', sortOrder: 1 },
	{ id: 120, upperNo: 100, label: '재무팀', sortOrder: 2 },

	// 3단계: 인사팀 소속 직원 (직원을 부서의 자식으로 처리)
	{ id: 111, upperNo: 110, label: '김철수 팀장', sortOrder: 1 },
	{ id: 112, upperNo: 110, label: '이영희 대리', sortOrder: 2 },

	// 2단계: 기술연구소 산하 부서
	{ id: 210, upperNo: 200, label: '백엔드개발팀', sortOrder: 1 },
	{ id: 220, upperNo: 200, label: '프론트엔드개발팀', sortOrder: 2 },

	// 3단계: 백엔드개발팀 소속 직원
	{ id: 211, upperNo: 210, label: '박디비 과장', sortOrder: 1 },
	{ id: 212, upperNo: 210, label: '최서버 사원', sortOrder: 2 },

	// 3단계: 프론트엔드개발팀 소속 직원
	{ id: 221, upperNo: 220, label: '정리액트 팀장', sortOrder: 1 },
	{ id: 222, upperNo: 220, label: '조넥스트 사원', sortOrder: 2 },
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
						{ label: '부서메일아이디', value: dummyDept.email },
						{ label: '부서코드', value: dummyDept.deptMngCode },
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
					<Grid size={3} sx={{ display: 'flex', flexDirection: 'column' }}>
						<SettingLayoutElement
							subtitle='조직도'
							boxColor={'#fff'}
							btnGroup={
								<Stack direction={'row'} spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
									<Stack direction={'row'} spacing={1} sx={{ alignItems: 'center' }}>
										<IconButton className='contained-primary light'>
											<AddCircleOutline className='svg-small' />
										</IconButton>
										<IconButton className='contained-primary light'>
											<RemoveCircleOutline className='svg-small' />
										</IconButton>
									</Stack>
									<Stack>
										<IconButton className='contained-primary'>
											<Search className='svg-small' />
										</IconButton>
									</Stack>
								</Stack>
							}
						>
							<Box>
								<MyTreeView dbData={departmentDummyData} />
							</Box>
						</SettingLayoutElement>
					</Grid>
					<Grid size={9} sx={{ display: 'flex', flexDirection: 'column' }}>
						<SettingLayoutElement subtitle={dummyDept.deptNm} boxColor={'#fff'}>
							<Stack alignItems={'flex-end'}>
								<Stack direction={'row'} spacing={1}>
									<Button variant='outlined'>부서원 추가</Button>
									<Button variant='outlined'>일괄 등록</Button>
								</Stack>
							</Stack>
							<CommonTabs tabs={deptTabs} />
						</SettingLayoutElement>
					</Grid>
				</Grid>
			</Box>
		</>
	);
}
