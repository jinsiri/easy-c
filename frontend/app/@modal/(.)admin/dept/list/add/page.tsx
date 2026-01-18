'use client';

import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import DeptAddForm, { DeptFormValues } from '@/app/admin/dept/_component/DeptAddForm';
import axiosConfig from '@/app/_lib/axiosConfig';

export default function AddDeptModal() {
	const router = useRouter();
	const [isSaving, setIsSaving] = useState(false);

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

	const handleClose = () => router.back();

	const handleSave = handleSubmit(async (data) => {
		setIsSaving(true);
		try {
			// await axiosConfig.post('/admin/dept/add', data);
			console.log(data);
			handleClose();
		} catch (error) {
			console.error('부서 저장 실패:', error);
			alert('저장 중 오류가 발생했습니다.');
		} finally {
			setIsSaving(false);
		}
	});

	return (
		<BaseDialog title={'부서 추가'} loading={isSaving} onConfirm={handleSave}>
			<DeptAddForm control={control} errors={errors} />
		</BaseDialog>
	);
}
