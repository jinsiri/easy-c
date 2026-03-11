'use client';

import { use } from 'react';
import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import useJobRoleForm from '@/app/admin/dept/_hooks/useJobRoleForm';
import JobRoleForm from '@/app/admin/dept/_component/JobRoleForm';

export default function UpdateJobRoleModal({ params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = use(params);
	const id = resolvedParams.id;
	const {
		control,
		formState: { errors },
		loading,
		onSubmit,
	} = useJobRoleForm(id);

	return (
		<BaseDialog title={'직무 수정'} loading={loading} onConfirm={onSubmit}>
			<JobRoleForm control={control} errors={errors} />
		</BaseDialog>
	);
}
