'use client';
import { useState } from 'react';

/** MUI */
import { Box, Typography } from '@mui/material';

/** Custom */
import Sidebar from '@/app/_component/Sidebar';
import Header from '@/app/_component/Header';


export default function Layout({ children }: Readonly<{ children: React.ReactNode; }>) {

	const headerHeight = '4rem';
	const [drawerOpen, setDrawerOpen] = useState(true);

	return (
		<Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100vw', height: '100vh' }}>
			<Sidebar drawerOpen={drawerOpen} headerHeight={headerHeight}></Sidebar>
			<Box
				component={'main'}
				sx={{
					position: 'relative',
					width: drawerOpen ? 'calc(100vw - 19rem)' : 'calc(100vw - 4.5rem)',
					height: '100%',
					transition: 'all ease 0.3s',
				}}
			>
				<Header drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} headerHeight={headerHeight}></Header>
				<Box sx={{ width: '100%', height: `calc(100% - ${headerHeight} - 48px)` }}>
					{children}
				</Box>
				<Box component={'footer'} display="flex" flexDirection="column" alignItems="center"
					 justifyContent={'center'} sx={{ position: 'fixed', bottom: 0, width: 'inherit', height: '48px' }}>
					<Typography textAlign={'center'} sx={{ fontSize: '.813rem', color: 'gray.700' }}>Copyright. EasyC
						All right reserved.</Typography>
				</Box>
			</Box>
		</Box>
	);
}


