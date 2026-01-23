'use client';
import { useState, useEffect } from 'react';

/** MUI */
import { Box } from '@mui/material';

/** Custom */
import Sidebar from '@/app/_component/Sidebar';
import Header from '@/app/_component/Header';
import Footer from '@/app/_component/Footer';

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	const headerHeight = '4rem';
	const [drawerOpen, setDrawerOpen] = useState(true);

	return (
		<Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100vw', height: '100vh' }}>
			<Sidebar drawerOpen={drawerOpen} headerHeight={headerHeight}></Sidebar>
			<Box
				component={'main'}
				sx={{
					overflowY: 'auto',
					display: 'flex',
					flexDirection: 'column',
					position: 'relative',
					width: drawerOpen ? 'calc(100vw - 19rem)' : 'calc(100vw - 4.5rem)',
					transition: 'all ease 0.3s',
				}}
			>
				<Header drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} headerHeight={headerHeight}></Header>
				<Box sx={{ width: '100%', flexGrow: 1 /*height: `calc(100% - ${headerHeight} - 48px)`*/ }}>{children}</Box>
				<Footer />
			</Box>
		</Box>
	);
}
