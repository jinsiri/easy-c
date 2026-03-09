import React from 'react';

/** MUI */
import { Box, Typography } from '@mui/material';
import { AccountCircleRounded, WorkRounded, FeedRounded } from '@mui/icons-material';

export default function GridMemberComp({ memberNm, deptNm, jobGrade, policyNm }: { memberNm: string; deptNm: string; jobGrade: string; policyNm: string }) {
	const style = { width: '1rem', height: '1rem', color: 'grey.800' };
	const list = [
		{
			icon: <AccountCircleRounded fontSize='small' sx={{ ...style }} />,
			label: memberNm,
			variant: 'body1',
		},
		{
			icon: <WorkRounded fontSize='small' sx={{ ...style }} />,
			label: deptNm && jobGrade ? deptNm + ' / ' + jobGrade : '-',
			variant: 'body2',
		},
		{
			icon: <FeedRounded fontSize='small' sx={{ ...style }} />,
			label: policyNm,
			variant: 'body1',
		},
	];

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'start',
			}}
		>
			{list.map((item, idx) => {
				return (
					item.label && (
						<Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
							{item.icon}
							<Typography variant={item.variant}>{item.label}</Typography>
						</Box>
					)
				);
			})}
		</Box>
	);
}
