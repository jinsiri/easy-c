import { Fragment } from 'react';

/** MUI */
import { Box, Collapse, List, ListItemButton, ListItemText, Fade } from '@mui/material';
import { ExpandMoreRounded } from '@mui/icons-material';

/** Custom */
import { menuType } from '../../_constant/Types';
import theme from '@/theme/Theme';

interface propsType {
	item: menuType;
	drawerOpen: boolean;
}

export default function Menu2Depth({ item, drawerOpen }: propsType) {
	return (
		<Fragment>
			<ListItemButton className='nav-depth-2' sx={{ height: drawerOpen ? 'auto' : '3rem', borderBottom: `1px solid ${theme.palette.grey[200]}` }}>
				<Box sx={{ width: '2.25rem', height: '1rem', padding: '0.5rem' }}></Box>
				<Fade in={drawerOpen} easing={'easeInOut'} timeout={200}>
					<ListItemText primary={item.title} className={'transition-3'} sx={{ marginLeft: '0.25rem' }} />
				</Fade>
				{item.children && (
					<Fade in={drawerOpen} easing={'easeInOut'} timeout={200}>
						<ExpandMoreRounded />
					</Fade>
				)}
			</ListItemButton>

			<Collapse in={false} timeout='auto' unmountOnExit>
				<List component='div' disablePadding>
					<ListItemButton className='nav-depth-3'>
						<ListItemText primary='Starred' />
					</ListItemButton>
				</List>
			</Collapse>
		</Fragment>
	);
}
