'use client';

import { Button, FormControl, Grid, IconButton, MenuItem, Select, SelectChangeEvent, Stack, Typography, useTheme } from '@mui/material';
import { Add, ArrowBack, Remove, Reorder } from '@mui/icons-material';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';
import { RANK_TEMPLATES, RANK_CATEGORY_INFO, RankCategory } from '@/constant/deptConst';
import { ColDef } from 'ag-grid-community';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { deptService } from '@/app/services/deptService';
import { useRouter } from 'next/navigation';

const templateColDefs: ColDef<Record<string, any>>[] = [
	{ field: 'deptRankNm', headerName: '명칭', editable: false },
	{ field: 'deptRankCode', headerName: '코드', editable: false },
];

const deptRankColDefs: ColDef<Record<string, any>>[] = [
	{ field: 'deptRankNm', headerName: '명칭', editable: false },
	{ field: 'deptRankCode', headerName: '코드', editable: false },
	{ field: 'userCount', headerName: '사용멤버(명)', editable: false },
];

type SubCategoryType = string;

interface DeptRankLayoutElementProps {
	rankType: RankCategory;
}

export default function DeptRankLayoutElement({ rankType }: DeptRankLayoutElementProps) {
	const router = useRouter();
	const theme = useTheme();
	const categoryName = RANK_CATEGORY_INFO[rankType];
	const subCategories = RANK_TEMPLATES[rankType].subTypes;
	const [activeSubCategory, setActiveSubCategory] = useState<SubCategoryType>('OFFICE');
	const [activeCategoryData, setActiveCategoryData] = useState<any[]>([]);

	const getRankTypeData = useCallback(async (rankType: RankCategory) => {
		const serviceMap = {
			POSITION: deptService.getJobPosition,
			TITLE: deptService.getJobTitle,
			GRADE: deptService.getJobGrade,
		} as const;

		try {
			const res = await serviceMap[rankType]();
			setActiveCategoryData(
				res.map((el) => ({
					...el,
					deptRankNm: el.jobPositionNm,
					deptRankCode: el.jobPositionCode,
					userCount: el.userCount ?? 0,
				})),
			);
		} catch (err) {
			console.error('정보 조회 실패:', err);
		}
	}, []);

	useEffect(() => {
		const firstSubKey = Object.keys(RANK_TEMPLATES[rankType].subTypes)[0];
		setActiveSubCategory(firstSubKey);
		getRankTypeData(rankType).catch(console.error);
	}, [rankType, getRankTypeData]);

	const handleChange = (event: SelectChangeEvent) => {
		setActiveSubCategory(event.target.value as SubCategoryType);
	};

	const goToAddRolePage = (categoryName: RankCategory) => {
		router.push(`/admin/dept/role/${categoryName.toLowerCase()}/add`);
	};

	const currentData = useMemo(() => {
		return RANK_TEMPLATES[rankType].subTypes[activeSubCategory]?.list || [];
	}, [rankType, activeSubCategory]);

	return (
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
						<Typography variant='h6'>{categoryName} 목록</Typography>
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
								<Button variant='outlined' size='small' startIcon={<Add />} onClick={() => goToAddRolePage(rankType)}>
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
				<CustomAgGridComp rowData={activeCategoryData} colDefs={deptRankColDefs} rowSelectionMode={'multiple'} pagination={false} />
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
										labelId='field-select-label'
										id='field-select'
										value={activeSubCategory}
										label='Field'
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
										{Object.entries(subCategories).map(([key, value]) => (
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
				<CustomAgGridComp rowData={currentData} colDefs={templateColDefs} rowSelectionMode={'multiple'} pagination={false} />
			</Grid>
		</Grid>
	);
}
