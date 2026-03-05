'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Lib */
import useModalStore from '@/store/useModalStore';

/** MUI */
import { Box, Button, Typography } from '@mui/material';

/** Custom */
import ColTitleAndText from '@/app/_component/layoutElement/ColTitleAndText';

/** Type / Interface */
import { VACATIONPOLICYTYPE } from '@/constant/vacationConst';
import { VacationDataDto } from '@/app/services/vacationService';

const vacationList: Record<string, any>[] = [
	{ key: 'remainDay', label: '잔여 연차' },
	{ key: 'usedDay', label: '사용 연차' },
	{ key: 'grantedDay', label: '총 연차' },
	{ key: 'yearsOfService', label: '근속 년수' },
];

export default function VacationComp({ vacationData, onSuccess }: { vacationData?: VacationDataDto; onSuccess?: () => void }) {
	const router = useRouter();
	const { setModalData } = useModalStore();

	useEffect(() => {
		console.log(vacationData);
	}, [vacationData]);

	const onClickvacationApplication = () => {
		setModalData(vacationData);
		router.push('/vacation/user/modal');
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', padding: '1rem 1.5rem', gap: '1rem' }}>
			<Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
				<Typography variant='subtitle2' whiteSpace='nowrap'>
					{vacationData && vacationData.vacationPolicyType && <> {VACATIONPOLICYTYPE[vacationData.vacationPolicyType]} 기준</>}
				</Typography>
			</Box>
			<Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', mt: '0.5rem' }}>
				{vacationList.map((item, idx) => (
					<ColTitleAndText key={idx} subtitle={item.label} sx={{ flex: '1' }}>
						<Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
							<Typography variant='h6'>{vacationData ? vacationData[item.key] : '-'}</Typography>
						</Box>
					</ColTitleAndText>
				))}
			</Box>
			<Button variant='contained' size='large' sx={{ width: '100%' }} onClick={onClickvacationApplication}>
				휴가 신청
			</Button>
		</Box>
	);
}
