import { Box, Paper, Typography, Button, Container } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import useJobRoleForm from '@/app/admin/dept/_hooks/useJobRoleForm';
import JobRoleForm from '@/app/admin/dept/_component/JobRoleForm';

export default function AddJobRolePage() {
	const {
		control,
		formState: { errors },
		loading,
		onSubmit,
		router,
	} = useJobRoleForm('', () => router.back());

	return (
		<Container maxWidth='md' sx={{ py: 4 }}>
			<Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
				<Typography variant='h5' sx={{ fontWeight: 700 }}>
					직무 추가
				</Typography>
				<Button startIcon={<ArrowBack />} onClick={() => router.back()} sx={{ color: 'text.secondary' }}>
					뒤로가기
				</Button>
			</Box>

			<Paper sx={{ p: 4 }}>
				<JobRoleForm control={control} errors={errors} />
				<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
					<Button onClick={() => router.back()} disabled={loading}>
						취소
					</Button>
					<Button variant='contained' onClick={onSubmit} disabled={loading}>
						{loading ? '저장 중...' : '저장'}
					</Button>
				</Box>
			</Paper>
		</Container>
	);
}
