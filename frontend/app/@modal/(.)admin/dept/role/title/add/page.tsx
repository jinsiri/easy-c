'use client';

import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import { startTransition } from 'react';
import JobTitleAddForm from '@/app/admin/dept/_component/JobTitleAddForm';
import useJobTitleAdd from '@/app/admin/dept/_component/hooks/useJobTitleAdd';

export default function AddJobTtitleModal() {
	const {
		control,
		formState: { errors },
		loading,
		onSubmit,
		router,
	} = useJobTitleAdd(() => {
		startTransition(() => {
			router.refresh();
			setTimeout(() => {
				router.back();
			}, 500);
		});
	});

	return (
		<BaseDialog title={'직책 추가'} loading={loading} onConfirm={onSubmit}>
			<JobTitleAddForm control={control} errors={errors} />
		</BaseDialog>
	);
}
