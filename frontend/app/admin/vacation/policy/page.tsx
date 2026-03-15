'use client';

import { useCallback, useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/** Lib */
import useLoaderStore from '@/store/useLoaderStore';
import useModalStore from '@/store/useModalStore';

/** MUI */
import { Box, Button, Grid, IconButton, Typography, Chip } from '@mui/material';
import { DeleteRounded, BorderColorRounded, CloseRounded, CheckRounded } from '@mui/icons-material';
import { grey } from '@mui/material/colors';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';

/** Type / Interface */
import { VacationPolicyDto, vacationPolicyService } from '@/app/services/vacationPolicyService';
import { VACATIONPOLICYTYPE, VACATIONPOLICYUNIT } from '@/constant/vacationConst';

interface listCollector {
	name: string;
	key: string;
	valueFormatter?: (data: VacationPolicyDto) => ReactNode;
}

export default function VacationPolicyPage() {
	const router = useRouter();
	const pathName = usePathname();
	const { loader, setLoader } = useLoaderStore();
	const { setModalData } = useModalStore();

	const [policyData, setPolicyData] = useState<VacationPolicyDto[]>([]);

	const list: listCollector[] = [
		{ name: '휴가생성 기준', key: 'vacationPolicyType', valueFormatter: (data) => <Box>{VACATIONPOLICYTYPE[data.vacationPolicyType] + ' 기준'}</Box> },
		{ name: '휴가사용 단위', key: 'vacationPolicyUnit', valueFormatter: (data) => <Box>{VACATIONPOLICYUNIT[data.vacationPolicyUnit]}</Box> },
		{
			name: '내년연차 사용',
			key: 'nextYearLeaveUsed',
			valueFormatter: (data) => <Box>{data.nextYearLeaveUsed ? <CheckRounded fontSize='small' /> : <CloseRounded fontSize='small' />}</Box>,
		},

		{
			name: '적용 근로자(명)',
			key: 'mappingUserCount',
			valueFormatter: (data) => (
				<Box>
					{data.mappingUserCount ?? '-'}명{' '}
					<IconButton
						sx={{ color: grey[500] }}
						onClick={(e) => {
							setModalData({ policyId: data.vacationPolicyId });
							router.push('/admin/vacation/policy/modal');
						}}
					>
						<BorderColorRounded sx={{ fontSize: '1rem' }} />
					</IconButton>
				</Box>
			),
		},
	];

	useEffect(() => {
		getVacationPolicyData();
	}, [pathName]);

	const getVacationPolicyData = async () => {
		if (!loader) setLoader(true);

		try {
			const res = await vacationPolicyService.getVacationPolicyData();
			setPolicyData(res);
		} catch (error: any) {
		} finally {
			setLoader(false);
		}
	};

	const onClickUpdateButton = useCallback(
		async (event: React.MouseEventHandler<HTMLButtonElement>, item: VacationPolicyDto) => {
			if (item.vacationPolicyId) {
				setModalData(item);
				router.push(`/admin/vacation/policy/data?target=${btoa(item.vacationPolicyId.toString())}`);
			}
		},
		[policyData],
	);

	const onClickDeleteButton = useCallback(
		async (event: React.MouseEventHandler<HTMLButtonElement>, item: VacationPolicyDto) => {
			try {
				if (item.vacationPolicyId && confirm('정말 해당 정책을 삭제하시겠습니까?')) {
					setLoader(true);

					const encodedId = btoa(item.vacationPolicyId.toString());
					await vacationPolicyService.delteVacationPolicyData(encodedId);

					if (confirm('정책이 성공적으로 삭제되었습니다.')) {
						getVacationPolicyData();
					}
				}
			} catch (error: any) {
			} finally {
				setLoader(false);
			}
		},
		[policyData],
	);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
			<PathBreadcrumbs sx={{ padding: '0 1.5rem' }}>
				<Button variant='contained' sx={{ height: 'auto' }} onClick={() => router.push('/admin/vacation/policy/data')}>
					정책 추가
				</Button>
			</PathBreadcrumbs>
			<Grid container sx={{ flexWrap: 'wrap', flexDirection: 'row', padding: '0 1.5rem', gap: 3 }}>
				{policyData.map((item, idx) => {
					return (
						<Grid
							key={idx}
							sx={{
								border: '1px solid',
								borderColor: idx === 0 ? 'primary.100' : 'grey.200',
								bgcolor: idx === 0 ? 'primary.50' : '',
								borderRadius: '1.5rem',
							}}
						>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: idx === 0 ? 'space-between' : 'end',
									alignItems: 'center',
									height: '3rem',
									padding: '0.5rem',
									gap: 0.5,
								}}
							>
								{idx === 0 ? (
									<Chip label='기본정책' variant='outlined' color='primary' size='small' />
								) : (
									<>
										<IconButton sx={{ color: grey[500] }} onClick={(e) => onClickUpdateButton(e, item)}>
											<BorderColorRounded sx={{ fontSize: '1rem' }} />
										</IconButton>
										<IconButton sx={{ color: grey[500] }} onClick={(e) => onClickDeleteButton(e, item)}>
											<DeleteRounded sx={{ fontSize: '1rem' }} />
										</IconButton>
									</>
								)}
							</Box>
							<Box sx={{ px: '1.5rem', paddingBottom: '2rem' }}>
								<Typography variant='h6'>{item.vacationPolicyName}</Typography>
								<Box component={'ul'} sx={{ marginTop: '1rem' }}>
									{list.map((listItem, listIdx) => {
										return (
											<Box key={listIdx} sx={{ display: 'flex', flexDirection: 'row', marginBottom: '0.25rem' }}>
												<Typography sx={{ width: '8rem' }}>{listItem.name}</Typography>
												{listItem.valueFormatter ? listItem.valueFormatter(item) : <Box>{item[listItem.key]}</Box>}
											</Box>
										);
									})}
								</Box>
							</Box>
						</Grid>
					);
				})}
			</Grid>
		</Box>
	);
}
