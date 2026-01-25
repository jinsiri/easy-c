'use client';

/** Lib */
import useLoaderStore from '@/store/useLoaderStore';

/** Mui */
import { Backdrop, LinearProgress, Box } from '@mui/material';

export default function Loader() {
	const loader = useLoaderStore((state) => state.loader);

	return (
		<Backdrop open={loader} sx={{ bgcolor: '#3333331a', zIndex: 200 }}>
			<Box sx={{ width: '100%', height: '100%' }}>{loader && <LinearProgress sx={{ zIndex: 300 }} />}</Box>
		</Backdrop>
	);
}
