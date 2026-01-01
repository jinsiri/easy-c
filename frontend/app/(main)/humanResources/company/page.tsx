'use client';

/** MUI */
import { Box, useTheme } from '@mui/material';

/** Custom */
import PathBreadcrumbs from '../../../_component/PathBreadcrumbs';

export default function HumanResourceCompanyPage() {
	const theme = useTheme();

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs />
			<Box sx={{ flexGrow: 1, width: '100%', height: '100%' }}></Box>
		</Box>
	);
}
