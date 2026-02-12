import { Theme } from '@mui/material/styles';

const OutlinedInput = (theme: Theme) => ({
	MuiOutlinedInput: {
		styleOverrides: {
			root: {
				padding: 0,
				'& .MuiInputAdornment-positionStart': {
					marginLeft: '0.75rem',
				},
			},
			input: {
				padding: '0.625rem 1rem',
			},
		},
		variants: [
			{
				props: { size: 'small' as const },
				style: {
					'& .MuiOutlinedInput-input': {
						padding: '0.5rem 0.75rem',
					},
				},
			},
		],
	},
});

export default OutlinedInput;
