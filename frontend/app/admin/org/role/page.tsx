'use client';

/** MUI */
import { Box, Button, FormControl, Grid, IconButton, MenuItem, Select, SelectChangeEvent, Stack, Typography, useTheme } from '@mui/material';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import CommonTabs from '@/app/_component/CommonTabs';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';
import { ColDef } from 'ag-grid-community';
import { Add, ArrowBack, Remove, Reorder } from '@mui/icons-material';
import { useState } from 'react';

const positionTemplateColDefs: ColDef<Record<string, any>>[] = [
	{ field: '명칭', headerName: '명칭', editable: false },
	{ field: '코드', headerName: '코드', editable: false },
];

const positionColDefs: ColDef<Record<string, any>>[] = [
	{ field: '명칭', headerName: '명칭', editable: false },
	{ field: '코드', headerName: '코드', editable: false },
	{ field: '사용멤버(명)', headerName: '사용멤버(명)', editable: false },
];

const dummyPosition: Record<string, any>[] = [
	{
		명칭: '회장',
		코드: '001',
		'사용멤버(명)': 0,
	},
];

const positionTemplate: Record<string, any>[] = [
	{
		명칭: '회장',
		코드: '001',
	},
	{
		명칭: '대표이사',
		코드: '002',
	},
];

export default function AdminOrgRolePage() {
	const theme = useTheme();

	const [age, setAge] = useState(10);

	const handleChange = (event: SelectChangeEvent) => {
		setAge(event.target.value);
	};

	const roleTabs = [
		{
			label: '직위',
			type: 'grid',
			content: (
				<>
					<Grid container direction={'row'} spacing={2} sx={{ flexGrow: 1, width: '100%', p: 2 }}>
						<Grid size={8} sx={{ display: 'flex', flexDirection: 'column' }}>
							<Grid container justifyContent={'space-between'} alignItems={'center'}>
								<Grid>
									<Typography variant='h6'>직위 목록</Typography>
								</Grid>
								<Grid>
									<Stack
										direction='row'
										spacing={1}
										justifyContent='flex-end'
										sx={{
											mb: '.875rem',
											'& .MuiButton-startIcon svg': {
												fill: theme.palette.primary.main,
											},
										}}
									>
										<Stack>
											<Button variant='outlined' size='small' startIcon={<Add />}>
												추가
											</Button>
										</Stack>
										<Stack>
											<Button variant='outlined' size='small' startIcon={<Remove />}>
												삭제
											</Button>
										</Stack>
										<Stack>
											<Button variant='outlined' size='small' startIcon={<Reorder />}>
												순서바꾸기
											</Button>
										</Stack>
									</Stack>
								</Grid>
							</Grid>
							<CustomAgGridComp rowData={dummyPosition} colDefs={positionColDefs} />
						</Grid>
						<Grid size={1} sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
							<IconButton className={'contained-primary light'} sx={{ ml: 1 }}>
								<ArrowBack fontSize={'small'} />
							</IconButton>
						</Grid>
						<Grid size={3}>
							<Grid container justifyContent={'space-between'} alignItems={'center'} sx={{ mb: 1 }}>
								<Grid>
									<Typography variant='h6'>템플릿</Typography>
								</Grid>
								<Grid>
									<Stack direction='row' spacing={2} justifyContent='flex-end'>
										<Stack>
											<FormControl sx={{ minWidth: 120 }} size='small'>
												<Select
													labelId='demo-select-small-label'
													id='demo-select-small'
													value={age}
													label='Age'
													notched={false}
													sx={{ fontSize: '.875rem' }}
													onChange={handleChange}
													MenuProps={{
														PaperProps: {
															sx: {
																'& .MuiMenuItem-root': {
																	fontSize: '.875rem',
																},
															},
														},
													}}
												>
													<MenuItem value={10}>사무직</MenuItem>
													<MenuItem value={20}>연구직</MenuItem>
													<MenuItem value={30}>생산직</MenuItem>
												</Select>
											</FormControl>
										</Stack>
									</Stack>
								</Grid>
							</Grid>
							<CustomAgGridComp rowData={positionTemplate} colDefs={positionTemplateColDefs} />
						</Grid>
					</Grid>
				</>
			),
		},
		{
			label: '직책',
			type: 'grid',
			rowData: dummyPosition,
			colDefs: positionColDefs,
		},
		{
			label: '직급',
			type: 'grid',
			rowData: dummyPosition,
			colDefs: positionColDefs,
		},
	];

	return (
		<>
			<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem', bgcolor: theme.palette.grey[50] }}>
				<PathBreadcrumbs />
				<Box component={'section'} sx={{ width: '100%', marginBottom: '1.5rem' }}>
					<Typography variant='h5' sx={{ fontWeight: '800' }}>
						직위체계
					</Typography>
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						flexGrow: 1,
						padding: '1.125rem 0',
						borderRadius: '1rem',
						bgcolor: '#fff',
					}}
				>
					<CommonTabs
						tabs={roleTabs}
						containerSx={{
							display: 'flex',
							flexDirection: 'column',
						}}
					/>
				</Box>
			</Box>
		</>
	);
}
