import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosConfig from '@/app/_lib/axiosConfig';
import { DeptFormValues } from '@/app/admin/dept/_component/DeptAddForm';

export function useDeptAdd(onSuccess?: () => void) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const parentIdStr = searchParams.get('parentId');
	const parentId = parentIdStr ? parseInt(parentIdStr, 10) : null;
	const [loading, setLoading] = useState(false);

	const formMethods = useForm<DeptFormValues>({
		defaultValues: {
			deptNm: '',
			deptEmail: '',
			deptCode: '',
			deptShortNm: '',
			treeParentId: parentId,
		},
	});

	const onSubmit = formMethods.handleSubmit(async (data) => {
		setLoading(true);
		try {
			await axiosConfig.post('/api/dept', data);

			if (onSuccess) {
				onSuccess();
			} else {
				router.push('/admin/dept/list');
			}
		} catch (error) {
			console.error(error);
			alert('저장 중 오류가 발생했습니다.');
		} finally {
			setLoading(false);
		}
	});

	return { ...formMethods, loading, onSubmit, router };
}
