'use client';

import { use } from 'react';
import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import useJobGradeForm from '@/app/admin/dept/_hooks/useJobGradeForm';
import JobGradeForm from '@/app/admin/dept/_component/JobGradeForm';

export default function UpdateJobGradeModal({ params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = use(params);
	const id = resolvedParams.id;
	const {
		control,
		formState: { errors },
		loading,
		onSubmit,
	} = useJobGradeForm(id);

	return (
		<BaseDialog title={'직급 수정'} loading={loading} onConfirm={onSubmit}>
			<JobGradeForm control={control} errors={errors} />
		</BaseDialog>
	);
}
