import { Theme } from '@mui/material/styles';

const OutlinedInput = (theme: Theme) => ({
	MuiOutlinedInput: {
		styleOverrides: {
			root: {
				padding: 0,
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
						padding: '0.625rem 0.75rem',
					},
				},
			},
		],
	},
});

export default OutlinedInput;
