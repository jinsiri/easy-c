'use client';

import AssignForm from '@/app/admin/dept/_component/AssignForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDialogStore } from '@/store/useDialogStore';
import { SubmitHandler, useForm } from 'react-hook-form';
import { deptService } from '@/app/services/deptService';
import { IDeptMemberForm } from '@/app/@modal/(.)admin/dept/list/assign/page';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import useRefreshStore from '@/store/useRefreshStore';

export default function AssignDeptListPage() {
	const router = useRouter();
	const { alert } = useDialogStore();
	const triggerRefresh = useRefreshStore((state) => state.triggerRefresh);
	const searchParams = useSearchParams();
	const deptIdStr = searchParams.get('deptId');
	const deptId = deptIdStr ? parseInt(deptIdStr) : null;
	const { handleSubmit, control } = useForm<IDeptMemberForm>({
		defaultValues: {
			deptId: 0,
			selectedMemberIds: [],
		},
	});

	const onSubmit: SubmitHandler<IDeptMemberForm> = async (data) => {
		if (data.selectedMemberIds.length === 0) {
			await alert('선택된 데이터가 없습니다.');
			return;
		}

		await deptService.assignMembersToDept({ deptId: deptId, memberIds: data.selectedMemberIds });
		triggerRefresh();
		router.back();
	};

	return (
		<Container maxWidth='md' sx={{ py: 4 }}>
			<Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
				<Typography variant='h5' sx={{ fontWeight: 700 }}>
					부서원 추가
				</Typography>
				<Button startIcon={<ArrowBack />} onClick={() => router.back()} sx={{ color: 'text.secondary' }}>
					뒤로가기
				</Button>
			</Box>

			<Paper sx={{ p: 4 }}>
				<AssignForm control={control} />
				<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
					<Button onClick={() => router.back()}>취소</Button>
					<Button type={'submit'} variant='contained' onSubmit={handleSubmit(onSubmit)}>
						저장
					</Button>
				</Box>
			</Paper>
		</Container>
	);
}
