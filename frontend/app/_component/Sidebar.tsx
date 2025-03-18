import { Box, Collapse } from '@mui/material';

interface propsType {
	drawerOpen: boolean;
	headerHeight: string;
}

export default function Sidebar(props: propsType) {
	const { drawerOpen, headerHeight } = props;

	return (
		<Box component="nav" sx={{
			width: drawerOpen ? '19rem' : '4.5rem',
			height: '100%',
			backgroundColor: 'red',
			transition: 'all ease 0.3s',
		}}>
			<Box sx={{ width: '100%', height: headerHeight, backgroundColor: 'pink' }}></Box>
			{/*<Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
			<AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
				<Typography component="span">Collapsible Group Item #1</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Typography>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
					malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum dolor
					sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
					sit amet blandit leo lobortis eget.
				</Typography>
			</AccordionDetails>
		</Accordion>*/}
		</Box>

	);
}