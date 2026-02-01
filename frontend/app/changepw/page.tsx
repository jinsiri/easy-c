'use client';

import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const ChangePwPage = () => {
	const [userEmail, setUserEmail] = useState('');
	const [password, setPassword] = useState('');
	const [retypePassword, setRetypePassword] = useState('');

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: 로그인 api 호출 로직
	};

	return (
		<Box
			className={'w-100 h-100 mh-100vh'}
			display='flex'
			flexDirection='column'
			alignItems='center'
			justifyContent={'center'}
			sx={{ bgcolor: 'grey.100' }}
		>
			<Box sx={{ maxWidth: '560px', padding: '88px 56px', borderRadius: '32px', bgcolor: '#fff' }}>
				<Box
					sx={{
						'& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.500' },
						'& .MuiInputLabel-root': { color: 'grey.900' },
						'& input::placeholder': { color: 'grey.500', fontWeight: 400 },
					}}
				>
					<Box
						display='flex'
						flexDirection='column'
						alignItems='center'
						justifyContent={'center'}
						sx={{ bgcolor: 'grey.500', mb: 3, minHeight: '72px' }}
					>
						로고
					</Box>
					<form onSubmit={handleLogin} style={{ width: '100%' }}>
						<TextField
							label='Email'
							type='text'
							value={userEmail}
							onChange={(e) => setUserEmail(e.target.value)}
							fullWidth
							margin='normal'
							required
							placeholder={'Enter your Email'}
							slotProps={{
								inputLabel: {
									shrink: true,
								},
							}}
						/>
						<TextField
							label='New Password'
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							fullWidth
							margin='normal'
							required
							placeholder={'Enter your New Password'}
							slotProps={{
								inputLabel: {
									shrink: true,
								},
							}}
							sx={{ mt: 2 }}
						/>
						<TextField
							label='Password Confirm'
							type='password'
							value={retypePassword}
							onChange={(e) => setRetypePassword(e.target.value)}
							fullWidth
							margin='normal'
							required
							placeholder={'Enter your New Password'}
							error={password !== '' && retypePassword !== '' && password !== retypePassword}
							slotProps={{
								inputLabel: {
									shrink: true,
								},
							}}
							sx={{ mt: 2 }}
						/>
						<Button
							type='submit'
							variant='contained'
							color='secondary'
							fullWidth
							sx={{ mt: 3, py: '1.125rem', fontSize: '1.063rem', fontWeight: 600, lineHeight: 1, boxShadow: 'none', color: '#fff' }}
						>
							비밀번호 변경
						</Button>
					</form>
				</Box>
			</Box>
		</Box>
	);
};

export default ChangePwPage;
