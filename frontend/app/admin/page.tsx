'use client';

/** MUI */
import { Box, Card, CardContent, CardHeader, Chip, Divider, Typography } from '@mui/material';

/** React */
import { useEffect, useState } from 'react';

/** Lib */
import dayjs from 'dayjs';

/** Custom */
import PathBreadcrumbs from '../_component/PathBreadcrumbs';

/** Services */
import { securityLogService, SecurityLogResponseDto } from '../services/securityLogService';

const EVENT_TYPE_LABEL: Record<string, { label: string; color: 'success' | 'error' }> = {
	LOGIN_SUCCESS: { label: '로그인 성공', color: 'success' },
	LOGIN_FAILURE: { label: '로그인 실패', color: 'error' },
};

export default function AdminPage() {
	const [recentLogins, setRecentLogins] = useState<SecurityLogResponseDto[]>([]);

	useEffect(() => {
		securityLogService.getRecentLogins(10).then((res: any) => {
			setRecentLogins(Array.isArray(res) ? res : res?.data ?? []);
		});
	}, []);

	return (
		<Box sx={{ width: '100%', p: '0 1.5rem' }}>
			<PathBreadcrumbs />

			<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
				{/* 최근 로그인 이력 위젯 */}
				<Card variant="outlined">
					<CardHeader
						title="최근 로그인 이력"
						titleTypographyProps={{ fontSize: '0.9375rem', fontWeight: 600 }}
						sx={{ pb: 0 }}
					/>
					<CardContent sx={{ px: 0, py: 0, '&:last-child': { pb: 0 } }}>
						{recentLogins.length === 0 ? (
							<Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 2 }}>
								데이터가 없습니다.
							</Typography>
						) : (
							recentLogins.map((log, idx) => (
								<Box key={log.id}>
									{idx > 0 && <Divider />}
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.25 }}>
										<Chip
											label={EVENT_TYPE_LABEL[log.eventType]?.label ?? log.eventType}
											color={EVENT_TYPE_LABEL[log.eventType]?.color ?? 'default'}
											size="small"
											sx={{ fontSize: '0.75rem', minWidth: 80 }}
										/>
										<Box sx={{ flex: 1, minWidth: 0 }}>
											<Typography variant="body2" fontWeight={500} noWrap>
												{log.loginId ?? '-'}
											</Typography>
											<Typography variant="caption" color="text.secondary" noWrap>
												{log.ip} · {log.deviceType ?? '-'}
											</Typography>
										</Box>
										<Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
											{dayjs(log.registerDate).format('MM-DD HH:mm')}
										</Typography>
									</Box>
								</Box>
							))
						)}
					</CardContent>
				</Card>
			</Box>
		</Box>
	);
}
