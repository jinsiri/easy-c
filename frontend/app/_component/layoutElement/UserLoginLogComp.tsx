/** Lib */
import dayjs from 'dayjs';

/** MUI */
import { Box, Chip, Divider, Typography } from '@mui/material';

/** Type / Interface */
import { SecurityLogResponseDto } from '@/app/services/securityLogService';

const EVENT_LABEL: Record<string, { label: string; color: 'success' | 'error' }> = {
	LOGIN_SUCCESS: { label: '성공', color: 'success' },
	LOGIN_FAILURE: { label: '실패', color: 'error' },
};

export default function UserLoginLogComp({ type, myLogins }: { type?: string; myLogins?: SecurityLogResponseDto[] }) {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				padding: '1.5rem',
				borderRadius: '1rem',
				backgroundColor: 'grey.50',
			}}
		>
			<Typography variant='subtitle1' sx={{ mb: 2 }}>
				최근 로그인 이력
			</Typography>
			{myLogins?.length === 0 ? (
				<Typography variant='body1' color='text.secondary'>
					데이터가 없습니다.
				</Typography>
			) : (
				myLogins?.map((log, idx) => (
					<Box key={log.id}>
						{idx > 0 && <Divider sx={{ my: 0.5 }} />}
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							<Chip
								label={EVENT_LABEL[log.eventType]?.label ?? log.eventType}
								color={EVENT_LABEL[log.eventType]?.color ?? 'default'}
								size='small'
								sx={{ fontSize: '0.7rem', height: 20, minWidth: 40 }}
							/>
							<Typography variant='body1' color='text.secondary' sx={{ flex: 1, minWidth: 0 }} noWrap>
								{log.ip} · {log.deviceType ?? '-'}
							</Typography>
							<Typography variant='body1' color='text.secondary' sx={{ flexShrink: 0 }}>
								{dayjs(log.registerDate).format('MM-DD HH:mm')}
							</Typography>
						</Box>
					</Box>
				))
			)}
		</Box>
	);
}
