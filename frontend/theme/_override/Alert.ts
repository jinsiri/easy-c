import { Theme } from '@mui/material/styles';

const Alert = (theme: Theme) => ({
	MuiAlert: {
		styleOverrides: {
			root: {
				padding: '0 0.5rem',
			},
		},
	},
});

export default Alert;
