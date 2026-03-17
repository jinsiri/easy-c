/** MUI */
import { Box } from '@mui/material';

interface SettingLayoutElementProps {
	subtitle: string;
	children: React.ReactNode;
}

export default function SettingLayoutElement({ subtitle, children }: SettingLayoutElementProps) {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<Box sx={{ fontSize: '0.875rem' }}>{subtitle}</Box>
			<Box sx={{ padding: '0.5rem' }}>{children}</Box>
		</Box>
	);
}
