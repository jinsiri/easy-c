/** MUI */
import { Box, Grid, Typography } from '@mui/material';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import ColTitleAndText from '@/app/_component/layoutElement/ColTitleAndText';
import Calendar from '@/app/_component/Calendar';
import AttendanceComp from '@/app/_component/baseElement/AttendanceComp';

export default function AttendanceUserPage() {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs />
			<Grid container spacing={2}>
				<Grid
					size={12}
					sx={{
						display: 'flex',
						flexDirection: 'row',
						borderRadius: '1rem',
						borderWidth: '1px',
						borderStyle: 'solid',
						borderColor: 'gray.300',
					}}
				>
					<Box sx={{ width: '50%' }}>
						<AttendanceComp />
					</Box>
					<Box sx={{ width: '50%', padding: '1rem 1.5rem', borderLeftWidth: '1px', borderStyle: 'solid', borderColor: 'gray.300' }}>
						<Box sx={{ display: 'flex', flexDirection: 'row' }}>
							<Typography variant='h6'>주간 누적</Typography>
							<Typography variant='h6' sx={{ marginLeft: '0.5rem', color: 'primary.main' }}>
								25시간 14분
							</Typography>
						</Box>
						<Typography sx={{ color: 'gray.700' }}>이번 주 14시간 46분이 더 필요해요.</Typography>
					</Box>
				</Grid>
				<Grid
					size={12}
					sx={{
						display: 'flex',
						flexDirection: 'row',
						padding: '1rem',
						borderRadius: '1rem',
						backgroundColor: 'gray.100',
					}}
				>
					<ColTitleAndText subtitle={'잔여 근무일'}>
						<Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
							<Typography variant='h6' sx={{ color: 'primary.main' }}>
								2d
							</Typography>
							<Typography sx={{ marginLeft: '0.25rem' }}>/ 5d</Typography>
						</Box>
					</ColTitleAndText>
					<ColTitleAndText subtitle={'잔여 근로시간'}>
						<Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
							<Typography variant='h6' sx={{ color: 'primary.main' }}>
								14h 46m
							</Typography>
							<Typography sx={{ marginLeft: '0.25rem' }}>/ 40h</Typography>
						</Box>
					</ColTitleAndText>
					<ColTitleAndText subtitle={'총 근로시간'}>
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<Typography variant='h6'>21h 14m</Typography>
						</Box>
					</ColTitleAndText>
					<ColTitleAndText subtitle={'휴가'}>
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<Typography variant='h6'>4h 00m</Typography>
						</Box>
					</ColTitleAndText>
				</Grid>
				<Grid size={12}>
					<Calendar />
				</Grid>
			</Grid>
		</Box>
	);
}
