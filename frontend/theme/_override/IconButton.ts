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

						'&.svg': {
							'&-small': {
								fontSize: '1.25rem',
							},
							'&-x-small': {
								fontSize: '1.125rem',
							},
						},
					},

					'&.light': {
						backgroundColor: theme.palette.primary.light,

						'& .MuiSvgIcon-root': {
							fill: theme.palette.primary.main,
						},
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
