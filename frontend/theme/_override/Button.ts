import { Theme } from '@mui/material/styles';

const Button = (theme: Theme) => ({
	MuiButton: {
		styleOverrides: {
			root: {
				textWrap: 'nowrap',
			},
			sizeLarge: {
				padding: '0.625rem 1.5rem',
				fontSize: '1rem',
				minHeight: 48,
			},
		},
	},
});

export default Button;
