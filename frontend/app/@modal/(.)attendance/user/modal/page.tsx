'use client';

import { useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

/** MUI */
import { Box } from '@mui/material';

/** Custom */
import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import RequestCorrection from './RequestCorrection';

interface RequestCorrectionRef {
	submit: () => void;
}

export default function AttendanceUserModal() {
	const searchParams = useSearchParams();
	const type = searchParams.get('type');

	const requestCorrectionRef = useRef<RequestCorrectionRef>();

	const [isSaving, setIsSaving] = useState(false);

	const handleSave = () => {
		//setIsSaving(true);

		// ref가 mount된 후라면 submit 호출 가능
		if (requestCorrectionRef.current) {
			console.log('ref is');
			requestCorrectionRef.current.submit();
		} else {
			console.warn('ref is not ready yet');
		}
	};

	return (
		<BaseDialog title={'근무시간 수정'} loading={isSaving} onConfirm={handleSave}>
			{type === 'request' ? <RequestCorrection ref={requestCorrectionRef} /> : <Box></Box>}
		</BaseDialog>
	);
}
