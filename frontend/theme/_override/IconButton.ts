import { Theme } from '@mui/material/styles';

const IconButton = (theme: Theme) => ({
	MuiIconButton: {
		styleOverrides: {
			root: {},
			sizeMedium: {
				'&.contained-primary': {
					width: '2.25rem',
					height: '2.25rem',
					borderRadius: '0.3em',
					backgroundColor: theme.palette.primary.main,

					'&:hover': {
						backgroundColor: theme.palette.primary.dark,
					},

					'& .MuiSvgIcon-root': {
						fontSize: '1.5rem',
						fill: theme.palette.primary.contrastText,
					},

					'& .MuiSvgIcon-root.svg-small': {
						fontSize: '1.25rem',
					},

				},

				'&.circle-primary': {
					width: '2.5rem',
					height: '2.5rem',
					backgroundColor: theme.palette.primary.main,

					'&:hover': {
						backgroundColor: theme.palette.primary.dark,
					},

					'& .MuiSvgIcon-root': {
						fontSize: '1.5rem',
						fill: theme.palette.primary.contrastText,
					},

				},
			},

		},
	},
});

export default IconButton;