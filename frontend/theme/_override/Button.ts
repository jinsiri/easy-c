import { Theme } from '@mui/material/styles';

const Button = (theme: Theme) => ({
	MuiButton: {
		styleOverrides: {
			root: {
				textWrap: 'nowrap',
			},
			sizeSmall: {
				fontSize: '0.75rem',
				padding: '0.25rem 0.25rem',
			},
			sizeMedium: {
				minHeight: '2.25rem',
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
