import { Theme } from '@mui/material/styles';

const Dialog = (theme: Theme) => ({
	MuiDialog: {
		styleOverrides: {
			paper: {
				borderRadius: '1rem',
				padding: '4.375rem 0 0',
				maxHeight: 'calc(100% - 4.375rem)',
				display: 'flex',
				flexDirection: 'column',
			},
		},
	},
	MuiDialogTitle: {
		styleOverrides: {
			root: {
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				padding: '1.25rem 1.5rem',
				flexShrink: 0,
				borderBottom: `1px solid ${theme.palette.divider}`,
				fontSize: '1.25rem',
				fontWeight: 700,
				color: theme.palette.grey[900],
			},
		},
	},
	MuiDialogContent: {
		styleOverrides: {
			root: {
				flexGrow: 1,
				overflowY: 'auto',
				padding: '1.5rem',
				'&.MuiDialogContent-root': {
					paddingTop: '1rem',
				},

				'&::-webkit-scrollbar': { width: '8px' },
				'&::-webkit-scrollbar-thumb': {
					backgroundColor: theme.palette.grey[700],
					borderRadius: '4px',
				},
			},
		},
	},
	MuiDialogActions: {
		styleOverrides: {
			root: {
				'&.base-dialog': {
					padding: '1.5rem',
					gap: '0.75rem',

					'& .MuiButton-root': {
						padding: '.813rem 2.25rem',
						fontSize: '1rem',
						fontWeight: 600,
						lineHeight: 1,
					},
				},
			},
		},
	},
});

export default Dialog;
