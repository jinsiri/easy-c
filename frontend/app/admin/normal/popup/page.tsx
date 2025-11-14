'use client';

/** MUI */
import { Box, Typography, Button, Grid, List, ListItem } from '@mui/material';

/** Custom */
import PathBreadcrumbs from '../../../_component/PathBreadcrumbs';
import SettingLayoutElement from '../../../_component/layoutElement/SettingLayoutElement';

const normalList = [
	{ name: '사이트 명' },
	{ name: '사이트 URL' },
	{ name: '도메인 명' },
	{ name: '담당자' },
	{ name: '사이트 아이디' },
	{ name: '도입 일자' },
	{ name: '총 계정 수' },
	{ name: '설정 계정' },
	{ name: '총 할당용량' },
	{ name: '공용 용량' },
	{ name: '사용기간' },
];

const logoList = [{ name: '로고 설정' }, { name: '파비콘 설정' }];

export default function AdminNormalSettingPage() {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs />
			<Box component={'section'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '1.5rem' }}>
				<Typography variant='h5' sx={{ fontWeight: '800' }}>
					팝업 공지 설정
				</Typography>
				<Button variant='contained'>설정 저장</Button>
			</Box>
			<Grid container spacing={4} sx={{ flexGrow: 1, width: '100%', height: '100%' }}>
				<Grid size={6} sx={{ display: 'flex', flexDirection: 'column' }}>
					<SettingLayoutElement subtitle='서비스 정보'>
						<List>
							{normalList.map((item: Record<string, any>, idx: number) => {
								return (
									<ListItem key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
										<Box sx={{ fontSize: '15px', fontWeight: '600' }}>{item.name}</Box>
										<Box></Box>
									</ListItem>
								);
							})}
						</List>
					</SettingLayoutElement>
				</Grid>
				<Grid size={6} sx={{ display: 'flex', flexDirection: 'column' }}>
					<SettingLayoutElement subtitle='로고 및 테마'>
						<List>
							{logoList.map((item: Record<string, any>, idx: number) => {
								return (
									<ListItem key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
										<Box sx={{ fontSize: '15px', fontWeight: '600' }}>{item.name}</Box>
										<Box></Box>
									</ListItem>
								);
							})}
						</List>
					</SettingLayoutElement>
				</Grid>
			</Grid>
		</Box>
	);
}
