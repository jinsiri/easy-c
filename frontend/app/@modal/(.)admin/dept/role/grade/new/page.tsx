'use client';

import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import useJobGradeForm from '@/app/admin/dept/_component/hooks/useJobGradeForm';
import JobGradeForm from '@/app/admin/dept/_component/JobGradeForm';

export default function AddJobGradeModal() {
	const {
		control,
		formState: { errors },
		loading,
		onSubmit,
	} = useJobGradeForm();

	return (
		<BaseDialog title={'직급 추가'} loading={loading} onConfirm={onSubmit}>
			<JobGradeForm control={control} errors={errors} />
		</BaseDialog>
	);
}
