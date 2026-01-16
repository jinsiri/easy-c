/** MUI */
import { Box, Grid } from '@mui/material';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';

/** Type / Interface */

export default function AttendanceTeamPage() {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs />
			<Grid container spacing={2}></Grid>
		</Box>
	);
}
