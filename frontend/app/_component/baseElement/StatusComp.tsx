import React, { useEffect, useState } from 'react';

/** MUI */
import { Box, Typography } from '@mui/material';

/** Custom */
import { BASICSTATUS } from '@/constant/commonConst';

/** Type / Interface  */
import { baseStatus } from '@/type/types';

export default function StatusComp({ status }: { status: baseStatus }) {
	const [color, setColor] = useState<string>('grey.500');

	useEffect(() => {
		if (status === 'APPROVED') {
			setColor('primary.500');
		} else if (status === 'REJECTED') {
			setColor('error.500');
		} else {
			setColor('grey.600');
		}
	}, [status]);

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				padding: '0.125rem 0.5rem',
				gap: 1,
				border: '1px solid',
				borderColor: color,
				borderRadius: '4rem',
			}}
		>
			<Box sx={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', bgcolor: color }}></Box>
			<Typography variant='body2' sx={{ color: color }}>
				{BASICSTATUS[status]}
			</Typography>
		</Box>
	);
}
