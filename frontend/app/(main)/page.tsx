'use client';

/** MUI */
import { Box, Grid, Typography, useTheme } from '@mui/material';

/** Custom */
export default function Home() {
	const theme = useTheme();

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

	return (
		<Grid container sx={{ display: 'flex', flexDirection: 'column', padding: '1rem 1.5rem' }}>
			<Grid sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
				<Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							width: '60%',
							borderRadius: '1rem',
							padding: '1rem',
							backgroundColor: theme.palette.grey[50],
						}}
					>
						<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '8rem' }}>
							<Box sx={{ width: '6rem', height: '6rem', borderRadius: '1rem', backgroundColor: theme.palette.grey[500] }}></Box>
						</Box>
						<Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '0.5rem' }}>
							<Box sx={{ display: 'flex', alignItems: 'baseline' }}>
								<Typography variant='h6' sx={{ fontWeight: '700' }}>
									{dummyInfo['직원 이름']}
								</Typography>
								<Typography sx={{ marginLeft: '0.25rem', fontWeight: '600' }}>{dummyInfo['직위']}</Typography>
							</Box>
							<Box sx={{ fontSize: '0.875rem', color: theme.palette.grey[500] }}>{dummyInfo['부서/직책']}</Box>
							<Grid container spacing={3} sx={{ display: 'flex', flexDirection: 'row', mt: '1rem' }}>
								<Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
									<Box sx={{ fontSize: '0.875rem' }}>결재할 문서</Box>
									<Box sx={{ padding: '0.5rem', fontSize: '1.625rem', fontWeight: '600' }}> 15 </Box>
								</Grid>
								<Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
									<Box sx={{ fontSize: '0.875rem' }}>오늘의 할 일</Box>
									<Box sx={{ padding: '0.5rem', fontSize: '1.625rem', fontWeight: '600' }}> 15 </Box>
								</Grid>
								<Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
									<Box sx={{ fontSize: '0.875rem' }}>잔여 휴가</Box>
									<Box sx={{ padding: '0.5rem', fontSize: '1.625rem', fontWeight: '600' }}> 15 </Box>
								</Grid>
							</Grid>
						</Box>
					</Box>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							width: '40%',
							marginLeft: '1rem',
							padding: '1rem',
							borderRadius: '1rem',
							backgroundColor: theme.palette.grey[50],
						}}
					></Box>
				</Box>
			</Grid>
		</Grid>
	);
}
