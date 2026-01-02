'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { TextField, Button, Typography, Box, FormControlLabel, Checkbox } from '@mui/material';

import {authService} from "@/app/services/authService";
import {encryptRSA} from "@/app/utils/crypto";

const LoginPage = () => {

	const router = useRouter();

	const [userId, setUserId] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		// TODO: 로그인 api 호출 로직
		try {
			await login();
			alert('로그인 성공!');
			router.push('/');  // 메인 페이지 이동
		} catch (error) {
			alert('로그인 실패! ' + error.response.data.message);
		}
	};


	const login = async () => {

		const { data: publicKey } = await authService.getPublicKey();

		const encryptedPw = encryptRSA(password, publicKey);

		const res = await authService.login({
			loginId: userId,
			encryptedPassword: encryptedPw
		});

		return res;
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
			<Box sx={{ maxWidth: '560px', padding: '88px 56px', borderRadius: '32px', bgcolor: '#fff' }}>
				<Box
					sx={{
						'& .MuiOutlinedInput-notchedOutline': { borderColor: 'gray.500' },
						'& .MuiInputLabel-root': { color: 'gray.900' },
						'& input::placeholder': { color: 'gray.500', fontWeight: 400 },
					}}
				>
					<Box
						display='flex'
						flexDirection='column'
						alignItems='center'
						justifyContent={'center'}
						sx={{ bgcolor: 'gray.500', mb: 6, minHeight: '72px' }}
					>
						로고
					</Box>
					<form onSubmit={handleLogin} style={{ width: '100%' }}>
						<TextField
							label='ID'
							type='text'
							value={userId}
							onChange={(e) => setUserId(e.target.value)}
							fullWidth
							margin='normal'
							required
							placeholder={'Enter your ID'}
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
							margin='normal'
							required
							placeholder={'Enter your Password'}
							slotProps={{
								inputLabel: {
									shrink: true,
								},
							}}
							sx={{ mt: 4 }}
						/>
						<FormControlLabel
							control={<Checkbox />}
							label='아이디 저장'
							sx={{
								'&>span': { pr: '8px' },
								'& input+.MuiSvgIcon-root': { fontSize: '1.25rem' },
								'& input:not(:checked)+.MuiSvgIcon-root, & input:not(:checked)+.MuiSvgIcon-root *': { color: 'gray.500' },
								'& .MuiFormControlLabel-label': { fontSize: '.813rem', color: 'gray.900' },
							}}
						/>
						<Button
							type='submit'
							variant='contained'
							color='primary'
							fullWidth
							sx={{ mt: 5, py: '1.125rem', fontSize: '1.063rem', fontWeight: 600, lineHeight: 1 }}
						>
							로그인
						</Button>
					</form>
					<Typography textAlign={'center'} sx={{ fontSize: '.75rem', color: 'gray.700' }} mt={3}>
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
