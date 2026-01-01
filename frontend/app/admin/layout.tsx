'use client';
import { useState } from 'react';

/** MUI */
import { Box } from '@mui/material';

/** Custom */
import AdminSidebar from '@/app/_component/AdminSidebar';
import Header from '@/app/_component/Header';
import Footer from '../_component/Footer';

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const headerHeight = '4rem';
	const [drawerOpen, setDrawerOpen] = useState(true);

	return (
		<Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100vw', height: '100vh' }}>
			<AdminSidebar drawerOpen={drawerOpen} headerHeight={headerHeight}></AdminSidebar>
			<Box
				component={'main'}
				sx={{
					overflow: 'auto',
					position: 'relative',
					width: drawerOpen ? 'calc(100vw - 19rem)' : 'calc(100vw - 4.5rem)',
					height: '100%',
					transition: 'all ease 0.3s',
				}}
			>
				<Header drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} headerHeight={headerHeight}></Header>
				<Box sx={{ width: '100%', height: `calc(100% - ${headerHeight} - 48px)` }}>{children}</Box>
				<Footer />
			</Box>
		</Box>
	);
}
