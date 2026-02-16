'use client';

import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import { startTransition } from 'react';
import useJobPositionForm from '@/app/admin/dept/_component/hooks/useJobPositionForm';
import JobPositionForm from '@/app/admin/dept/_component/JobPositionForm';

export default function AddJobPositionModal() {
	const {
		control,
		formState: { errors },
		loading,
		onSubmit,
	} = useJobPositionForm();

	return (
		<BaseDialog title={'직위 추가'} loading={loading} onConfirm={onSubmit}>
			<JobPositionForm control={control} errors={errors} />
		</BaseDialog>
	);
}
