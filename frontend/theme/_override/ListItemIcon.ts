import { Theme } from '@mui/material/styles';

const ListItemIcon = (theme: Theme) => ({
	MuiListItemIcon: {
		styleOverrides: {
			root: {
				minWidth: '3rem',
			},
		},
	},
});

export default ListItemIcon;
