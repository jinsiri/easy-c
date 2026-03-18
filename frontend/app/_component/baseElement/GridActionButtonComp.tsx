import React from 'react';

/** MUI */
import { Box, Button } from '@mui/material';

export default function GridActionButtonComp({ params: any }) {
	const { onClickAction } = params;

	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', gap: 1, py: '6px' }}>
			<Button variant='contained' size='small' onClick={() => onClickAction('approve', params.data)}>
				승인
			</Button>
			<Button variant='contained' size='small' color='error' onClick={() => onClickAction('reject', params.data)}>
				반려
			</Button>
		</Box>
	);
}
