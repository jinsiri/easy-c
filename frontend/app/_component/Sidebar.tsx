/** MUI */
import { Box, List, Paper } from '@mui/material';

/** Custom */
import { menuType } from '../_constant/Types';
import MainMenuItem from './menuItem/MainMenuItem';
import Menu1Depth from './menu/Menu1Depth';

interface propsType {
	drawerOpen: boolean;
	headerHeight: string;
}

export default function Sidebar(props: propsType) {
	const { drawerOpen, headerHeight } = props;
	const menuList: menuType[] = MainMenuItem[0].children ?? [];

	return (
		<Paper
			elevation={3}
			component='nav'
			sx={{
				width: drawerOpen ? '19rem' : '4.5rem',
				height: '100%',
				transition: 'all easeInOut 0.4s',
				zIndex: 500,
			}}
		>
			<Box sx={{ width: '100%', height: headerHeight }}></Box>
			<Box className='w-100' sx={{ overflowX: 'hidden', overscrollBehaviorY: 'auto', height: `calc(100% - ${headerHeight})` }}>
				<List className='w-100' component='div' disablePadding>
					{menuList.map((value) => {
						return value.type === '1depth' && <Menu1Depth key={value.id} item={value} drawerOpen={drawerOpen} />;
					})}
				</List>
			</Box>
		</Paper>
	);
}
