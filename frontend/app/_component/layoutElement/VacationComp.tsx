'use client';

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

const vacationList: { key: keyof VacationDataDto; label: string }[] = [
	{ key: 'grantedDay', label: '총 연차' },
	{ key: 'remainDay', label: '잔여 연차' },
	{ key: 'usedDay', label: '사용 연차' },
	//{ key: 'yearsOfService', label: '근속 년수' },
];

export default function VacationComp({ type, vacationData }: { type?: string; vacationData?: VacationDataDto; onSuccess?: () => void }) {
	const router = useRouter();
	const { setModalData } = useModalStore();

	const onClickvacationApplication = () => {
		setModalData(vacationData);
		router.push('/vacation/user/modal');
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', padding: '1rem 1.5rem', gap: '1rem' }}>
			<Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
				{type === 'home' ? (
					<Typography variant='subtitle1'>휴가 관리</Typography>
				) : (
					<Typography variant='subtitle2' whiteSpace='nowrap'>
						{vacationData?.vacationPolicyType ? <> {VACATIONPOLICYTYPE[vacationData.vacationPolicyType]} 기준</> : '-'}
					</Typography>
				)}
			</Box>
			<Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', mt: '0.125rem', gap: 1 }}>
				{vacationList.map((item, idx) => (
					<ColTitleAndText
						key={idx}
						subtitle={item.label}
						sx={{ flex: '1', backgroundColor: 'primary.50', borderRadius: '1rem', padding: '1rem 0.25rem' }}
					>
						<Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
							<Typography variant='h6'>{vacationData ? vacationData[item.key] : '-'}</Typography>
						</Box>
					</ColTitleAndText>
				))}
			</Box>
			<Button
				variant='contained'
				size='large'
				sx={{ width: '100%' }}
				onClick={onClickvacationApplication}
				disabled={!vacationData || vacationData.remainDay === 0}
			>
				휴가 신청
			</Button>
		</Box>
	);
}
