'use client';

import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import AssignForm from '@/app/admin/dept/_component/AssignForm';

export default function AssignDeptModal() {
	const onSubmit = () => {
		console.log('confirm');
	};

	return (
		<BaseDialog title={'부서원 추가'} maxWidth={'lg'} paperSx={{ width: '90vw' }} onConfirm={onSubmit}>
			<AssignForm />
		</BaseDialog>
	);
}
