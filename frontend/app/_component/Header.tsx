import { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';

/** MUI */
import { Box, IconButton, Paper, Stack, Popper, Fade, List, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { FormatIndentIncrease, PersonOutlineRounded, LogoutRounded, ManageAccountsRounded, AssignmentIndRounded } from '@mui/icons-material';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';

interface propsType {
	drawerOpen: boolean;
	setDrawerOpen: Dispatch<SetStateAction<boolean>>;
	headerHeight: string;
}

const list = [
	{ title: '관리자 모드', icon: <ManageAccountsRounded />, component: Link, url: '/admin/normal/setting' },
	{ title: '내 인사정보', icon: <AssignmentIndRounded />, component: Link, url: '/management/user' },
	{ title: '로그아웃', icon: <LogoutRounded />, component: 'span', url: undefined },
];

export default function Header(props: propsType) {
	const { drawerOpen, setDrawerOpen, headerHeight } = props;

	const onClickDrawerButton = () => {
		setDrawerOpen(!drawerOpen);
	};

	return (
		<Paper
			elevation={2}
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				width: '100%',
				height: headerHeight,
				padding: '0 1rem',
				borderRadius: 0,
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<IconButton className='contained-primary ' onClick={onClickDrawerButton}>
					<FormatIndentIncrease className='svg-small' />
				</IconButton>
			</Box>
			<Box>
				<Stack direction={'row'} spacing={'0.75rem'} sx={{ height: '100%', alignItems: 'center' }}>
					<IconButton className='contained-primary'>
						<FormatIndentIncrease className='svg-small' />
					</IconButton>
					<IconButton className='contained-primary'>
						<FormatIndentIncrease className='svg-small' />
					</IconButton>
					<IconButton className='contained-primary'>
						<FormatIndentIncrease className='svg-small' />
					</IconButton>
					{/*<IconButton className='circle-primary'>
						<PersonOutlineRounded />
					</IconButton>*/}
					<PopupState variant='popper' popupId='demo-popup-popper'>
						{(popupState) => (
							<div>
								<IconButton className='circle-primary' {...bindToggle(popupState)}>
									<PersonOutlineRounded />
								</IconButton>
								<Popper {...bindPopper(popupState)} placement='bottom-end' transition>
									{({ TransitionProps }) => (
										<Fade {...TransitionProps} timeout={350}>
											<Paper>
												<List>
													{list.map((item) => {
														return (
															<ListItemButton
																key={item.title}
																component={item.component}
																{...(item.component === Link ? { to: item.url } : item.url ? { href: item.url } : {})}
															>
																<ListItemIcon>{item.icon}</ListItemIcon>
																<ListItemText primary={item.title} sx={{ marginRight: '1rem' }} />
															</ListItemButton>
														);
													})}
												</List>
											</Paper>
										</Fade>
									)}
								</Popper>
							</div>
						)}
					</PopupState>
				</Stack>
			</Box>
		</Paper>
	);
}
