'use client';

/** MUI */
import { Box, Typography, Grid, useTheme } from '@mui/material';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import ColTitleAndText from '@/app/_component/layoutElement/ColTitleAndText';

export default function VacationUserPage() {
	const theme = useTheme();

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs />
			<Grid container spacing={4} sx={{ flexGrow: 1, flexDirection: 'column', width: '100%', height: '100%' }}>
				<Grid
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', sm: 'column', md: 'row' },
						borderRadius: '1rem',
						borderWidth: '1px',
						borderStyle: 'solid',
						borderColor: 'grey.300',
						gap: '1rem',
					}}
				>
					<Box sx={{ width: { sm: '100%', md: '50%' } }}></Box>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							width: { sm: '100%', md: '50%' },
							padding: '1rem 1.5rem',
							borderLeftWidth: '1px',
							borderStyle: 'solid',
							borderColor: 'grey.300',
							gap: '1rem',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								gap: '0.5rem',
							}}
						></Box>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}
