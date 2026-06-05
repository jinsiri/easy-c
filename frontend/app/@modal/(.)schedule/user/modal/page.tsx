'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

/** MUI */
import { Box } from '@mui/material';

/** Lib */
import useModalStore from '@/store/useModalStore';

/** Custom */
import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import SheduleInputFormComp, { SheduleInputFormRef } from '@/app/(main)/schedule/user/data/SheduleInputFormComp';

export default function ScheduleModal() {
	const router = useRouter();
	const resetModalData = useModalStore((state) => state.resetModalData);

	const formRef = useRef<SheduleInputFormRef | null>(null);

	const [isSaving, setIsSaving] = useState(false);

	const handleSave = () => {
		if (formRef.current) formRef.current.handleSave?.();
	};

	const handleDelete = () => {
		if (formRef.current) formRef.current.handleDelete?.();
	};

	const handleClose = () => {
		resetModalData();
		router.back();
	};

	return (
		<BaseDialog title={'일정 상세'} loading={isSaving} confirmLabel={'수정'} onClose={handleClose} onConfirm={handleSave} onDelete={handleDelete}>
			<Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '30rem', height: '20rem', gap: 0.5 }}>
				<SheduleInputFormComp ref={formRef} />
			</Box>
		</BaseDialog>
	);
}
