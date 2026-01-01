import { Theme } from '@mui/material/styles';

const OutlinedInput = (theme: Theme) => ({
	MuiOutlinedInput: {
		styleOverrides: {
			input: {
				padding: '0.5rem 1rem',
			},
		},
		variants: [
			{
				props: { size: 'small' },
				style: {
					'& .MuiOutlinedInput-input': {
						padding: '0.375rem 0.75rem',
					},
				},
			},
		],
	},
});

export default OutlinedInput;
