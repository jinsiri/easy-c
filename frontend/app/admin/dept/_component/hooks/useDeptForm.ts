import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosConfig from '@/app/_lib/axiosConfig';
import { DeptAddFormValues } from '@/app/admin/dept/_component/DeptForm';
import useRefreshStore from '@/store/useRefreshStore';

export function useDeptForm(id?: number | null, onSuccess?: () => void) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const parentIdStr = searchParams.get('parentId');
	const parentId = parentIdStr ? parseInt(parentIdStr, 10) : null;
	const triggerRefresh = useRefreshStore((state) => state.triggerRefresh);
	const isEditMode = !!id;
	const [loading, setLoading] = useState(false);

	const formMethods = useForm<DeptAddFormValues>({
		defaultValues: {
			deptNm: '',
			deptEmail: '',
			deptCode: '',
			deptShortNm: '',
			treeParentId: parentId,
		},
	});

	const { reset } = formMethods;

	useEffect(() => {
		const fetchDetail = async () => {
			if (isEditMode && id) {
				const response = await axiosConfig.get(`/api/dept/${id}`);
				reset(response);
			}
		};

		fetchDetail();
	}, [id, isEditMode, reset]);

	const onSubmit = formMethods.handleSubmit(async (data) => {
		setLoading(true);
		try {
			if (isEditMode) {
				await axiosConfig.put(`/api/dept/${id}`, data);
			} else {
				await axiosConfig.post('/api/dept', data);
			}

			router.refresh();

			setTimeout(() => {
				if (onSuccess) {
					onSuccess();
				} else {
					router.back();
				}
			}, 300);
		} finally {
			setLoading(false);
		}
	});

	return { ...formMethods, loading, onSubmit, router };
}
