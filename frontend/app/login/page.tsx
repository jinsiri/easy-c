'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import secureLocalStorage from 'react-secure-storage';

import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';

import { authService } from '@/app/services/authService';
import { encryptRSA } from '@/utils/crypto';
import { useDialogStore } from '@/store/useDialogStore';

const LoginPage = () => {
	const { alert } = useDialogStore();

	const router = useRouter();

	const [memberId, setMemberId] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const publicKey = await authService.getPublicKey();

			const encryptedPw = encryptRSA(password, publicKey);

			const res = await authService.login({
				loginId: memberId,
				encryptedPassword: encryptedPw,
			});

			secureLocalStorage.setItem('loginId', res.loginId);
			secureLocalStorage.setItem('memberId', res.memberId);
			secureLocalStorage.setItem('memberRole', res.memberRole);

			await alert('로그인 성공!');
			router.push('/'); // 메인 페이지 이동
		} catch (error: any) {
			await alert('로그인 실패!' + error.message);
		}
	};

	return (
		<Box
			className={'w-100 h-100 mh-100vh'}
			display='flex'
			flexDirection='column'
			alignItems='center'
			justifyContent={'center'}
			sx={{ bgcolor: 'primary.50' }}
		>
			<Box
				sx={{
					width: {
						sm: 'calc(100% - 4rem)',
						md: '560px',
					},
					margin: '0 2rem',
					maxWidth: '560px',
					padding: '88px 56px',
					borderRadius: '32px',
					bgcolor: '#fff',
				}}
			>
				<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 4 }}>
					<Box display='flex' flexDirection='column' alignItems='center' justifyContent={'center'} sx={{ bgcolor: 'grey.500', minHeight: '72px' }}>
						로고
					</Box>
					<Box component={'form'} onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 1 }}>
						<TextField
							label='ID'
							type='text'
							value={memberId}
							onChange={(e) => setMemberId(e.target.value)}
							fullWidth
							margin='dense'
							required
							placeholder={'ID를 입력해주세요.'}
							slotProps={{
								inputLabel: {
									shrink: true,
								},
							}}
						/>
						<TextField
							label='Password'
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							fullWidth
							margin='dense'
							required
							placeholder={'비밀번호를 입력해주세요.'}
							slotProps={{
								inputLabel: {
									shrink: true,
								},
							}}
						/>
						<FormControlLabel
							control={<Checkbox />}
							label='아이디 저장'
							sx={{
								'&>span': { pr: '8px' },
								'& input+.MuiSvgIcon-root': { fontSize: '1.25rem' },
								'& input:not(:checked)+.MuiSvgIcon-root, & input:not(:checked)+.MuiSvgIcon-root *': { color: 'grey.500' },
								'& .MuiFormControlLabel-label': { fontSize: '.813rem', color: 'grey.900' },
							}}
						/>
						<Button
							type='submit'
							variant='contained'
							color='primary'
							fullWidth
							sx={{ py: '1.125rem', fontSize: '1rem', fontWeight: 600, lineHeight: 1, mt: '1rem' }}
						>
							로그인
						</Button>
					</Box>
					<Typography textAlign={'center'} sx={{ fontSize: '.75rem', color: 'grey.700' }}>
						비밀번호를 잊어버리셨나요?
						<a href={'#'}>
							<Typography component={'strong'} sx={{ font: 'inherit', color: 'primary.400' }} ml={1}>
								관리자에게 연락하기
							</Typography>
						</a>
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default LoginPage;
