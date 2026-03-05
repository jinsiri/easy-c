'use client';

import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import useJobTitleForm from '@/app/admin/dept/_hooks/useJobTitleForm';
import JobTitleForm from '@/app/admin/dept/_component/JobTitleForm';

export default function AddJobTitleModal() {
	const {
		control,
		formState: { errors },
		loading,
		onSubmit,
	} = useJobTitleForm();

	return (
		<BaseDialog title={'직책 추가'} loading={loading} onConfirm={onSubmit}>
			<JobTitleForm control={control} errors={errors} />
		</BaseDialog>
	);
}
