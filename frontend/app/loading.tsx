/** Mui */
import { Backdrop, Box, LinearProgress } from '@mui/material';

export default function Loading() {
	return (
		<Backdrop open={true} sx={{ bgcolor: '#3333331a', zIndex: 2000 }}>
			<Box sx={{ width: '100%', height: '100%' }}>
				<LinearProgress sx={{ zIndex: 2500 }} />
			</Box>
		</Backdrop>
	);
}
