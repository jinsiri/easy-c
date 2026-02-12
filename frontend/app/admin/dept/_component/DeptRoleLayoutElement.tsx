'use client';

import { Button, FormControl, Grid, IconButton, MenuItem, Select, SelectChangeEvent, Stack, Typography, useTheme } from '@mui/material';
import { Add, ArrowBack, Remove, Reorder, SaveAlt } from '@mui/icons-material';
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';
import { RANK_TEMPLATES, RANK_CATEGORY_INFO, RoleCategory } from '@/constant/deptConst';
import { ColDef, RowDragEndEvent } from 'ag-grid-community';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { deptService } from '@/app/services/deptService';
import { useRouter } from 'next/navigation';
import { AgGridReact } from 'ag-grid-react';
import { useDialogStore } from '@/store/useDialogStore';
import useRefreshStore from '@/store/useRefreshStore';

const templateColDefs: ColDef<Record<string, any>>[] = [
	{ field: 'deptRoleNm', headerName: '명칭' },
	{ field: 'deptRoleCode', headerName: '코드' },
];

const deptRoleColDefs: ColDef<Record<string, any>>[] = [
	{ field: 'deptRoleNm', headerName: '명칭' },
	{ field: 'deptRoleCode', headerName: '코드' },
	{ field: 'userCount', headerName: '사용멤버(명)' },
];

type SubCategoryType = string;

interface DeptRoleLayoutElementProps {
	category: RoleCategory;
}

