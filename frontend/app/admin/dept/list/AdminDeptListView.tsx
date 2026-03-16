'use client';

import { Box, Button, Grid, IconButton, List, ListItem, Stack, Typography, useTheme } from '@mui/material';
import { AddCircleOutline, Edit, RemoveCircleOutline } from '@mui/icons-material';
import { DeptResponseDto } from '@/type/dept';
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import CommonTabs from '@/app/_component/CommonTabs';
import CommonTreeview from '@/app/_component/Tree';
import { useRouter } from 'next/navigation';
import AdminDeptDetailView from '@/app/admin/dept/list/AdminDeptDetailView';
import { useEffect, useMemo, useState } from 'react';
import axiosConfig from '@/app/_lib/axiosConfig';
import { useDialogStore } from '@/store/useDialogStore';
import { useDeptForm } from '@/app/admin/dept/_hooks/useDeptForm';
import DeptForm from '@/app/admin/dept/_component/DeptForm';
import { useDeptTreeStore } from '@/store/useDeptTreeStore';
import { mapDeptToTree, mapOrgToTree } from '@/app/admin/dept/_utils/deptUtil';

interface Props {
	dbData: DeptResponseDto[];
}

type InfoItem = {
	label: string;
	value: React.ReactNode;
	field?: string;
};

function EditDeptForm({ deptId, handleEdit }: { deptId: number; handleEdit: () => void }) {
	const {
		control,
		formState: { errors },
		loading,
		onSubmit,
	} = useDeptForm(deptId, handleEdit);

	return (
		<>
			<DeptForm control={control} errors={errors} />
			<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
				<Button onClick={handleEdit} disabled={loading}>
					취소
				</Button>
				<Button variant='contained' onClick={onSubmit} disabled={loading}>
					{loading ? '저장 중...' : '저장'}
				</Button>
			</Box>
		</>
	);
}

function InfoList({ deptId, items, handleEdit }: { deptId: number; items: InfoItem[]; handleEdit: () => void }) {
	return (
		<List disablePadding>
			{items.map(({ label, value, field }) => (
				<ListItem key={label} disableGutters disablePadding sx={{ mb: 1 }}>
					<Stack direction='row' spacing={2} alignItems='center' width='100%'>
						<Typography variant='body2' color='text.primary' sx={{ minWidth: 216 }}>
							{label}
						</Typography>

						<Typography variant='body2'>
							{value}
							{(deptId === 1 && field === 'deptNm') || (
								<IconButton sx={{ ml: 1 }} onClick={handleEdit}>
									<Edit fontSize={'small'} />
								</IconButton>
							)}
						</Typography>
					</Stack>
				</ListItem>
			))}
		</List>
	);
}

function DeptManageComp({ deptId, items }: { deptId: number; items: InfoItem[] }) {
	const [isEdit, setIsEdit] = useState(false);

	const handleEdit = () => {
		setIsEdit(!isEdit);
	};

	return isEdit ? <EditDeptForm deptId={deptId} handleEdit={handleEdit} /> : <InfoList deptId={deptId} items={items} handleEdit={handleEdit} />;
}

