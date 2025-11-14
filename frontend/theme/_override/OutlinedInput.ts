import { Theme } from '@mui/material/styles';

const OutlinedInput = (theme: Theme) => ({
	MuiOutlinedInput: {
		styleOverrides: {
			input: {
				padding: '0.5rem 1rem',
			},
		},
	},
});

export default OutlinedInput;
