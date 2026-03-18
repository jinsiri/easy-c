/** MUI */
import { Box, List, Paper } from '@mui/material';

/** Custom */
import { menuType } from '@/type/types';
import AdminMenuItem from './menuItem/AdminMenuItem';
import Menu1Depth from './menu/Menu1Depth';

interface propsType {
	drawerOpen: boolean;
	headerHeight: string;
}

export default function AdminSidebar(props: propsType) {
	const { drawerOpen, headerHeight } = props;
	const menuList: menuType[] = AdminMenuItem[0].children ?? [];

	return (
		<Paper
			elevation={3}
			component='nav'
			sx={{
				width: drawerOpen ? '19rem' : '4rem',
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
						return value.type === '1depth' && <Menu1Depth key={value.id} item={value} drawerOpen={drawerOpen} prevUrl={'/admin'} />;
					})}
				</List>
			</Box>
		</Paper>
	);
}
