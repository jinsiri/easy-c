'use client';

import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import useJobRoleForm from '@/app/admin/dept/_hooks/useJobRoleForm';
import JobRoleForm from '@/app/admin/dept/_component/JobRoleForm';

export default function AddJobRoleModal() {
	const {
		control,
		formState: { errors },
		loading,
		onSubmit,
	} = useJobRoleForm();

	return (
		<BaseDialog title={'직무 추가'} loading={loading} onConfirm={onSubmit}>
			<JobRoleForm control={control} errors={errors} />
		</BaseDialog>
	);
}
