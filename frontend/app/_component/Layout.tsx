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
		<Box sx={{ display: 'flex', width: '100vw', height: '100vh' }}>
			<Sidebar drawerOpen={drawerOpen} headerHeight={headerHeight}></Sidebar>
			<Box component={'main'} sx={{
				width: drawerOpen ? 'calc(100vw - 19rem)' : 'calc(100vw - 4.5rem)',
				height: '100%',
				backgroundColor: 'blue',
				transition: 'all ease 0.3s',
			}}>
				<Header drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} headerHeight={headerHeight}></Header>
				<Box sx={{ width: '100%', height: `calc(100% - ${headerHeight})` }}>
					{children}
				</Box>


			</Box>
		</Box>
	);
}


