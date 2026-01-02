'use client';

/** MUI */
import { Box, Button, Grid, IconButton, List, ListItem, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import SettingLayoutElement from '@/app/_component/layoutElement/SettingLayoutElement';
import { AddCircleOutline, Edit, RemoveCircleOutline, Search } from '@mui/icons-material';
import { useCallback, useMemo, useState } from 'react';

const tabList = ['부서 정보', '부서원 목록'];

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

export default function AdminOrgListPage() {
	const theme = useTheme();
	const [targetTab, setTargetTab] = useState<number>(0);

	const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
		setTargetTab(newValue);
	}, []);

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
							<Box>조직도</Box>
						</SettingLayoutElement>
					</Grid>
					<Grid size={9} sx={{ display: 'flex', flexDirection: 'column' }}>
						<SettingLayoutElement subtitle='부서 정보' boxColor={'#fff'}>
							<Stack alignItems={'flex-end'}>
								<Stack direction={'row'} spacing={1}>
									<Button variant='outlined'>부서원 추가</Button>
									<Button variant='outlined'>일괄 등록</Button>
								</Stack>
							</Stack>
							<Box
								sx={{
									'&>div': { padding: 0 },
								}}
							>
								<Tabs value={targetTab} onChange={handleTabChange} aria-label='basic tabs example' sx={{ flexShrink: 0, padding: '0 1.5rem' }}>
									{tabList.map((item: string, idx: number) => {
										return <Tab id={`simple-tab-${idx}`} aria-controls={`simple-tabpanel-${idx}`} key={idx} label={item} />;
									})}
								</Tabs>
							</Box>
							<Box
								sx={{
									overflow: targetTab === 2 ? 'auto' : 'inherit',
									display: 'flex',
									flexDirection: 'column',
									flexGrow: 1,
									marginTop: '-1px',
									padding: targetTab <= 1 ? '1rem 1.125rem' : '',
									borderTop: `1px solid ${theme.palette.divider}`,
								}}
							>
								{targetTab === 0 && (
									<>
										<InfoList
											items={[
												{ label: '부서명(한글)', value: dummyDept.deptNm },
												{ label: '부서메일아이디', value: dummyDept.email },
												{ label: '부서코드', value: dummyDept.deptMngCode },
												{ label: '부서 약어', value: dummyDept.deptShortNm },
											]}
										/>
									</>
								)}
							</Box>
						</SettingLayoutElement>
					</Grid>
				</Grid>
			</Box>
		</>
	);
}
