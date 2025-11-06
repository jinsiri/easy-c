import { Fragment } from 'react';

import { Box, Collapse, IconButton, List, ListItemButton, ListItemText, Paper, Fade } from '@mui/material';
import {
	AddToQueueRounded,
	ApprovalRounded,
	AssignmentRounded,
	CalendarMonthRounded,
	EmailRounded,
	ExpandMoreRounded,
	ForumRounded,
	WorkRounded,
	PsychologyAltRounded,
	WorkHistoryRounded,
} from '@mui/icons-material';

interface propsType {
	drawerOpen: boolean;
	headerHeight: string;
}

const navList = [
	{
		name: '메일',
		icon: <EmailRounded fontSize={'small'} />,
	},
	{
		name: '게시판',
		icon: <AssignmentRounded fontSize={'small'} />,
	},
	{
		name: '업무관리',
		icon: <WorkRounded fontSize={'small'} />,
	},
	{
		name: '일정관리',
		icon: <CalendarMonthRounded fontSize={'small'} />,
	},
	{
		name: '전자결재',
		icon: <ApprovalRounded fontSize={'small'} />,
	},
	{
		name: '설문조사',
		icon: <PsychologyAltRounded fontSize={'small'} />,
	},
	{
		name: '근태관리',
		icon: <WorkHistoryRounded fontSize={'small'} />,
	},
	{
		name: '예약',
		icon: <AddToQueueRounded fontSize={'small'} />,
	},
	{
		name: '커뮤니티',
		icon: <ForumRounded fontSize={'small'} />,
	},
	{
		name: '부서보고',
		icon: <AssignmentRounded fontSize={'small'} />,
	},
];

export default function Sidebar(props: propsType) {
	const { drawerOpen, headerHeight } = props;

	return (
		<Paper
			elevation={3}
			component='nav'
			sx={{
				width: drawerOpen ? '19rem' : '4.5rem',
				height: '100%',
				transition: 'all easeInOut 0.4s',
				zIndex: 500,
			}}
		>
			<Box sx={{ width: '100%', height: headerHeight }}></Box>
			<Box className='w-100' sx={{ overflowX: 'hidden', overscrollBehaviorY: 'auto', height: `calc(100% - ${headerHeight})` }}>
				<List className='w-100' component='div' disablePadding>
					{navList.map((value, idx) => (
						<Fragment key={`${idx}_${value.name}`}>
							<ListItemButton className='nav-depth-1' sx={{ height: drawerOpen ? 'auto' : '3rem' }}>
								<Box sx={{ padding: '0.5rem' }}>{value.icon} </Box>
								<Fade in={drawerOpen} easing={'easeInOut'} timeout={200}>
									<ListItemText primary={value.name} className={'transition-3'} sx={{ marginLeft: '0.25rem' }} />
								</Fade>
								<Fade in={drawerOpen} easing={'easeInOut'} timeout={200}>
									<ExpandMoreRounded />
								</Fade>
							</ListItemButton>

							<Collapse in={false} timeout='auto' unmountOnExit>
								<List component='div' disablePadding>
									<ListItemButton className='nav-depth-2'>
										<ListItemText primary='Starred' />
									</ListItemButton>
								</List>
							</Collapse>
						</Fragment>
					))}
				</List>
			</Box>
		</Paper>
	);
}
