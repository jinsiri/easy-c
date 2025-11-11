/** MUI */
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';

export default function AdminPage() {
	return (
		<Box sx={{ width: '100%' }}>
			<Breadcrumbs aria-label='breadcrumb'>
				<Link underline='hover' color='inherit' href='/'>
					MUI
				</Link>
				<Link underline='hover' color='inherit' href='/material-ui/getting-started/installation/'>
					Core
				</Link>
				<Typography sx={{ color: 'text.primary' }}>Breadcrumbs</Typography>
			</Breadcrumbs>
		</Box>
	);
}
