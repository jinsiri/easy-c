'use client';

import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import Link from 'next/link';
import secureLocalStorage from 'react-secure-storage';

/** MUI */
import { Box, Button, IconButton, Paper, Stack, Popper, Fade, List, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import { FormatIndentIncrease, PersonOutlineRounded, LoginRounded, LogoutRounded, ManageAccountsRounded, ContactsRounded } from '@mui/icons-material';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import { authService } from '@/app/services/authService';
import { useRouter } from 'next/navigation';

interface propsType {
	drawerOpen: boolean;
	setDrawerOpen: Dispatch<SetStateAction<boolean>>;
	headerHeight: string;
}

export default function Header(props: propsType) {
	const router = useRouter();

	const { drawerOpen, setDrawerOpen, headerHeight } = props;
	const [loginId, setLoginId] = useState<string | null>(null);
	const [memberRole, setMemberRole] = useState<string | null>(null);

	useEffect(() => {
		setLoginId(secureLocalStorage.getItem('loginId') as string | null);
		setMemberRole(secureLocalStorage.getItem('memberRole') as string | null);
	}, []);

	const onClickDrawerButton = () => {
		setDrawerOpen(!drawerOpen);
	};

	const handleLogout = async () => {
		try {
			if (loginId) {
				await authService.logout();

				// 토큰 저장 위치에 따라
				localStorage.clear();
				secureLocalStorage.clear();
			}
		} catch (e) {
			console.error(e);
		} finally {
			router.replace('/login');
		}
	};

	const list = [
		{ title: '내 정보', icon: <ContactsRounded />, component: Link, url: '/humanResources/user' },
		{ title: loginId ? '로그아웃' : '로그인', icon: loginId ? <LogoutRounded /> : <LoginRounded />, component: 'button', onClick: handleLogout },
	];

	return (
		<Paper
			elevation={2}
			sx={{
				flexShrink: 0,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				position: 'relative',
				width: '100%',
				height: headerHeight,
				padding: '0 1rem',
				borderRadius: 0,
				zIndex: 100,
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<IconButton className='contained-primary ' onClick={onClickDrawerButton}>
					<FormatIndentIncrease className='svg-small' />
				</IconButton>
			</Box>
			<Box>
				<Stack direction={'row'} spacing={'0.75rem'} sx={{ height: '100%', alignItems: 'center' }}>
					{memberRole && memberRole === 'ROLE_ADMIN' && (
						<Button component={Link} href='/admin/dept/list' target={'_blank'} variant='outlined' startIcon={<ManageAccountsRounded />}>
							관리자 모드
						</Button>
					)}

					<PopupState variant='popper' popupId='demo-popup-popper'>
						{(popupState) => (
							<div>
								<IconButton className='circle-primary' {...bindToggle(popupState)}>
									<PersonOutlineRounded />
								</IconButton>
								<Popper {...bindPopper(popupState)} placement='bottom-end' transition sx={{ zIndex: 500 }}>
									{({ TransitionProps }) => (
										<Fade {...TransitionProps} timeout={350}>
											<Paper sx={{ position: 'relative', bgcolor: 'background.default' }} elevation={3}>
												<List>
													{list.map((item) => {
														return (
															<ListItemButton
																key={item.title}
																component={item.component as any}
																{...(item.component === Link && item.url ? { href: item.url } : {})}
																sx={{ width: '100%' }}
																onClick={() => {
																	if (item.onClick) item.onClick();
																	popupState.close();
																}}
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
