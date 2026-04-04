import { useRef, useState, useMemo } from 'react';
import { Box, Checkbox, Chip, FormControlLabel, Grid, IconButton, MenuItem, Select, Typography, useMediaQuery, useTheme } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { ArrowDownward, ArrowForward } from '@mui/icons-material';

import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import CommonTreeview from '@/app/_component/Tree';
import { useDeptTreeStore } from '@/store/useDeptTreeStore';
import { mapDeptToTree } from '@/app/admin/dept/_utils/deptUtil';

interface Props {
	onClose: () => void;
	deptList: any[];
	jobTitleList: any[];
	initialDeptMaps: any[];
	setDeptMemberMap: any;
}

export default function DeptJobTitleChangeDialog({ onClose, deptList, jobTitleList, initialDeptMaps, setDeptMemberMap }: Props) {
	const theme = useTheme();
	const isDownMd = useMediaQuery(theme.breakpoints.down('md'));
	const minId = Math.min(0, ...initialDeptMaps.map((m) => Number(m.deptMemberMapId)).filter((id) => id < 0));
	const addedElIdxRef = useRef<number>(minId - 1);
	const { expandedIds, setExpandedIds } = useDeptTreeStore();
	const [updatedList, setUpdatedList] = useState<any[]>(initialDeptMaps);
	const [editingId, setEditingId] = useState<string | number | null>(null);
	const [selection, setSelection] = useState({
		deptId: null as number | null,
		deptNm: '',
		jobTitleId: '',
		jobTitleNm: '',
		isPrimary: false,
	});

	const addedDeptIds = useMemo(() => updatedList.map((item) => String(item.deptId)), [updatedList]);

	const handleSave = () => {
		setDeptMemberMap('deptMemberMapList', updatedList);
		onClose();
	};

	const handleJobTitleChange = (e: SelectChangeEvent) => {
		const titleId = e.target.value;
		const targetTitle = jobTitleList.find((t) => t.jobTitleId === titleId);

		setSelection((prev) => ({
			...prev,
			jobTitleId: titleId,
			jobTitleNm: targetTitle ? targetTitle.jobTitleNm : '',
		}));
	};

	const resetSelection = () => {
		setSelection({ deptId: null, deptNm: '', jobTitleId: '', jobTitleNm: '', isPrimary: false });
		setEditingId(null);
	};

	const selectAddedDeptMemberMap = (deptMemberMapId: string | number) => {
		const targetMap = updatedList.find((m) => m.deptMemberMapId === deptMemberMapId);
		if (!targetMap) return;

		setEditingId(deptMemberMapId);
		setSelection({
			deptId: targetMap.deptId,
			deptNm: targetMap.deptNm,
			jobTitleId: targetMap.jobTitleId || '',
			jobTitleNm: targetMap.jobTitleNm || '',
			isPrimary: targetMap.isPrimary,
		});
	};

	const handleAddOrUpdate = () => {
		if (!selection.deptId) return;

		if (editingId) {
			setUpdatedList((prev) => prev.map((item) => (item.deptMemberMapId === editingId ? { ...item, ...selection } : item)));
		} else {
			setUpdatedList((prev) => [
				...prev,
				{
					deptMemberMapId: addedElIdxRef.current--,
					...selection,
				},
			]);
		}
		resetSelection();
	};

	const removeMap = (id: string | number) => {
		setUpdatedList((prev) => {
			const target = prev.find((m) => m.deptMemberMapId === id);
			if (!target) return prev;

			if (typeof id === 'number' && id < 0) {
				return prev.filter((m) => m.deptMemberMapId !== id);
			}

			return prev.map((m) => (m.deptMemberMapId === id ? { ...m, deleted: true } : m));
		});

		if (editingId === id) {
			resetSelection();
		}
	};

	return (
		<BaseDialog title='부서/직책 설정' confirmLabel='확인' onConfirm={handleSave} onClose={onClose} maxWidth='md' fullWidth>
			<Grid container spacing={4} alignItems='stretch'>
				<Grid size={{ xs: 12, md: 5 }}>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
						<Box>
							<Typography variant='h6' sx={{ mb: 1.5 }}>
								부서 선택
								<Box component='span' sx={{ color: 'error.main' }}>
									*
								</Box>
							</Typography>
							<CommonTreeview
								rawData={deptList || []}
								mapEntityToTree={mapDeptToTree}
								expandedIds={expandedIds}
								onExpandedItemsChange={setExpandedIds}
								selectedId={String(selection.deptId)}
								disabledIds={addedDeptIds}
								onNodeClick={(node) => {
									setSelection((prev) => ({ ...prev, deptId: node.deptId, deptNm: node.deptNm }));
								}}
							/>
						</Box>

						<Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 3 }}>
							{!selection.deptId && (
								<Box
									sx={{
										zIndex: 2,
										position: 'absolute',
										top: 0,
										right: 0,
										bottom: 0,
										left: 0,
										background: theme.palette.background.paper,
										opacity: 0.9,
									}}
								>
									<Typography variant={'h6'}>먼저 부서를 선택하세요.</Typography>
								</Box>
							)}

							<Box>
								<Typography variant='h6' sx={{ mb: 1.5 }}>
									직책 선택
								</Typography>
								<Select displayEmpty fullWidth value={selection.jobTitleId} onChange={handleJobTitleChange}>
									<MenuItem value=''>
										<em style={{ color: '#aaa' }}>미선택</em>
									</MenuItem>
									{jobTitleList?.map((opt) => (
										<MenuItem key={'jobTitle_' + opt.jobTitleId} value={opt.jobTitleId}>
											{opt.jobTitleNm}
										</MenuItem>
									))}
								</Select>
							</Box>

							<Box>
								<Typography variant='h6' sx={{ mb: 0.5 }}>
									대표부서 여부 선택
								</Typography>
								<FormControlLabel
									control={
										<Checkbox
											size='small'
											checked={selection.isPrimary}
											onChange={(e) => setSelection((prev: any) => ({ ...prev, isPrimary: e.target.checked }))}
										/>
									}
									color='primary'
									label='대표부서입니다.'
								/>
							</Box>
						</Box>
					</Box>
				</Grid>

				<Grid size={{ xs: 12, md: 2 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<IconButton
						className={selection.deptId ? 'contained-primary' : 'contained-primary disabled'}
						sx={{ ml: 1 }}
						disabled={!selection.deptId}
						onClick={handleAddOrUpdate}
					>
						{isDownMd ? <ArrowDownward /> : <ArrowForward />}
					</IconButton>
				</Grid>

				<Grid size={{ xs: 12, md: 5 }}>
					<Typography variant='h6' sx={{ mb: 1.5 }}>
						연결된 부서-직책
					</Typography>
					<Box sx={{ minHeight: '200px', p: 2, border: '1px dashed #ccc', borderRadius: 2 }}>
						{updatedList.length === 0 && (
							<Typography variant='body2' color='text.secondary' sx={{ textAlign: 'center', mt: 4 }}>
								선택된 항목이 없습니다.
							</Typography>
						)}
						{updatedList
							.filter((m) => !m.deleted)
							.map((m) => {
								const isThisEditing = editingId === m.deptMemberMapId;
								return (
									<Chip
										key={'memberMap_' + m.deptMemberMapId}
										label={`${m.deptNm}${m.jobTitleNm ? ` - ${m.jobTitleNm}` : ''} ${isThisEditing ? '(수정중)' : ''}`}
										color={'primary'}
										variant={isThisEditing ? 'filled' : 'outlined'}
										onClick={() => selectAddedDeptMemberMap(m.deptMemberMapId)}
										onDelete={() => removeMap(m.deptMemberMapId)}
										sx={{
											m: 0.5,
											transition: 'all 0.2s ease-in-out',
										}}
									/>
								);
							})}
					</Box>
				</Grid>
			</Grid>
		</BaseDialog>
	);
}
