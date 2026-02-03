'use client';

import { Button, Checkbox, Divider, Stack, Typography } from '@mui/material';
import { useState } from 'react';

interface Props {
	deptId: number;
}

export default function AdminDeptDetailView({ deptId = 1 }: Props) {
	const [checked, setChecked] = useState(false);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(event.target.checked);
	};

	return (
		<>
			<Stack direction='row' spacing={1} alignItems={'center'} sx={{ py: 2 }}>
				<Stack>
					<Checkbox
						checked={checked}
						onChange={handleChange}
						slotProps={{
							input: { 'aria-label': 'controlled' },
						}}
					/>
				</Stack>
				<Stack>
					<Button variant='contained' size='small'>
						직위 변경
					</Button>
				</Stack>
				<Stack>
					<Button variant='contained' size='small'>
						부서장 위임
					</Button>
				</Stack>
				<Stack>
					<Button variant='contained' size='small'>
						부서 이동
					</Button>
				</Stack>
			</Stack>
			<Typography sx={{ py: 1, textAlign: 'center', color: 'grey.700' }}>소속된 부서원이 없습니다.</Typography>
		</>
	);
}
