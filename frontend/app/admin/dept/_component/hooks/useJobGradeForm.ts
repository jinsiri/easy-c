'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axiosConfig from '@/app/_lib/axiosConfig';
import { useDialogStore } from '@/store/useDialogStore';
import { JobGradeAddFormValues } from '@/app/admin/dept/_component/JobGradeForm';
import useRefreshStore from '@/store/useRefreshStore';

export default function useJobGradeForm(id?: string, onSuccess?: () => void) {
	const router = useRouter();
	const { alert } = useDialogStore();
	const triggerRefresh = useRefreshStore((state) => state.triggerRefresh);
	const isEditMode = !!id;
	const [loading, setLoading] = useState(false);

	const formMethods = useForm<JobGradeAddFormValues>({
		defaultValues: {
			jobGradeNm: '',
			jobGradeCode: '',
		},
	});

	const { reset } = formMethods;

	useEffect(() => {
		const fetchDetail = async () => {
			if (isEditMode && id) {
				const response = await axiosConfig.get(`/api/job-grades/${id}`);
				reset(response);
			}
		};

		fetchDetail();
	}, [id, isEditMode, reset, alert]);

	const onSubmit = formMethods.handleSubmit(async (data) => {
		setLoading(true);
		try {
			if (isEditMode) {
				await axiosConfig.put(`/api/job-grades/${id}`, data);
			} else {
				await axiosConfig.post('/api/job-grades', data);
			}
			triggerRefresh();

			if (onSuccess) {
				onSuccess();
			} else {
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
