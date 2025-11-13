'use client';

import PathBreadcrumbs from '../../_component/PathBreadcrumbs';

/** MUI */
import { Box } from '@mui/material';

export default function AdminNormal({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<Box sx={{ width: '100%' }}>
			<PathBreadcrumbs />
		</Box>
	);
}
