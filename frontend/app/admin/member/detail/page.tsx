import MemberDetail from '@/app/admin/member/_component/MemberDetail';
import { Box, Grid, Typography } from '@mui/material';
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';

export default function MemberDetailPage() {
	return (
		<Grid container sx={{ p: '1.5rem' }} spacing={2}>
			<Grid>
				<Typography variant='h5'>멤버 상세</Typography>
			</Grid>
			<Grid>
				<MemberDetail />
			</Grid>
		</Grid>
	);
}
