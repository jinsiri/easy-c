'use client';

/** MUI */
import { Box, Typography, Grid, useTheme } from '@mui/material';

/** Custom */
import PathBreadcrumbs from '../../_component/PathBreadcrumbs';

/** interface */
interface propsType {}

export default function AttendancePage(props: propsType) {
	const theme = useTheme();

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs />
			<Box component={'section'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '1.5rem' }}>
				<Typography variant='h5' sx={{ fontWeight: '800' }}>
					근태관리
				</Typography>
			</Box>
			<Grid container spacing={4} sx={{ flexGrow: 1, width: '100%', height: '100%' }}></Grid>
		</Box>
	);
}
