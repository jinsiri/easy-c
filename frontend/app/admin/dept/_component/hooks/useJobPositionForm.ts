'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axiosConfig from '@/app/_lib/axiosConfig';
import { useDialogStore } from '@/store/useDialogStore';
import { JobPositionAddFormValues } from '@/app/admin/dept/_component/JobPositionForm';
import useRefreshStore from '@/store/useRefreshStore';

export default function useJobPositionForm(id?: string, onSuccess?: () => void) {
	const router = useRouter();
	const { alert } = useDialogStore();
	const triggerRefresh = useRefreshStore((state) => state.triggerRefresh);
	const isEditMode = !!id;
	const [loading, setLoading] = useState(false);

	const formMethods = useForm<JobPositionAddFormValues>({
		defaultValues: {
			jobPositionNm: '',
			jobPositionCode: '',
		},
	});

	const { reset } = formMethods;

	useEffect(() => {
		const fetchDetail = async () => {
			if (isEditMode && id) {
				const response = await axiosConfig.get(`/api/job-positions/${id}`);
				reset(response);
			}
		};

		fetchDetail();
	}, [id, isEditMode, reset, alert]);

	const onSubmit = formMethods.handleSubmit(async (data) => {
		setLoading(true);
		try {
			if (isEditMode) {
				await axiosConfig.put(`/api/job-positions/${id}`, data);
			} else {
				await axiosConfig.post('/api/job-positions', data);
			}
			triggerRefresh();

			if (onSuccess) {
				onSuccess();
			} else {
				router.back();
			}
		} finally {
			setLoading(false);
		}
	});

	return { ...formMethods, loading, onSubmit, router };
}
