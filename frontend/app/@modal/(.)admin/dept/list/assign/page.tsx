'use client';

import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import AssignForm from '@/app/admin/dept/_component/AssignForm';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDialogStore } from '@/store/useDialogStore';
import { deptService } from '@/app/services/deptService';
import { useRouter, useSearchParams } from 'next/navigation';
import useRefreshStore from '@/store/useRefreshStore';

export interface IDeptMemberForm {
	deptId: number;
	selectedMemberIds: number[];
}

export default function AssignDeptModal() {
	const router = useRouter();
	const { alert } = useDialogStore();
	const triggerRefresh = useRefreshStore((state) => state.triggerRefresh);
	const searchParams = useSearchParams();
	const deptIdStr = searchParams.get('deptId');
	const deptId = deptIdStr ? parseInt(deptIdStr) : null;
	const { handleSubmit, control } = useForm<IDeptMemberForm>({
		defaultValues: {
			deptId: 0,
			selectedMemberIds: [],
		},
	});

	const onSubmit: SubmitHandler<IDeptMemberForm> = async (data) => {
		if (data.selectedMemberIds.length === 0) {
			await alert('선택된 데이터가 없습니다.');
			return;
		}

		await deptService.assignMembersToDept({ deptId: deptId, memberIds: data.selectedMemberIds });
		triggerRefresh();
		router.back();
	};

	return (
		<BaseDialog title={'부서원 추가'} maxWidth={'lg'} paperSx={{ width: '90vw' }} onConfirm={handleSubmit(onSubmit)}>
			<AssignForm control={control} />
		</BaseDialog>
	);
}
