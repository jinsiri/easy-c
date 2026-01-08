'use client';

/** MUI */
import { Box, Typography, useTheme } from '@mui/material';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import ColTitleAndText from '@/app/_component/layoutElement/ColTitleAndText';
import Calendar from '@/app/_component/Calendar';

export default function AttendanceUserPage() {
	const theme = useTheme();

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs />
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					mb: '1rem',
					padding: '1.5rem 1rem',
					borderRadius: '1rem',
					border: `1px solid ${theme.palette.primary.main}`,
				}}
			>
				<Box sx={{ width: '40%' }}>
					<Box sx={{ display: 'flex', flexDirection: 'row' }}>
						<Typography variant='h6'>주간 누적</Typography>
						<Typography variant='h6' sx={{ marginLeft: '0.5rem', color: theme.palette.primary.main }}>
							25시간 14분
						</Typography>
					</Box>
					<Typography sx={{ color: theme.palette.grey[700] }}>이번 주 14시간 46분이 더 필요해요.</Typography>
				</Box>
				<Box sx={{ width: '30%' }}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							padding: '0 1rem',
							borderLeft: `1px solid ${theme.palette.grey[300]}`,
						}}
					>
						<Box sx={{ display: 'flex', flexDirection: 'row' }}>
							<ColTitleAndText subtitle={'잔여 근무일'}>
								<Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', padding: '0.5rem' }}>
									<Typography variant='h4' sx={{ color: theme.palette.primary.main }}>
										2d
									</Typography>
									<Typography sx={{ marginLeft: '0.25rem' }}>/ 5d</Typography>
								</Box>
							</ColTitleAndText>
							<ColTitleAndText subtitle={'잔여 근로시간'}>
								<Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', padding: '0.5rem' }}>
									<Typography variant='h4' sx={{ color: theme.palette.primary.main }}>
										14h 46m
									</Typography>
									<Typography sx={{ marginLeft: '0.25rem' }}>/ 40h</Typography>
								</Box>
							</ColTitleAndText>
						</Box>
					</Box>
				</Box>
				<Box sx={{ width: '30%' }}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							padding: '0 1rem',
							borderLeft: `1px solid ${theme.palette.grey[300]}`,
						}}
					>
						<Box sx={{ display: 'flex', flexDirection: 'row' }}>
							<ColTitleAndText subtitle={'총 근로시간'}>
								<Box sx={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
									<Typography variant='h4'>21h 14m</Typography>
								</Box>
							</ColTitleAndText>
							<ColTitleAndText subtitle={'휴가'}>
								<Box sx={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
									<Typography variant='h4'>4h 00m</Typography>
								</Box>
							</ColTitleAndText>
						</Box>
					</Box>
				</Box>
			</Box>
			<Box>
				<Calendar />
			</Box>
		</Box>
	);
}
