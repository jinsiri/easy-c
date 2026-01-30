'use client';

import { Box, Typography, Grid, Stack, IconButton, Button, useTheme, List, ListItem } from '@mui/material';
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

interface Props {
	dbData: DeptResponseDto[];
}

type InfoItem = {
	label: string;
	value: React.ReactNode;
};

function InfoList({ items }: { items: InfoItem[] }) {
	return (
		<List disablePadding>
			{items.map(({ label, value }) => (
				<ListItem key={label} disableGutters disablePadding>
					<Stack direction='row' spacing={2} alignItems='center' width='100%'>
						<Typography variant='body2' color='text.primary' sx={{ minWidth: 216 }}>
							{label}
						</Typography>

						<Typography variant='body2'>
							{value}
							<IconButton sx={{ ml: 1 }}>
								<Edit fontSize={'small'} />
							</IconButton>
						</Typography>
					</Stack>
				</ListItem>
			))}
		</List>
	);
}

const mapDeptToTree = (dept: DeptResponseDto) => ({
	...dept,
	id: dept.deptId,
	label: dept.deptNm,
});

export default function AdminDeptListView({ dbData }: Props) {
	const router = useRouter();
	const theme = useTheme();
	const rootId = dbData?.[0]?.deptId ? String(dbData[0].deptId) : null;
	const { alert, success, danger } = useDialogStore();
	const [selectedDeptId, setSelectedDeptId] = useState<number | null>(dbData?.[0]?.deptId || null);
	const [expandedIds, setExpandedIds] = useState<string[]>(rootId ? [rootId] : []);

	const dummyDept = {
		deptNm: dbData?.[0]?.deptNm || '부서 선택 안됨',
		deptEmail: dbData?.[0]?.deptEmail || '-',
		deptCode: dbData?.[0]?.deptCode || '-',
		deptShortNm: dbData?.[0]?.deptShortNm || '-',
	};

	const deptTabs = [
		{
			label: '부서 정보',
			content: (
				<Box sx={{ p: '1rem 1.5rem' }}>
					<InfoList
						items={[
							{ label: '부서명(한글)', value: dummyDept.deptNm },
							{ label: '부서메일아이디', value: dummyDept.deptEmail },
							{ label: '부서코드', value: dummyDept.deptCode },
							{ label: '부서 약어', value: dummyDept.deptShortNm },
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
			try {
				await deleteDept(deptId);
				await success('부서가 정상적으로 삭제되었습니다.');

				const selectedDept = dbData.find((dept) => dept.deptId === selectedDeptId);
				const nextId = selectedDept?.treeParentId ?? 1;
				setSelectedDeptId(nextId);

				router.refresh();
			} catch (error) {
				await alert('삭제 중 문제가 발생했습니다.');
			}
		}
	};

	useEffect(() => {
		if (dbData?.length > 0 && expandedIds.length === 0) {
			setExpandedIds([String(dbData[0].deptId)]);
			setSelectedDeptId(dbData[0].deptId);
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
							<IconButton className='contained-primary light' onClick={() => router.push(`/admin/dept/list/add?parentId=${selectedDeptId}`)}>
								<AddCircleOutline className='svg-small' />
							</IconButton>
							{selectedDeptId && (
								<IconButton className='contained-primary light' onClick={() => handleDelete(selectedDeptId)}>
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
							selectedId={String(selectedDeptId)}
							placeholder='부서명을 검색하세요.'
							onNodeClick={(node) => {
								setSelectedDeptId(Number(node.id));
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
						<Typography sx={{ mr: '1.5rem', fontSize: '1.125rem', fontWeight: 'bold' }}>{dummyDept.deptNm}</Typography>
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
