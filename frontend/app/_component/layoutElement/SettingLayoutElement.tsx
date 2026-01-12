/** MUI */
import { Box, useTheme } from '@mui/material';

interface SettingLayoutElementProps {
	subtitle: string;
	children: React.ReactNode;
}

export default function SettingLayoutElement({ subtitle, children }: SettingLayoutElementProps) {
	const theme = useTheme();

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<Box sx={{ fontSize: '0.875rem' }}>{subtitle}</Box>
			<Box sx={{ padding: '0.5rem' }}>{children}</Box>
		</Box>
	);
}
