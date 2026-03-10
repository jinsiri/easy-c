import { useDialogStore } from '@/store/useDialogStore';
import { useState } from 'react';
import { memberService } from '@/app/services/memberService';
import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import { Box, OutlinedInput } from '@mui/material';

interface Props {
	onClose: () => void;
	memberId: number;
}

export default function PasswordChangeDialog({ onClose, memberId }: Props) {
	const { alert, success } = useDialogStore();
	const [pwForm, setPwForm] = useState({ password: '', passwordCheck: '' });
	const [loading, setLoading] = useState(false);

	const handleSave = async () => {
		const { password, passwordCheck } = pwForm;

		if (!password.trim()) return alert('비밀번호를 입력해주세요.');
		if (password.length < 8) return alert('비밀번호는 8자 이상이어야 합니다.');
		if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
			return alert('비밀번호는 영문과 숫자를 포함해야 합니다.');
		}
		if (password !== passwordCheck) return alert('비밀번호가 일치하지 않습니다.');

		try {
			setLoading(true);
			await memberService.updatePassword(memberId, password);
			await success('비밀번호가 변경되었습니다.');
			setPwForm({ password: '', passwordCheck: '' });
			onClose();
		} catch (e: any) {
			await alert(e?.message ?? '비밀번호 변경에 실패했습니다.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<BaseDialog title='비밀번호 변경' confirmLabel={loading ? '변경 중...' : '변경'} onConfirm={handleSave} onClose={onClose} maxWidth='xs' fullWidth>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '0.5rem' }}>
				<OutlinedInput
					size='small'
					type='password'
					placeholder='새 비밀번호'
					value={pwForm.password}
					onChange={(e) => setPwForm((p) => ({ ...p, password: e.target.value }))}
				/>
				<OutlinedInput
					size='small'
					type='password'
					placeholder='비밀번호 확인'
					value={pwForm.passwordCheck}
					onChange={(e) => setPwForm((p) => ({ ...p, passwordCheck: e.target.value }))}
				/>
			</Box>
		</BaseDialog>
	);
}
