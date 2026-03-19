import React from 'react';

/** MUI */
import { Box, Button } from '@mui/material';

export default function GridDetailButtonComp({ params: any }) {
	const { onClickDetail } = params;

	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', py: '6px' }}>
			<Button variant='outlined' size='small' onClick={() => onClickDetail(params.data)}>
				상세 보기
			</Button>
		</Box>
	);
}
