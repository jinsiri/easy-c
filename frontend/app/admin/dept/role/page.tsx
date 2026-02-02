'use client';

/** MUI */
import { Box, Button, FormControl, Grid, IconButton, MenuItem, Select, SelectChangeEvent, Stack, Typography, useTheme } from '@mui/material';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import CommonTabs from '@/app/_component/CommonTabs';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';
import { ColDef, GridOptions } from 'ag-grid-community';
import { Add, ArrowBack, Remove, Reorder } from '@mui/icons-material';
import { useMemo, useState } from 'react';
import { ALL_POSITIONS, JobFieldType } from '@/constant/positionConst';

const positionTemplateColDefs: ColDef<Record<string, any>>[] = [
	{ field: 'positionNm', headerName: '명칭', editable: false },
	{ field: 'positionCode', headerName: '코드', editable: false },
];

const positionColDefs: ColDef<Record<string, any>>[] = [
	{ field: 'positionNm', headerName: '명칭', editable: false },
	{ field: 'positionCode', headerName: '코드', editable: false },
	{ field: 'positionCount', headerName: '사용멤버(명)', editable: false },
];

const dummyPosition: Record<string, any>[] = [
	{
		positionNm: '회장',
		positionCode: '001',
		positionCount: 0,
	},
];

const dutyTemplate: Record<string, any>[] = [
	{ positionNm: '대표이사', positionCode: 'DU0010' },
	{ positionNm: '팀장', positionCode: 'DU0020' },
	{ positionNm: '팀원', positionCode: 'DU0030' },
	{ positionNm: '부팀장', positionCode: 'DU0040' },
	{ positionNm: '파트장', positionCode: 'DU0050' },
	{ positionNm: '부서장', positionCode: 'DU0060' },
	{ positionNm: '실장', positionCode: 'DU0070' },
	{ positionNm: '본부장', positionCode: 'DU0080' },
	{ positionNm: '그룹장', positionCode: 'DU0090' },
	{ positionNm: '부문장', positionCode: 'DU0100' },
	{ positionNm: 'CEO', positionCode: 'DU0110' },
	{ positionNm: 'COO', positionCode: 'DU0120' },
	{ positionNm: 'CFO', positionCode: 'DU0130' },
	{ positionNm: 'CTO', positionCode: 'DU0140' },
	{ positionNm: 'CIO', positionCode: 'DU0150' },
	{ positionNm: 'CMO', positionCode: 'DU0160' },
	{ positionNm: '연구소장', positionCode: 'DU0170' },
	{ positionNm: '사업부장', positionCode: 'DU0180' },
	{ positionNm: '전문임원', positionCode: 'DU0190' },
	{ positionNm: '지사장', positionCode: 'DU0200' },
	{ positionNm: '소장', positionCode: 'DU0210' },
	{ positionNm: '담당', positionCode: 'DU0220' },
	{ positionNm: '점장', positionCode: 'DU0230' },
	{ positionNm: '지점장', positionCode: 'DU0240' },
	{ positionNm: '센터장', positionCode: 'DU0250' },
	{ positionNm: '공장장', positionCode: 'DU0260' },
	{ positionNm: '법인장', positionCode: 'DU0270' },
	{ positionNm: 'PD', positionCode: 'DU0280' },
	{ positionNm: 'PM', positionCode: 'DU0290' },
];

export default function AdminDeptRolePage() {
	const theme = useTheme();

	const [jobField, setJobField] = useState<JobFieldType>('OFFICE');

	const handleChange = (event: SelectChangeEvent) => {
		setJobField(event.target.value as JobFieldType);
	};

	const dataRowSelection: GridOptions['rowSelection'] = useMemo(() => {
		return {
			mode: 'multiRow',
			checkboxes: true,
			enableClickSelection: true,
			headerCheckbox: false,
		};
	}, []);

	const templateRowSelection: GridOptions['rowSelection'] = useMemo(() => {
		return {
			mode: 'multiRow',
			checkboxes: true,
			enableClickSelection: true,
			headerCheckbox: true,
		};
	}, []);

	const roleTabs = [
		{
			label: '직위',
			type: 'grid',
			content: (
				<>
					<Grid container direction={'row'} spacing={2} sx={{ flexGrow: 1, width: '100%', p: 2 }}>
						<Grid
							size={{
								xs: 12,
								lg: 8,
							}}
							sx={{ display: 'flex', flexDirection: 'column' }}
						>
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
							<CustomAgGridComp rowData={dummyPosition} colDefs={positionColDefs} rowSelection={dataRowSelection} pagination={false} />
						</Grid>
						<Grid
							size={{
								xs: 12,
								lg: 1,
							}}
							sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
						>
							<IconButton className={'contained-primary light'} sx={{ ml: 1 }}>
								<ArrowBack fontSize={'small'} />
							</IconButton>
						</Grid>
						<Grid
							size={{
								xs: 12,
								lg: 3,
							}}
						>
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
													value={jobField}
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
													{Object.entries(ALL_POSITIONS).map(([key, value]) => (
														<MenuItem key={key} value={key}>
															{value.label}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</Stack>
									</Stack>
								</Grid>
							</Grid>
							<CustomAgGridComp
								rowData={ALL_POSITIONS[jobField].list}
								colDefs={positionTemplateColDefs}
								rowSelection={templateRowSelection}
								pagination={false}
							/>
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
