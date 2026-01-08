'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** MUI */
import { Box, Collapse, List, ListItemButton, ListItemText, Fade, useTheme } from '@mui/material';
import { ExpandMoreRounded } from '@mui/icons-material';

/** Custom */
import { menuType } from '../../_constant/Types';
import Menu2Depth from './Menu2Depth';

interface propsType {
	item: menuType;
	drawerOpen: boolean;
	prevUrl: string;
}

export default function Menu1Depth({ item, drawerOpen, prevUrl }: propsType) {
	const IconComponent = item.icon;
	const theme = useTheme();
	const pathName = usePathname();
	const isActive = pathName.includes(prevUrl + item.url);

	const [collapseOpen, setCollapseOpen] = useState(false);

	const onClickListItemButton = (event: React.MouseEvent<HTMLElement>) => {
		setCollapseOpen(!collapseOpen);
	};

	return (
		<Fragment>
			<ListItemButton
				className='nav-depth-1'
				component={item.children ? 'span' : Link}
				href={item.children ? undefined : item.url}
				sx={{
					height: drawerOpen ? 'auto' : '3rem',
					backgroundColor: isActive ? theme.palette.primary[100] : 'transparent',
					borderRadius: '1rem 0 0 1rem',
				}}
				onClick={onClickListItemButton}
			>
				<Box sx={{ padding: '0.5rem' }}>{IconComponent && <IconComponent fontSize={'small'} />}</Box>
				<Fade in={drawerOpen} easing={'easeInOut'} timeout={200}>
					<ListItemText primary={item.title} className={'transition-3'} sx={{ marginLeft: '0.25rem' }} />
				</Fade>
				{item.children && (
					<Fade in={drawerOpen} easing={'easeInOut'} timeout={200}>
						<ExpandMoreRounded sx={{ color: theme.palette.grey[700] }} />
					</Fade>
				)}
				<Box
					sx={{ position: 'absolute', bottom: 0, width: '100%', height: '1px', backgroundColor: isActive ? 'transparent' : theme.palette.grey[100] }}
				></Box>
			</ListItemButton>

			{item.children && (
				<Collapse in={drawerOpen && collapseOpen} timeout='auto' unmountOnExit>
					<List component='div' disablePadding>
						{item.children.map((value) => {
							return value.type === '2depth' && <Menu2Depth key={value.id} item={value} drawerOpen={drawerOpen} prevUrl={prevUrl + item.url} />;
						})}
					</List>
				</Collapse>
			)}
		</Fragment>
	);
}
