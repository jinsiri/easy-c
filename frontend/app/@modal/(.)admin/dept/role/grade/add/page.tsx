'use client';

import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import { startTransition } from 'react';
import useJobGradeAdd from '@/app/admin/dept/_component/hooks/useJobGradeAdd';
import JobGradeAddForm from '@/app/admin/dept/_component/JobGradeAddForm';

export default function AddJobGradeModal() {
	const {
		control,
		formState: { errors },
		loading,
		onSubmit,
		router,
	} = useJobGradeAdd(() => {
		startTransition(() => {
			router.refresh();
			setTimeout(() => {
				router.back();
			}, 500);
		});
	});

	return (
		<BaseDialog title={'직급 추가'} loading={loading} onConfirm={onSubmit}>
			<JobGradeAddForm control={control} errors={errors} />
		</BaseDialog>
	);
}
