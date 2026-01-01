import { Theme } from '@mui/material/styles';

const Tab = (theme: Theme) => ({
	MuiTab: {
		styleOverrides: {
			root: {
				padding: '0.25rem 1rem',
			},
		},
	},
});

export default Tab;
