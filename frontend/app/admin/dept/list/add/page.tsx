'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Paper, Typography, Button, Divider, Container } from '@mui/material';
import DeptAddForm, { DeptFormValues } from '@/app/admin/dept/_component/DeptAddForm';
import axiosConfig from '@/app/_lib/axiosConfig';
import { ArrowBack } from '@mui/icons-material';

export default function AddDeptPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<DeptFormValues>({
		defaultValues: {
			deptNm: '',
			deptEmail: '',
			deptCode: '',
			deptShortNm: '',
		},
	});

	const onConfirm = handleSubmit(async (data) => {
		setLoading(true);
		try {
			// await axiosConfig.post('/admin/dept/add', data);
			router.push('/admin/dept/list');
		} catch (error) {
			console.error(error);
			alert('저장 중 오류가 발생했습니다.');
		} finally {
			setLoading(false);
		}
	});

	return (
		<Container maxWidth='md' sx={{ py: 4 }}>
			<Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
				<Typography variant='h5' sx={{ fontWeight: 700 }}>
					부서 등록
				</Typography>
				<Button startIcon={<ArrowBack />} onClick={() => router.back()} sx={{ color: 'text.secondary' }}>
					뒤로가기
				</Button>
			</Box>

			<Paper sx={{ p: 4, borderRadius: '12px' }} elevation={1}>
				<Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>
					기본 정보 입력
				</Typography>

				<Divider sx={{ mb: 4 }} />

				<DeptAddForm control={control} errors={errors} />

				<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
					<Button variant='outlined' onClick={() => router.back()} disabled={loading}>
						취소
					</Button>
					<Button
						variant='contained'
						onClick={onConfirm}
						disabled={loading}
						sx={{
							bgcolor: '#5C67D3',
							px: 4,
						}}
					>
						{loading ? '저장 중...' : '저장'}
					</Button>
				</Box>
			</Paper>
		</Container>
	);
}
