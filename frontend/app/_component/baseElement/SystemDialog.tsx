'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { ErrorOutline, CheckCircleOutline, InfoOutlined, ReportProblemOutlined } from '@mui/icons-material';
import { useDialogStore } from '@/store/useDialogStore';

const ICON_MAP = {
	alert: <InfoOutlined color='info' />,
	success: <CheckCircleOutline color='success' />,
	danger: <ErrorOutline color='error' />,
	confirm: <ReportProblemOutlined color='warning' />,
};

/**
    공통 시스템창 사용 안내
    alert: 단순 알림
    await alert("저장되었습니다.");

    confirm: 확인 필요
    const ok = await confirm("진행할까요?");

    danger: 위험 경고
    const deleted = await danger("정말 삭제할까요?");

    * 컨펌창/위험 경고창의 경우 호출 위치에서 아래와 같이 사용
    const isConfirmed = await confirm('진행할까요?');
    if (isConfirmed) {
        try {
            // 정상 수행 시
        } catch (error) {
            // 비정상 수행 시
        }
    }
*/

export const SystemDialog = () => {
	const { isOpen, config, closeDialog } = useDialogStore();

	if (!config) return null;

	const isOneButton = config.type === 'alert' || config.type === 'success';

	return (
		<Dialog open={isOpen} onClose={() => closeDialog(false)} fullWidth maxWidth='xs'>
			<DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
				{ICON_MAP[config.type]}
				{config.type === 'danger' ? '경고' : '알림'}
			</DialogTitle>

			<DialogContent sx={{ color: 'text.secondary', pt: 1, textAlign: 'center', wordBreak: 'keep-all' }}>{config.content}</DialogContent>

			<DialogActions sx={{ p: 2, pt: 1 }}>
				{!isOneButton && (
					<Button onClick={() => closeDialog(false)} variant='text' color='inherit'>
						{config.cancelText || '취소'}
					</Button>
				)}
				<Button onClick={() => closeDialog(true)} variant='contained' color={config.type === 'danger' ? 'error' : 'primary'} autoFocus>
					{config.confirmText || '확인'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};
