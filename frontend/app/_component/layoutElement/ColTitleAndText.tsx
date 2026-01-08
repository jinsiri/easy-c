/** MUI */
import { Box } from '@mui/material';

interface SettingLayoutElementProps {
	sx?: Record<string, string>;
	subtitle: string;
	children: React.ReactNode;
}

export default function ColTitleAndText({ sx = {}, subtitle, children }: SettingLayoutElementProps) {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ...sx }}>
			<Box sx={{ fontSize: '0.875rem', textWrap: 'nowrap' }}>{subtitle}</Box>
			<Box sx={{ padding: '0.5rem' }}>{children}</Box>
		</Box>
	);
}
