import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axiosConfig from '@/app/_lib/axiosConfig';
import { useDialogStore } from '@/store/useDialogStore';
import { JobPositionAddFormValues } from '@/app/admin/dept/_component/JobPositionAddForm';
import useRefreshStore from '@/store/useRefreshStore';

export default function useJobPositionAdd(onSuccess?: () => void) {
	const router = useRouter();
	const { alert } = useDialogStore();
	const triggerRefresh = useRefreshStore((state) => state.triggerRefresh);
	const [loading, setLoading] = useState(false);

	const formMethods = useForm<JobPositionAddFormValues>({
		defaultValues: {
			jobPositionNm: '',
			jobPositionCode: '',
		},
	});

	const onSubmit = formMethods.handleSubmit(async (data) => {
		setLoading(true);
		try {
			await axiosConfig.post('/api/job-positions', data);

			if (onSuccess) {
				onSuccess();
				console.log('none modal test');
			} else {
				triggerRefresh();
				router.back();
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
