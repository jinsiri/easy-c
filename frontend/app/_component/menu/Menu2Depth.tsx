import { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** MUI */
import { Box, ListItemButton, ListItemText, Fade } from '@mui/material';

/** Custom */
import { menuType } from '@/type/types';

interface propsType {
	item: menuType;
	drawerOpen: boolean;
	prevUrl: string;
}

export default function Menu2Depth({ item, drawerOpen, prevUrl }: propsType) {
	const pathName = usePathname();
	const isActive = pathName.includes(prevUrl + item.url);

	return (
		<Fragment>
			<ListItemButton
				className='nav-depth-2'
				component={item.children ? 'span' : Link}
				href={item.children ? undefined : prevUrl + item.url}
				sx={{
					height: drawerOpen ? 'auto' : '3rem',
					borderRadius: drawerOpen ? '1rem' : 0,
					backgroundColor: isActive ? 'primary.50' : 'transparent',
				}}
			>
				{drawerOpen ? (
					<>
						<Box
							sx={{
								position: 'absolute',
								top: 0,
								left: '2rem',
								width: '1px',
								height: '100%',
								backgroundColor: 'gray.200',
								zIndex: 10,
							}}
						/>
						<Box sx={{ display: 'flex', justifyContent: 'center', width: '2.25rem', height: '100%' }} />
						<Fade in={drawerOpen} easing={'easeInOut'} timeout={200}>
							<ListItemText primary={item.title} className={'transition-3'} sx={{ marginLeft: '0.25rem' }} />
						</Fade>
					</>
				) : (
					<ListItemText primary={item.title} sx={{ marginLeft: '0.25rem' }} />
				)}
			</ListItemButton>
		</Fragment>
	);
}
