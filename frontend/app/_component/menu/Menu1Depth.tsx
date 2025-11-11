'use client';

import { Fragment, useState } from 'react';

/** MUI */
import { Box, Collapse, List, ListItemButton, ListItemText, Fade } from '@mui/material';
import { ExpandMoreRounded } from '@mui/icons-material';

/** Custom */
import { menuType } from '../../_constant/Types';
import Menu2Depth from './Menu2Depth';

interface propsType {
	item: menuType;
	drawerOpen: boolean;
}

export default function Menu1Depth({ item, drawerOpen }: propsType) {
	const IconComponent = item.icon;

	const [collapseOpen, setCollapseOpen] = useState(false);

	return (
		<Fragment>
			<ListItemButton className='nav-depth-1' sx={{ height: drawerOpen ? 'auto' : '3rem', boxShadow: collapseOpen ? 1 : 0 }}>
				<Box sx={{ padding: '0.5rem' }}>{IconComponent && <IconComponent fontSize={'small'} />}</Box>
				<Fade in={drawerOpen} easing={'easeInOut'} timeout={200}>
					<ListItemText primary={item.title} className={'transition-3'} sx={{ marginLeft: '0.25rem' }} />
				</Fade>
				{item.children && (
					<Fade in={drawerOpen} easing={'easeInOut'} timeout={200}>
						<ExpandMoreRounded />
					</Fade>
				)}
			</ListItemButton>

			{item.children && (
				<Collapse in={drawerOpen && collapseOpen} timeout='auto' unmountOnExit>
					<List component='div' disablePadding>
						{item.children.map((value) => {
							return value.type === '2depth' && <Menu2Depth key={value.id} item={value} drawerOpen={drawerOpen} />;
						})}
					</List>
				</Collapse>
			)}
		</Fragment>
	);
}
