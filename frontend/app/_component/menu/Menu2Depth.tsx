import { Fragment, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** MUI */
import { Box, Collapse, List, ListItemButton, ListItemText, Fade } from '@mui/material';
import { ExpandMoreRounded } from '@mui/icons-material';

/** Custom */
import { menuType } from '../../_constant/Types';
import theme from '@/theme/Theme';

interface propsType {
	item: menuType;
	drawerOpen: boolean;
	prevUrl: string;
}

export default function Menu2Depth({ item, drawerOpen, prevUrl }: propsType) {
	const pathName = usePathname();
	const isActive = pathName.includes(prevUrl + item.url);

	const [collapseOpen, setCollapseOpen] = useState(false);

	return (
		<Fragment>
			<ListItemButton
				className='nav-depth-2'
				component={item.children ? 'span' : Link}
				href={item.children ? undefined : prevUrl + item.url}
				sx={{
					height: drawerOpen ? 'auto' : '3rem',
					borderRadius: '1rem',
					backgroundColor: isActive ? theme.palette.primary[50] : 'transparent',
				}}
			>
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: '2rem',
						width: '1px',
						height: '48px',
						backgroundColor: theme.palette.grey[200],
						zIndex: 10,
					}}
				></Box>
				<Box sx={{ display: 'flex', justifyContent: 'center', width: '2.25rem', height: '100%' }} />
				<Fade in={drawerOpen} easing={'easeInOut'} timeout={200}>
					<ListItemText primary={item.title} className={'transition-3'} sx={{ marginLeft: '0.25rem' }} />
				</Fade>
				{item.children && (
					<Fade in={drawerOpen} easing={'easeInOut'} timeout={200}>
						<ExpandMoreRounded sx={{ color: theme.palette.grey[700] }} />
					</Fade>
				)}
			</ListItemButton>

			{item.children && (
				<Collapse in={drawerOpen && collapseOpen} timeout='auto' unmountOnExit>
					<List component='div' disablePadding>
						{item.children.map((value) => {
							return (
								value.type === '3depth' && (
									<ListItemButton className='nav-depth-3'>
										<ListItemText primary='Starred' />
									</ListItemButton>
								)
							);
						})}
					</List>
				</Collapse>
			)}
		</Fragment>
	);
}
