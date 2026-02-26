import { Theme } from '@mui/material/styles';

const PickersTextField = (theme: Theme) => ({
	MuiPickersTextField: {
		styleOverrides: {
			root: {
				'& .MuiPickersSectionList-root': {
					width: 'auto',
					minWidth: '7rem',
					padding: '0.625rem 0',
				},
			},
		},
	},
});

export default PickersTextField;
