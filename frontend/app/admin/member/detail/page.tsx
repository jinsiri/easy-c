import MemberDetail from '@/app/admin/member/_component/MemberDetail';
import { Grid, Typography } from '@mui/material';

export default function MemberDetailPage() {
	return (
		<Grid container sx={{ p: '1.5rem' }} spacing={2}>
			<Grid size={12}>
				<Typography variant='h5'>멤버 상세</Typography>
			</Grid>
			<Grid size={12}>
				<MemberDetail />
			</Grid>
		</Grid>
	);
}
