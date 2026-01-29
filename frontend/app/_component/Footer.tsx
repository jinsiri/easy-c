/** MUI */
import { Box, Typography } from '@mui/material';

export default function Footer() {
	return (
		<Box component={'footer'} sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '48px' }}>
			<Typography sx={{ fontSize: '.813rem', textAlign: 'center', color: 'grey.700' }}>Copyright. EasyC All right reserved.</Typography>
		</Box>
	);
}
