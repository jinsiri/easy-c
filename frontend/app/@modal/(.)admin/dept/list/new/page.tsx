'use client';

import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import DeptForm from '@/app/admin/dept/_component/DeptForm';
import { useDeptForm } from '@/app/admin/dept/_hooks/useDeptForm';

export default function AddDeptModal() {
	const {
		control,
		formState: { errors },
		loading,
		onSubmit,
	} = useDeptForm();

	return (
		<BaseDialog title={'부서 추가'} loading={loading} onConfirm={onSubmit}>
			<DeptForm control={control} errors={errors} />
		</BaseDialog>
	);
}
