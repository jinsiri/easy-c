'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/** MUI */
import { Box } from '@mui/material';

/** Lib */
import useModalStore from '@/store/useModalStore';

/** Custom */
import BaseDialog from '@/app/_component/baseElement/BaseDialog';

import AttendanceUserDetailModal from './AttendanceUserDetailModal';
import AttendanceUserListModal from './AttendanceUserListModal';

export default function AttendanceUserModal() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const mode = searchParams.get('mode');

	const { modalData, resetModalData } = useModalStore();

	const [modalMode, setModalMode] = useState<string | null>(mode);
	const [sendModalData, setSendModalData] = useState(modalData);
	const [saveFunc, setSaveFunc] = useState<(() => Promise<void>) | null>(null);

	const handleSave = async () => {
		await saveFunc?.();
	};

	const onClose = () => {
		if (mode === 'list' && modalMode === 'detail') {
			setSendModalData(modalData);
			setModalMode('list');
		} else {
			resetModalData();
			router.back();
		}
	};

	return (
		<BaseDialog
			title={modalMode === 'list' ? '근태 수정 요청 목록' : modalData ? '근태 수정 확인' : '근태 수정'}
			className={modalMode === 'list' ? 'none-padding' : ''}
			onConfirm={modalData ? undefined : handleSave}
			onClose={onClose}
		>
			<Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '30rem', height: '20rem' }}>
				{modalMode === 'detail' ? (
					<AttendanceUserDetailModal modalData={sendModalData} setSaveFunc={setSaveFunc} />
				) : (
					<AttendanceUserListModal setModalMode={setModalMode} modalData={sendModalData} setModalData={setSendModalData} />
				)}
			</Box>
		</BaseDialog>
	);
}
