'use client';

import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import { startTransition } from 'react';
import useJobPositionAdd from '@/app/admin/dept/_component/hooks/useJobPositionAdd';
import JobPositionAddForm from '@/app/admin/dept/_component/JobPositionAddForm';

export default function AddJobPositionModal() {
	const {
		control,
		formState: { errors },
		loading,
		onSubmit,
	} = useJobPositionAdd();

	return (
		<BaseDialog title={'직위 추가'} loading={loading} onConfirm={onSubmit}>
			<JobPositionAddForm control={control} errors={errors} />
		</BaseDialog>
	);
}
