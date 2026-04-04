import { Theme } from '@mui/material/styles';

const IconButton = (theme: Theme) => ({
	MuiIconButton: {
		styleOverrides: {
			root: {},
			sizeMedium: {
				'&.rounded-square': {
					width: '2.25rem',
					height: '2.25rem',
					borderRadius: '0.3em',

					'& .MuiSvgIcon-root': {
						fontSize: '1.5rem',

						'&.svg': {
							'&-small': {
								fontSize: '1.25rem',
							},
							'&-x-small': {
								fontSize: '1.125rem',
							},
						},
					},

					'&.bg-primary': {
						backgroundColor: theme.palette.primary.main,

						'&:hover': {
							backgroundColor: theme.palette.primary.dark,
						},

						'& .MuiSvgIcon-root': {
							fill: theme.palette.primary.contrastText,
						},
					},
					'&.bg-light': {
						backgroundColor: theme.palette.primary.light,

						'&:hover': {
							backgroundColor: theme.palette.primary.dark,
						},

						'& .MuiSvgIcon-root': {
							fill: theme.palette.primary.contrastText,
						},
					},
					'&.bg-success': {
						backgroundColor: theme.palette.success.main,

						'&:hover': {
							backgroundColor: theme.palette.success.dark,
						},

						'& .MuiSvgIcon-root': {
							fill: theme.palette.success.contrastText,
						},
					},
					'&.bg-disabled': {
						backgroundColor: theme.palette.grey['700'],

						'& .MuiSvgIcon-root': {
							fill: theme.palette.grey['200'],
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
