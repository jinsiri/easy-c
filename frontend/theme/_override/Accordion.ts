import { Theme } from '@mui/material/styles';

const Accordion = (theme: Theme) => ({
	MuiAccordion: {
		styleOverrides: {
			root: {
				'&:last-of-type': {
					BorderBottomLeftRadius: 'inherit',
					BorderBottomRadius: 'inherit',
				},

				'&.accordion-custom': {
					boxShadow: 'none',
					backgroundColor: theme.palette.grey[50],
					borderRadius: '1rem',

					'&::before': {
						display: 'none',
					},

					'&:last-of-type': {
						marginBottom: 0,
					},
				},
			},
		},
	},
});

export default Accordion;
