'use client';

/** MUI */
import { Box, Typography, Button, Grid, List, ListItem } from '@mui/material';

/** Custom */
import PathBreadcrumbs from '../../../_component/PathBreadcrumbs';
import SettingLayoutElement from '../../../_component/layoutElement/SettingLayoutElement';

const profilList = [{ name: '사이트 프로필 관리' }, { name: '설정 항목' }];

const fileList = [{ name: '첨부파일 용량 제한' }, { name: '첨부파일 개수 제한' }, { name: '업로드 불가 파일' }];

export default function AdminNormalUserPage() {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs>
				<Button variant='contained'>설정 저장</Button>
			</PathBreadcrumbs>
			<Grid container spacing={4} sx={{ flexGrow: 1, width: '100%', height: '100%' }}>
				<Grid size={6} sx={{ display: 'flex', flexDirection: 'column' }}>
					<SettingLayoutElement subtitle='사용자 프로필 관리'>
						<List>
							{profilList.map((item: Record<string, any>, idx: number) => {
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
					<SettingLayoutElement subtitle='첨부파일 용량 제한'>
						<List>
							{fileList.map((item: Record<string, any>, idx: number) => {
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