export default function DeptRoleLayoutElement({ category }: DeptRoleLayoutElementProps) {
	const { alert } = useDialogStore();
	const router = useRouter();
	const theme = useTheme();
	const refreshTicket = useRefreshStore((state) => state.refreshTicket);
	const categoryName = RANK_CATEGORY_INFO[category];
	const subCategories = RANK_TEMPLATES[category].subTypes;
	const gridRef = useRef<AgGridReact>(null);
	const templateRef = useRef<AgGridReact>(null);
	const [activeSubCategory, setActiveSubCategory] = useState<SubCategoryType>('OFFICE');
	const [activeCategoryData, setActiveCategoryData] = useState<any[]>([]);
	const [isReorderMode, setIsReorderMode] = useState(false);
	const [initialOrder, setInitialOrder] = useState<number[]>([]);

	const getCategoryData = useCallback(async (category: RoleCategory) => {
		const categoryConfig = {
			POSITION: {
				api: deptService.getJobPositions,
				nameKey: 'jobPositionNm',
				codeKey: 'jobPositionCode',
			},
			TITLE: {
				api: deptService.getJobTitles,
				nameKey: 'jobTitleNm',
				codeKey: 'jobTitleCode',
			},
			GRADE: {
				api: deptService.getJobGrades,
				nameKey: 'jobGradeNm',
				codeKey: 'jobGradeCode',
			},
		} as const;

		const config = categoryConfig[category];
		const res = await config.api();

		setActiveCategoryData(
			res.map((el: any) => ({
				...el,
				deptRoleNm: el[config.nameKey],
				deptRoleCode: el[config.codeKey],
				userCount: el.userCount ?? 0,
			})),
		);
	}, []);

	useEffect(() => {
		const firstSubKey = Object.keys(RANK_TEMPLATES[category].subTypes)[0];
		setActiveSubCategory(firstSubKey);
		getCategoryData(category);
	}, [category, getCategoryData]);

	useEffect(() => {
		if (refreshTicket > 0) {
			getCategoryData(category);
		}
	}, [refreshTicket, category]);

	const toggleReorderMode = () => {
		if (isReorderMode) {
			handleSaveOrder();
		}
		setIsReorderMode(!isReorderMode);
	};

	const handleSaveOrder = async () => {
		if (!gridRef.current?.api) return;

		const updatedRows: any[] = [];
		gridRef.current.api.forEachNode((node: any) => updatedRows.push(node.data));

		const reorderConfig = {
			POSITION: { api: deptService.updateJobPositionLevels, domain: 'jobPosition' },
			TITLE: { api: deptService.updateJobTitleLevels, domain: 'jobTitle' },
			GRADE: { api: deptService.updateJobGradeLevels, domain: 'jobGrade' },
		} as const;

		const { api, domain } = reorderConfig[category];
		const currentOrderIds = updatedRows.map((row) => row[`${domain}Id`]);

		if (JSON.stringify(initialOrder) === JSON.stringify(currentOrderIds)) {
			setIsReorderMode(false);
			return;
		}

		const payload = updatedRows.map((row, index) => ({
			[`${domain}Id`]: row[`${domain}Id`],
			[`${domain}Level`]: index + 1,
		}));

		await api(payload);
		await alert('순서가 성공적으로 변경되었습니다.');
		getCategoryData(category);
		setIsReorderMode(false);
	};

	const handleChange = (event: SelectChangeEvent) => {
		setActiveSubCategory(event.target.value as SubCategoryType);
	};

	const goToAddRolePage = (categoryName: RoleCategory) => {
		router.push(`/admin/dept/role/${categoryName.toLowerCase()}/add`);
	};

	const deleteRoles = async (category: RoleCategory) => {
		const selectedRows = gridRef.current?.api.getSelectedRows() || [];
		if (selectedRows.length === 0) return alert('삭제할 항목을 선택해주세요.');

		const deleteConfig = {
			POSITION: { api: deptService.deleteJobPositions, idKey: 'jobPositionId' },
			TITLE: { api: deptService.deleteJobTitles, idKey: 'jobTitleId' },
			GRADE: { api: deptService.deleteJobGrades, idKey: 'jobGradeId' },
		} as const;

		const { api, idKey } = deleteConfig[category];
		const ids = selectedRows.map((row: any) => row[idKey]);

		await api({ ids });
		alert('삭제되었습니다.');
		getCategoryData(category);
	};

	const saveTemplates = async (category: RoleCategory) => {
		const selectedRows = templateRef.current?.api.getSelectedRows() || [];
		if (selectedRows.length === 0) return alert('추가할 항목을 선택해주세요.');

		const templateConfig = {
			POSITION: { api: deptService.saveJobPositionTemplates, domain: 'jobPosition' },
			TITLE: { api: deptService.saveJobTitleTemplates, domain: 'jobTitle' },
			GRADE: { api: deptService.saveJobGradeTemplates, domain: 'jobGrade' },
		} as const;

		const { api, domain } = templateConfig[category];
		const data = selectedRows.map((row: any) => ({
			...row,
			[`${domain}Nm`]: row.deptRoleNm,
			[`${domain}Code`]: row.deptRoleCode,
		}));

		await api(data);
		alert('추가되었습니다.');
		getCategoryData(category);
	};

	const currentData = useMemo(() => {
		return RANK_TEMPLATES[category].subTypes[activeSubCategory]?.list || [];
	}, [category, activeSubCategory]);

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
								<Button variant='outlined' size='small' startIcon={<Add />} onClick={() => goToAddRolePage(category)}>
									추가
								</Button>
							</Stack>
							<Stack>
								<Button variant='outlined' size='small' startIcon={<Remove />} onClick={() => deleteRoles(category)}>
									삭제
								</Button>
							</Stack>
							<Stack>
								<Button variant='outlined' size='small' startIcon={isReorderMode ? <SaveAlt /> : <Reorder />} onClick={toggleReorderMode}>
									{isReorderMode ? '순서바꾸기 완료' : '순서바꾸기'}
								</Button>
							</Stack>
						</Stack>
					</Grid>
				</Grid>
				<CustomAgGridComp
					ref={gridRef}
					rowData={activeCategoryData}
					colDefs={deptRoleColDefs}
					rowSelectionMode={'multiple'}
					pagination={false}
					isReorderMode={isReorderMode}
					animateRows={true}
				/>
			</Grid>
			<Grid
				size={{
					xs: 12,
					lg: 1,
				}}
				sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
			>
				<IconButton className={'contained-primary light'} sx={{ ml: 1 }} onClick={() => saveTemplates(category)}>
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
				<CustomAgGridComp ref={templateRef} rowData={currentData} colDefs={templateColDefs} rowSelectionMode={'multiple'} pagination={false} />
			</Grid>
		</Grid>
	);
}
