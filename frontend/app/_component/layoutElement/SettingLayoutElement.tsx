/** MUI */
import { Box, Typography, useTheme } from '@mui/material';

interface SettingLayoutElementProps {
	subtitle: string;
	children: React.ReactNode;
}

export default function SettingLayoutElement({ subtitle, children }: SettingLayoutElementProps) {
	const theme = useTheme();

	return (
		<>
			<Box sx={{ display: 'flex', alignItems: 'center', mb: '1rem' }}>
				<Typography sx={{ mr: '1.5rem', fontSize: '1.125rem', fontWeight: 'bold' }}>{subtitle}</Typography>
				<Box sx={{ flexGrow: 1, height: '1px', bgcolor: theme.palette.grey[300] }} />
			</Box>
			<Box sx={{ flexGrow: 1, padding: '1.125rem', borderRadius: '1rem', bgcolor: theme.palette.grey[100] }}>{children}</Box>
		</>
	);
}