export default function AdminDeptListView({ dbData }: Props) {
	const router = useRouter();
	const theme = useTheme();
	const { success, danger } = useDialogStore();
	const { expandedIds, setExpandedIds, selectedId, setSelectedId, _hasHydrated } = useDeptTreeStore();
	const rootId = dbData?.[0]?.deptId ? dbData[0].deptId : null;
	const selectedDept = dbData.find((d) => d.deptId === Number(selectedId)) ?? dbData[0];
	const flatRawData = useMemo(() => {
		const result: any[] = [];
		dbData.forEach((dept) => {
			result.push(dept);
			if (dept.deptMembers) {
				result.push(...dept.deptMembers);
			}
		});
		return result;
	}, [dbData]);

	const deptTabs = [
		{
			label: '부서 정보',
			content: (
				<Box sx={{ p: '1rem 1.5rem' }}>
					<DeptManageComp
						deptId={selectedId || 1}
						items={[
							{ label: '부서명(한글)', value: selectedDept.deptNm ?? '부서 미선택', field: 'deptNm' },
							{ label: '부서메일아이디', value: selectedDept.deptEmail ?? '-' },
							{ label: '부서코드', value: selectedDept.deptCode ?? '-' },
							{ label: '부서 약어', value: selectedDept.deptShortNm ?? '-' },
						]}
					/>
				</Box>
			),
		},
		{ label: '부서원 목록', content: <AdminDeptDetailView key={selectedId} deptId={selectedId || 1} /> },
	];

	const deleteDept = async (deptId: number) => {
		await axiosConfig.delete(`/api/dept/${deptId}`);
	};

	const handleDelete = async (deptId: number) => {
		const isConfirmed = await danger('정말 이 부서를 삭제하시겠습니까? 삭제 시 하위부서도 삭제됩니다.');

		if (!isConfirmed) return;

		const targetDept = dbData.find((d) => d.deptId === deptId);
		if (!targetDept) return;

		const parentId = targetDept.treeParentId ?? dbData[0].deptId;

		await deleteDept(deptId);
		await success('부서가 정상적으로 삭제되었습니다.');

		setSelectedId(parentId);
		router.refresh();
	};

	useEffect(() => {
		if (!_hasHydrated) return;

		if (!selectedId && rootId) {
			setSelectedId(rootId);
		}
	}, [_hasHydrated, selectedId, rootId]);

	useEffect(() => {
		if (dbData?.length > 0 && expandedIds.length === 0) {
			setExpandedIds([String(dbData[0].deptId)]);
		}

		if (selectedId) {
			const exists = dbData.some((d) => d.deptId === Number(selectedId));

			if (!exists && dbData[0]) {
				setSelectedId(dbData[0].deptId);
			}
		}
	}, [dbData]);

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				height: '100%',
				padding: '0 1.5rem',
				bgcolor: theme.palette.grey[50],
			}}
		>
			<PathBreadcrumbs />

			<Grid container spacing={3} sx={{ flexGrow: 1, width: '100%', height: '100%' }}>
				<Grid
					size={{
						xs: 12,
						md: 4,
						lg: 3,
					}}
					sx={{ display: 'flex', flexDirection: 'column' }}
				>
					<Box sx={{ display: 'flex', alignItems: 'center', mb: '1rem' }}>
						<Typography sx={{ mr: '1.5rem', fontSize: '1.125rem', fontWeight: 'bold' }}>조직도</Typography>
						<Box sx={{ flexGrow: 1, height: '1px', bgcolor: theme.palette.grey[300] }} />
					</Box>

					<Box sx={{ mb: 1 }}>
						<Stack direction={'row'} spacing={1} sx={{ alignItems: 'center' }}>
							<IconButton className='contained-primary light' onClick={() => router.push(`/admin/dept/list/new?parentId=${selectedId}`)}>
								<AddCircleOutline className='svg-small' />
							</IconButton>
							{selectedId && selectedId !== 1 && (
								<IconButton className='contained-primary light' onClick={() => handleDelete(selectedId)}>
									<RemoveCircleOutline className='svg-small' />
								</IconButton>
							)}
						</Stack>
					</Box>

					<Box sx={{ flexGrow: 1, padding: '1.125rem', borderRadius: '1rem', bgcolor: '#fff' }}>
						<CommonTreeview
							rawData={flatRawData || []}
							mapEntityToTree={mapOrgToTree}
							expandedIds={expandedIds}
							onExpandedItemsChange={(ids) => setExpandedIds(ids)}
							selectedId={String(selectedId)}
							placeholder='부서명을 검색하세요.'
							onNodeClick={(node) => {
								setSelectedId(node.deptId);
							}}
						/>
					</Box>
				</Grid>

				<Grid
					size={{
						xs: 12,
						md: 8,
						lg: 9,
					}}
					sx={{ display: 'flex', flexDirection: 'column' }}
				>
					<Box sx={{ display: 'flex', alignItems: 'center', mb: '1rem' }}>
						<Typography sx={{ mr: '1.5rem', fontSize: '1.125rem', fontWeight: 'bold' }}>{selectedDept?.deptNm ?? '부서 미선택'}</Typography>
						<Box sx={{ flexGrow: 1, height: '1px', bgcolor: theme.palette.grey[300] }} />
					</Box>

					<Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '1.125rem', borderRadius: '1rem', bgcolor: '#fff' }}>
						<Stack alignItems={'flex-end'}>
							<Stack direction={'row'} spacing={1}>
								<Button variant='outlined' onClick={() => router.push(`/admin/dept/list/assign?deptId=${selectedId}`)}>
									부서원 추가
								</Button>
								{/*<Button variant='outlined'>일괄 등록</Button>*/}
							</Stack>
						</Stack>
						<CommonTabs tabs={deptTabs} containerSx={{ display: 'flex', flexDirection: 'column', padding: '0 1.125rem' }} />
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}
