import { Theme } from '@mui/material/styles';

const ButtonBase = (theme: Theme) => ({
	MuiButtonBase: {
		styleOverrides: {
			root: {
				textWrap: 'nowrap',
			},
		},
	},
});

export default ButtonBase;
