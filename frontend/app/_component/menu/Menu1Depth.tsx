'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** MUI */
import { Box, Collapse, List, ListItemButton, ListItemText, Fade, Paper, useTheme } from '@mui/material';
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
	const [isHovered, setIsHovered] = useState(false);

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
					position: 'relative',
					height: drawerOpen ? 'auto' : '3rem',
					backgroundColor: isActive ? 'primary.100' : 'transparent',
					borderRadius: '1rem 0 0 1rem',
				}}
				onClick={onClickListItemButton}
				onMouseEnter={() => !drawerOpen && setIsHovered(true)}
				onMouseLeave={() => !drawerOpen && setIsHovered(false)}
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
				/>

				{/* --- [추가] 사이드바가 닫혔을 때 호버 시 나타날 메뉴 --- */}
				{!drawerOpen && item.children && isHovered && (
					<Paper
						elevation={3}
						sx={{
							overflow: 'hidden',
							position: 'absolute',
							left: 'calc(100% + 0.25rem)',
							top: '-1rem',
							minWidth: '160px',
							padding: '1rem 0',
							borderRadius: '1rem',
							zIndex: 1000,
						}}
					>
						<List component='div' disablePadding>
							{item.children.map((value) => {
								return (
									value.type === '2depth' && <Menu2Depth key={value.id} item={value} drawerOpen={drawerOpen} prevUrl={prevUrl + item.url} />
								);
							})}
						</List>
					</Paper>
				)}
			</ListItemButton>

			{drawerOpen && item.children && (
				<Collapse in={collapseOpen} timeout='auto' unmountOnExit>
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
