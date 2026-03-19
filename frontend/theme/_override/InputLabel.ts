import { Theme } from '@mui/material/styles';

const InputLabel = (theme: Theme) => ({
	MuiInputLabel: {
		styleOverrides: {
			root: {},
			outlined: {
				transform: 'translate(14px, 40%) scale(1)',

				'&.MuiInputLabel-shrink': {
					// 원래 MUI 기본값으로 복구
					transform: 'translate(14px, -9px) scale(0.75)',
				},
			},
		},
	},
});

export default InputLabel;
