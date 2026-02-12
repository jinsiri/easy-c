import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

/** MUI */
import { Box } from '@mui/material';

/** Custom */
import BaseDialog from '@/app/_component/baseElement/BaseDialog';

export default function AttendancePolicyModal() {
	const searchParams = useSearchParams();
	const type = searchParams.get('type');

	const [isSaving, setIsSaving] = useState(false);

	const handleSave = () => {};

	return (
		<BaseDialog title={'근무 정책 ' + type === 'insert' ? '생성' : '수정'} loading={isSaving} onConfirm={handleSave}>
			<Box>ㅇㄹㄴㅇ</Box>
		</BaseDialog>
	);
}
