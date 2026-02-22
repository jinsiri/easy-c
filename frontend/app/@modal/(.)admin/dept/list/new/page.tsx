'use client';

import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import DeptAddForm from '@/app/admin/dept/_component/DeptAddForm';
import { useDeptAdd } from '@/app/admin/dept/_component/hooks/useDeptAdd';
import { startTransition } from 'react';

export default function AddDeptModal() {
	const {
		control,
		formState: { errors },
		loading,
		onSubmit,
		router,
	} = useDeptAdd(() => {
		startTransition(() => {
			router.refresh();
			setTimeout(() => {
				router.back();
			}, 500);
		});
	});

	return (
		<BaseDialog title={'부서 추가'} loading={loading} onConfirm={onSubmit}>
			<DeptAddForm control={control} errors={errors} />
		</BaseDialog>
	);
}
