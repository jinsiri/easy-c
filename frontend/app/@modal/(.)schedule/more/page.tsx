'use client';

import { useRouter } from 'next/navigation';

/** MUI */
import { Box, IconButton } from '@mui/material';
import { DeleteRounded } from '@mui/icons-material';

/** Lib */
import useModalStore from '@/store/useModalStore';

/** Custom */
import BaseDialog from '@/app/_component/baseElement/BaseDialog';

/** Type & Interface */
import { CalendarEventDto } from '@/app/services/scheduleService';
import { CalendarEventBarComp } from '@/app/_component/baseElement/CalendarEventBarComp';

export default function ScheduleMoreModal() {
	const router = useRouter();
	const { modalData, resetModalData } = useModalStore();
	const dataList = modalData?.list ?? [];

	const handleClose = () => {
		resetModalData();
		router.back();
	};

	return (
		<BaseDialog title={'일정 목록'} loading={false} onConfirm={undefined} onClose={handleClose}>
			<Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '30rem', height: '14rem', gap: 0.5 }}>
				{dataList.map((item: CalendarEventDto, idx: number) => {
					return (
						<Box key={idx} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
							<CalendarEventBarComp barType='list' event={item} />
							<IconButton>
								<DeleteRounded sx={{ fontSize: '1rem' }} />
							</IconButton>
						</Box>
					);
				})}
			</Box>
		</BaseDialog>
	);
}
