/** MUI */
import { Box, Typography } from '@mui/material';

export default function Footer() {
	return (
		<Box component={'footer'} display='flex' flexDirection='column' alignItems='center' justifyContent={'center'} sx={{ height: '48px' }}>
			<Typography textAlign={'center'} sx={{ fontSize: '.813rem', color: 'gray.700' }}>
				Copyright. EasyC All right reserved.
			</Typography>
		</Box>
	);
}
