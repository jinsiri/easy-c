'use client';
import { useState, useEffect } from 'react';

/** MUI */
import { Box, useMediaQuery, useTheme } from '@mui/material';

/** Custom */
import Sidebar from '@/app/_component/Sidebar';
import Header from '@/app/_component/Header';
import Footer from '@/app/_component/Footer';

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	const headerHeight = '4rem';
	const theme = useTheme();
	const isDownLg = useMediaQuery(theme.breakpoints.down('lg'));

	const [drawerOpen, setDrawerOpen] = useState(true);

	useEffect(() => {
		if (isDownLg) {
			setDrawerOpen(false);
		} else {
			setDrawerOpen(true);
		}
	}, [isDownLg]);

	return (
		<Box sx={{ overflow: 'hidden', display: 'flex', justifyContent: 'space-between', width: '100vw', height: '100vh' }}>
			<Sidebar drawerOpen={drawerOpen} headerHeight={headerHeight}></Sidebar>
			<Box
				component={'main'}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					position: 'relative',
					width: drawerOpen ? 'calc(100vw - 19rem)' : 'calc(100vw - 4rem)',
					transition: 'all ease 0.3s',
				}}
			>
				<Header drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} headerHeight={headerHeight}></Header>
				<Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
					<Box sx={{ width: '100%', paddingBottom: '2rem', flexGrow: 1 /*height: `calc(100% - ${headerHeight} - 48px)`*/ }}>{children}</Box>
					<Footer />
				</Box>
			</Box>
		</Box>
	);
}
