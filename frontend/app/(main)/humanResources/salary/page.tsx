'use client';

/** MUI */
import { Box, Typography, Grid, List, ListItem, useTheme } from '@mui/material';

/** Custom */
import PathBreadcrumbs from '../../../_component/PathBreadcrumbs';

const dummyInfo = {
	'직원 이름': '김호두',
	사원번호: '250514-1',
	'부서/직책': '연구개발팀/팀원',
	직위: '사원',
	직무: '개발',
	입사일: '20250514',
	대표전화: '000-0000-0000',
	휴대전화: '010-0000-0000',
	이메일: 'hodu@easy_c.com',
	외부이메일: 'hodu@naver.com',
	근무상태: 'hodu@naver.com',
};

export default function HumanResourceUserPage() {
	const theme = useTheme();

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs />
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					padding: '1rem',
					borderRadius: '1rem',
					border: `1px solid ${theme.palette.primary.main}`,
				}}
			>
				{/** 이미지 */}
				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '15%', minWidth: '9rem' }}>
					<Box sx={{ width: '6rem', height: '6rem', borderRadius: '1rem', backgroundColor: theme.palette.grey[500] }}></Box>
				</Box>
				{/** 기본설정 */}
				<Box sx={{ width: 'calc(80% - 1rem)', marginLeft: '1rem' }}>
					<List sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', width: '100%' }}>
						{Object.entries(dummyInfo).map(([key, value]) => {
							return (
								<ListItem
									key={key}
									sx={{
										flexBasis: '33.33%',
										minWidth: '14rem',
										whiteSpace: 'nowrap',
										padding: '0.5rem',
									}}
								>
									<Box sx={{ width: '6rem', textWrap: 'nowrap', color: theme.palette.grey[700] }}>{key}</Box>
									<Box sx={{ width: 'calc(100% - 6rem)', textWrap: 'nowrap' }}>{value}</Box>
								</ListItem>
							);
						})}
					</List>
				</Box>
			</Box>
		</Box>
	);
}
