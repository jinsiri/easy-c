import { Theme } from '@mui/material/styles';

const MuiCssBaseline = (theme: Theme) => ({
	styleOverrides: {
		body: {
			fontSize: '14px',
		},
	},
});

export default MuiCssBaseline;
