import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axiosConfig from '@/app/_lib/axiosConfig';
import { useDialogStore } from '@/store/useDialogStore';
import { JobTitleAddFormValues } from '@/app/admin/dept/_component/JobTitleAddForm';

export default function useJobTitleAdd(onSuccess?: () => void) {
	const router = useRouter();
	const { alert } = useDialogStore();
	const [loading, setLoading] = useState(false);

	const formMethods = useForm<JobTitleAddFormValues>({
		defaultValues: {
			jobTitleNm: '',
			jobTitleCode: '',
		},
	});

	const onSubmit = formMethods.handleSubmit(async (data) => {
		setLoading(true);
		try {
			await axiosConfig.post('/api/job-title', data);

			if (onSuccess) {
				onSuccess();
			} else {
				router.push('/admin/dept/role');
			}
		} catch (error) {
			console.error(error);
			await alert('저장 중 오류가 발생했습니다.');
		} finally {
			setLoading(false);
		}
	});

	return { ...formMethods, loading, onSubmit, router };
}
