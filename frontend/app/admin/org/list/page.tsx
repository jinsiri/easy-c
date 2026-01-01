'use client';

/** MUI */
import { Box, Fade, Grid, IconButton, Paper, Popper, Stack, Typography } from '@mui/material';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import SettingLayoutElement from '@/app/_component/layoutElement/SettingLayoutElement';
import { AddCircleOutline, PersonOutlineRounded, RemoveCircleOutline } from '@mui/icons-material';
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

export default function AdminOrgListPage() {
	return (
		<>
			<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
				<PathBreadcrumbs />
				<Box component={'section'} sx={{ width: '100%', marginBottom: '1.5rem' }}>
					<Typography variant='h5' sx={{ fontWeight: '800' }}>
						조직설계
					</Typography>
				</Box>
				<Grid container spacing={4} sx={{ flexGrow: 1, width: '100%', height: '100%' }}>
					<Grid size={3} sx={{ display: 'flex', flexDirection: 'column' }}>
						<SettingLayoutElement subtitle='조직도'>
							<Box>
								<Stack direction={'row'} spacing={'0.75rem'} sx={{ height: '100%', alignItems: 'center' }}>
									<IconButton className='contained-primary'>
										<AddCircleOutline className='svg-small' />
									</IconButton>
									<IconButton className='contained-primary'>
										<RemoveCircleOutline className='svg-small' />
									</IconButton>
									<PopupState variant='popper' popupId='demo-popup-popper'>
										{(popupState) => (
											<div>
												<IconButton className='circle-primary' {...bindToggle(popupState)}>
													<PersonOutlineRounded />
												</IconButton>
												<Popper {...bindPopper(popupState)} placement='bottom-end' transition>
													{({ TransitionProps }) => (
														<Fade {...TransitionProps} timeout={350}>
															<Paper>.</Paper>
														</Fade>
													)}
												</Popper>
											</div>
										)}
									</PopupState>
								</Stack>
							</Box>
						</SettingLayoutElement>
					</Grid>
					<Grid size={9} sx={{ display: 'flex', flexDirection: 'column' }}>
						<SettingLayoutElement subtitle='조직명'>
							탭버튼
							<>부서 정보</>
						</SettingLayoutElement>
					</Grid>
				</Grid>
			</Box>
		</>
	);
}
