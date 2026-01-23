'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/** Lib */
import { useForm, Control, FieldErrors } from 'react-hook-form';

/** Custom */
import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import RequestCorrection from './RequestCorrection';

type DeptFormValues = Omit<DeptResponseDto, 'deptId'>;
interface Props {
	control: Control<DeptFormValues>;
	errors: FieldErrors<DeptFormValues>;
}

export default function AttendanceUserModal({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
	const router = useRouter();
	const type = searchParams.type;

	const [isSaving, setIsSaving] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<DeptFormValues>({
		defaultValues: {
			deptNm: '',
			deptEmail: '',
			deptCode: '',
			deptShortNm: '',
		},
	});

	const handleSave = handleSubmit(async (data) => {});

	return (
		<BaseDialog title={'근무시간 수정'} loading={isSaving} onConfirm={handleSave}>
			<RequestCorrection />
		</BaseDialog>
	);
}
