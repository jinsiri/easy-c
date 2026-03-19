/** MUI */
import { Box, Button, List, Paper, Popover, Typography } from '@mui/material';

/** Custom */
import { menuType } from '@/type/types';
import MainMenuItem from './menuItem/MainMenuItem';
import Menu1Depth from './menu/Menu1Depth';
import { CorporateFare } from '@mui/icons-material';
import { useState } from 'react';
import DeptWithMembersTree from '@/app/_component/DeptWithMembersTree';

interface propsType {
	drawerOpen: boolean;
	headerHeight: string;
}

export default function Sidebar(props: propsType) {
	const { drawerOpen, headerHeight } = props;
	const menuList: menuType[] = MainMenuItem[0].children ?? [];
	const sidebarWidth = drawerOpen ? '19rem' : '4rem';

	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	return (
		<Paper
			elevation={3}
			component='nav'
			sx={{
				width: sidebarWidth,
				height: '100%',
				transition: 'all easeInOut 0.5s',
				zIndex: 200,
			}}
		>
			<Box sx={{ width: '100%', height: headerHeight }}></Box>
			<Box
				className='w-100'
				sx={{
					position: 'relative',
					overflowX: drawerOpen ? 'hidden' : 'visible',
					overflowY: drawerOpen ? 'auto' : 'visible',
					overscrollBehaviorY: 'auto',
					height: `calc(100% - ${headerHeight})`,
				}}
			>
				<List className='w-100' component='div' disablePadding>
					{menuList.map((value) => {
						return value.type === '1depth' && <Menu1Depth key={value.id} item={value} drawerOpen={drawerOpen} prevUrl={''} />;
					})}
				</List>
				<Button
					variant={'outlined'}
					aria-describedby={id}
					sx={{
						position: 'fixed',
						bottom: '20px',
						left: `calc(${sidebarWidth} * 0.05)`,
						zIndex: 501,
						width: `calc(${sidebarWidth} * 0.9)`,
						minWidth: '1px',
					}}
					onClick={handleClick}
				>
					<CorporateFare fontSize={'small'} />
					{drawerOpen ? <Typography sx={{ ml: 1 }}>조직도</Typography> : null}
				</Button>
				<Popover
					id={id}
					open={open}
					anchorEl={anchorEl}
					onClose={handleClose}
					anchorOrigin={{
						vertical: 'top',
						horizontal: drawerOpen ? 'left' : 'right',
					}}
					transformOrigin={{
						vertical: 'bottom',
						horizontal: drawerOpen ? 'left' : 'right',
					}}
				>
					<Box sx={{ height: '480px', p: 2, overflow: 'hidden' }}>
						<DeptWithMembersTree />
					</Box>
				</Popover>
			</Box>
		</Paper>
	);
}
