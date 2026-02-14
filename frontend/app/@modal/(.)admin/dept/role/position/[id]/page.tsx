'use client';

import { use } from 'react';
import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import useJobPositionForm from '@/app/admin/dept/_component/hooks/useJobPositionForm';
import JobPositionForm from '@/app/admin/dept/_component/JobPositionForm';

export default function UpdateJobPositionModal({ params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = use(params);
	const id = resolvedParams.id;
	const {
		control,
		formState: { errors },
		loading,
		onSubmit,
	} = useJobPositionForm(id);

	return (
		<BaseDialog title={'직위 수정'} loading={loading} onConfirm={onSubmit}>
			<JobPositionForm control={control} errors={errors} />
		</BaseDialog>
	);
}
