/** MUI */
import { Box } from '@mui/material';
import { ArrowLeftRounded, ArrowRightRounded } from '@mui/icons-material';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';

export default function ScheduleDeptPage() {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs />
		</Box>
	);
}
