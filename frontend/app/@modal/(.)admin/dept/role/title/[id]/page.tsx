'use client';

import { use } from 'react';
import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import useJobTitleForm from '@/app/admin/dept/_hooks/useJobTitleForm';
import JobTitleForm from '@/app/admin/dept/_component/JobTitleForm';

export default function UpdateJobTitleModal({ params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = use(params);
	const id = resolvedParams.id;
	const {
		control,
		formState: { errors },
		loading,
		onSubmit,
	} = useJobTitleForm(id);

	return (
		<BaseDialog title={'직책 수정'} loading={loading} onConfirm={onSubmit}>
			<JobTitleForm control={control} errors={errors} />
		</BaseDialog>
	);
}
