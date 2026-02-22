'use client';

import { Box, Button, Grid, IconButton, List, ListItem, Stack, Typography, useTheme } from '@mui/material';
import { AddCircleOutline, Edit, RemoveCircleOutline } from '@mui/icons-material';
import { DeptResponseDto } from '@/type/dept';
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import CommonTabs from '@/app/_component/CommonTabs';
import CommonTreeview from '@/app/_component/Tree';
import { useRouter } from 'next/navigation';
import AdminDeptDetailView from '@/app/admin/dept/list/AdminDeptDetailView';
import { useEffect, useState } from 'react';
import axiosConfig from '@/app/_lib/axiosConfig';
import { useDialogStore } from '@/store/useDialogStore';
import { useDeptForm } from '@/app/admin/dept/_component/hooks/useDeptForm';
import DeptForm from '@/app/admin/dept/_component/DeptForm';
import useRefreshStore from '@/store/useRefreshStore';

interface Props {
	dbData: DeptResponseDto[];
}

type InfoItem = {
	label: string;
	value: React.ReactNode;
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

function InfoList({ items, handleEdit }: { items: InfoItem[]; handleEdit: () => void }) {
	return (
		<List disablePadding>
			{items.map(({ label, value }) => (
				<ListItem key={label} disableGutters disablePadding sx={{ mb: 1 }}>
					<Stack direction='row' spacing={2} alignItems='center' width='100%'>
						<Typography variant='body2' color='text.primary' sx={{ minWidth: 216 }}>
							{label}
						</Typography>

						<Typography variant='body2'>
							{value}
							<IconButton sx={{ ml: 1 }} onClick={handleEdit}>
								<Edit fontSize={'small'} />
							</IconButton>
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

	return isEdit ? <EditDeptForm deptId={deptId} handleEdit={handleEdit} /> : <InfoList items={items} handleEdit={handleEdit} />;
}

const mapDeptToTree = (dept: DeptResponseDto) => ({
	...dept,
	id: dept.deptId,
	label: dept.deptNm,
});

export default function AdminDeptListView({ dbData }: Props) {
	const router = useRouter();
	const theme = useTheme();
	const refreshTicket = useRefreshStore((state) => state.refreshTicket);
	const rootId = dbData?.[0]?.deptId ? String(dbData[0].deptId) : null;
	const { success, danger } = useDialogStore();
	const [selectedDept, setSelectedDept] = useState<DeptResponseDto>(dbData?.[0]);
	const [expandedIds, setExpandedIds] = useState<string[]>(rootId ? [rootId] : []);

	const deptTabs = [
		{
			label: '부서 정보',
			content: (
				<Box sx={{ p: '1rem 1.5rem' }}>
					<DeptManageComp
						deptId={selectedDept?.deptId}
						items={[
							{ label: '부서명(한글)', value: selectedDept?.deptNm ?? '부서 미선택' },
							{ label: '부서메일아이디', value: selectedDept?.deptEmail ?? '-' },
							{ label: '부서코드', value: selectedDept?.deptCode ?? '-' },
							{ label: '부서 약어', value: selectedDept?.deptShortNm ?? '-' },
						]}
					/>
				</Box>
			),
		},
		{ label: '부서원 목록', content: <AdminDeptDetailView deptId={1} /> },
	];

	const deleteDept = async (deptId: number) => {
		await axiosConfig.delete(`/api/dept/${deptId}`);
	};

	const handleDelete = async (deptId: number) => {
		const isConfirmed = await danger('정말 이 부서를 삭제하시겠습니까? 삭제 시 하위부서도 삭제됩니다.');

		if (isConfirmed) {
			await deleteDept(deptId);
			await success('부서가 정상적으로 삭제되었습니다.');

			setSelectedDept(dbData.find((dept) => dept.deptId === selectedDept.deptId) ?? dbData[0]);

			router.refresh();
		}
	};

	useEffect(() => {
		if (dbData?.length > 0 && expandedIds.length === 0) {
			setExpandedIds([String(dbData[0].deptId)]);
		}

		const updatedDept = dbData.find((d) => d.deptId === selectedDept?.deptId);
		if (updatedDept) {
			setSelectedDept(updatedDept);
		} else {
			setSelectedDept(dbData[0]);
		}
	}, [dbData]);

	useEffect(() => {
		if (refreshTicket > 0) {
			router.refresh();
		}
	}, [refreshTicket]);

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
							<IconButton className='contained-primary light' onClick={() => router.push(`/admin/dept/list/new?parentId=${selectedDept.deptId}`)}>
								<AddCircleOutline className='svg-small' />
							</IconButton>
							{selectedDept.deptId && selectedDept.deptId !== 1 && (
								<IconButton className='contained-primary light' onClick={() => handleDelete(selectedDept.deptId)}>
									<RemoveCircleOutline className='svg-small' />
								</IconButton>
							)}
						</Stack>
					</Box>

					<Box sx={{ flexGrow: 1, padding: '1.125rem', borderRadius: '1rem', bgcolor: '#fff' }}>
						<CommonTreeview
							rawData={dbData || []}
							mapEntityToTree={mapDeptToTree}
							expandedIds={expandedIds}
							onExpandedItemsChange={(ids) => setExpandedIds(ids)}
							selectedId={String(selectedDept.deptId)}
							placeholder='부서명을 검색하세요.'
							onNodeClick={(node) => {
								setSelectedDept(node);
								console.log(node);
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

					<Box sx={{ flexGrow: 1, padding: '1.125rem', borderRadius: '1rem', bgcolor: '#fff' }}>
						<Stack alignItems={'flex-end'} sx={{ mb: 2 }}>
							<Stack direction={'row'} spacing={1}>
								<Button variant='outlined'>부서원 추가</Button>
								<Button variant='outlined'>일괄 등록</Button>
							</Stack>
						</Stack>
						<CommonTabs tabs={deptTabs} />
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}
