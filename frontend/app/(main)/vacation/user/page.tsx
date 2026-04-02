'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import secureLocalStorage from 'react-secure-storage';

/** Lib */
import useLoaderStore from '@/store/useLoaderStore';
import useModalStore from '@/store/useModalStore';

/** MUI */
import { Box, Button, Typography, Grid, useTheme } from '@mui/material';

/** Ag Grid */
import CustomAgGridComp from '@/app/_lib/CustomAgGridComp';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import VacationComp from '@/app/_component/layoutElement/VacationComp';

import CustomEchartComp from '@/app/_lib/CustomEchartComp';

/** Type / Interface */
import { vacationService, VacationDataDto, VacationHistoryDto } from '@/app/services/vacationService';
import { vacationApplicationDataDto, vacationApplicationService } from '@/app/services/vacationApplicationService';
import { colDefs, historyColDefs } from '@/constant/vacationColDef';

export default function VacationUserPage() {
	const theme = useTheme();
	const router = useRouter();
	const pathname = usePathname();
	const { loader, setLoader } = useLoaderStore();
	const { setModalData } = useModalStore();

	const [vacationData, setVacationData] = useState<VacationDataDto>(null);
	const [vacationHistory, setVacationHistory] = useState<VacationHistoryDto[]>([]);
	const [vacationList, setVacationList] = useState<vacationApplicationDataDto[]>([]);

	const [chartOption, setChartOption] = useState<Record<string, any>>({});

	useEffect(() => {
		getVacationData();
		getvacationApplicationList();
	}, [pathname]);

	const makeChartOption = (data: VacationDataDto) => {
		const _option = {
			grid: {
				left: 0,
				right: 0,
			},
			xAxis: {
				axisLabel: {
					show: true,
					color: 'rgba(0,0,0,0)',
				},
				splitLine: {
					show: false,
				},
				max: data.grantedDay,
			},
			yAxis: {
				data: [''],
				nameGap: 0,
				inverse: false,
			},
			series: [
				{
					type: 'bar',
					showBackground: true,
					barWidth: 15,
					itemStyle: {
						color: {
							type: 'linear',
							x: 0,
							x2: 1,
							colorStops: [
								{
									offset: 0,
									color: theme.palette.primary.main,
								},
								{
									offset: 1,
									color: '#61fbd5',
								},
							],
						},
					},
					data: [data.usedDay],
					backgroundStyle: {
						color: 'rgba(180, 180, 180, 0.2)',
					},
					markLine: {
						symbol: ['none'],
						label: {
							show: true,
							position: 'start',
							fontFamily: 'Pretendard Variable',
							color: theme.palette.grey[700],
						},
						lineStyle: {
							type: 'dashed',
							color: theme.palette.grey[500],
						},
						clip: false,
						data: [{ xAxis: data.usedDay }, { xAxis: data.grantedDay }],
					},
				},
			],
		};

		setChartOption(_option);
	};

	const getVacationData = async () => {
		if (!loader) setLoader(true);

		try {
			const encodedMemberId = btoa(String(secureLocalStorage.getItem('memberId')));
			const res = await vacationService.getVacationData(encodedMemberId);

			if (res) {
				setVacationData(res.vacation);
				setVacationHistory(res.history);
				makeChartOption(res.vacation);
			}
		} catch (error: any) {
		} finally {
			setLoader(false);
		}
	};

	const getvacationApplicationList = async () => {
		if (!loader) setLoader(true);

		try {
			const encodedMemberId = btoa(String(secureLocalStorage.getItem('memberId')));
			const res = await vacationApplicationService.getUserVacationApplicationData(encodedMemberId);

			if (res) setVacationList(res);
		} finally {
			setLoader(false);
		}
	};

	const onClickDetail = (data: any) => {
		setModalData(data);
		router.push('/vacation/user/modal?type=read');
	};

	const onClickRemove = (data: any) => {
		if (data.vacationApplicationId) {
			if (confirm('휴가신청을 취소하시겠습니까>')) {
				vacationApplicationService.deleteVacationApplication(data.vacationApplicationId);
				alert('휴가신청이 성공적으로 취소되었습니다.');
			}
		}
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs />
			<Grid container spacing={4} sx={{ flexGrow: 1, flexDirection: 'column', width: '100%', height: 'auto', gap: 2 }}>
				<Grid
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', sm: 'column', md: 'row' },
						borderRadius: '1rem',
						borderWidth: '1px',
						borderStyle: 'solid',
						borderColor: 'grey.300',
					}}
				>
					<Box sx={{ width: { sm: '100%', md: '50%' }, borderRight: '1px solid', borderColor: 'grey.300' }}>
						<VacationComp vacationData={vacationData} />
					</Box>
					<Box sx={{ width: { sm: '100%', md: '50%' }, borderRight: '1px solid', borderColor: 'grey.300' }}>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								padding: '1.5rem 1rem',
								gap: '1rem',
							}}
						>
							<Box>
								<Typography variant='h6'>연차 소진률</Typography>
								<Typography sx={{ color: 'grey.700' }}>
									연차를{' '}
									{vacationData && vacationData.usedDay && vacationData.grantedDay
										? (vacationData.usedDay / vacationData.grantedDay) * 100
										: 0}
									% 소진했습니다.
								</Typography>
							</Box>
							<Box sx={{ width: '100%', height: '4rem' }}>
								<CustomEchartComp chartType={'rank_bar'} option={chartOption} />
							</Box>
						</Box>
					</Box>
				</Grid>
				<Grid sx={{ display: 'flex', flexDirection: { lg: 'row', md: 'column', sm: 'column', xs: 'column' }, minHeight: '15rem', gap: '1rem' }}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							width: '100%',
							backgroundColor: 'grey.50',
							border: '1px solid',
							borderColor: 'grey.200',
							borderRadius: '1rem',
						}}
					>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem' }}>
							<Typography variant='subtitle1'>연차 지급 내역</Typography>
							<Button onClick={(e) => router.push(`/vacation/user/list?type=vacationHistory`)}>더보기</Button>
						</Box>
						<Box sx={{ flexGrow: 1, minHeight: '10rem', pb: '1rem', borderRadius: '1rem', backgroundColor: '#fff' }}>
							<CustomAgGridComp rowData={vacationHistory} colDefs={[...historyColDefs()]} rowSelectionMode='none' pagination={false} />
						</Box>
					</Box>
				</Grid>
				<Grid sx={{ display: 'flex', flexDirection: { lg: 'row', md: 'column', sm: 'column', xs: 'column' }, flexGrow: 1, gap: '1rem' }}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							width: '100%',
							backgroundColor: 'grey.50',
							border: '1px solid',
							borderColor: 'grey.200',
							borderRadius: '1rem',
						}}
					>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem' }}>
							<Typography variant='subtitle1'>휴가 신청 내역</Typography>
							<Button onClick={(e) => router.push(`/vacation/user/list?vacationApp`)}>더보기</Button>
						</Box>
						<Box sx={{ flexGrow: 1, minHeight: '15rem', pb: '1rem', borderRadius: '1rem', backgroundColor: '#fff' }}>
							<CustomAgGridComp
								rowData={vacationList}
								colDefs={[...colDefs(onClickDetail, onClickRemove)]}
								rowSelectionMode='none'
								pagination={false}
								rowHeight={56}
							/>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}
