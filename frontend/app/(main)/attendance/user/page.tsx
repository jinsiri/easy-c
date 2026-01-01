'use client';

/** MUI */
import { Box, Typography, Grid, useTheme } from '@mui/material';

/** Custom */
import PathBreadcrumbs from '../../../_component/PathBreadcrumbs';

export default function AttendanceUserPage() {
	const theme = useTheme();

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs />
			<Grid container spacing={4} sx={{ flexGrow: 1, width: '100%', height: '100%' }}></Grid>
		</Box>
	);
}
