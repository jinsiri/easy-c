'use client';

/** MUI */
import { Box, Typography, useTheme } from '@mui/material';

/** Type / Interface */
import { MemberResponseDto, DeptMemberMapResponseDto } from '@/app/services/memberService';

export default function UserResorceComp({ userData, deptData }: { userData?: MemberResponseDto; deptData?: DeptMemberMapResponseDto }) {
	const theme = useTheme();

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				borderRadius: '1rem',
				padding: '1.5rem',
				backgroundColor: 'primary.50',
				minHeight: '14rem',
			}}
		>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					gap: 3,
				}}
			>
				<Box
					sx={{
						position: 'relative',
						width: '6rem',
						height: '6rem',
						background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.point.main})`,
						borderRadius: '50%',
					}}
				>
					<Box
						sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							translate: '-50% -50%',
							width: '5.75rem',
							height: '5.75rem',
							backgroundColor: 'primary.50',
							borderRadius: '50%',
						}}
					>
						<Box
							sx={{
								width: '5rem',
								height: '5rem',
								borderRadius: '50%',
								backgroundImage: 'url(/images/blank_profile.png)',
								backgroundOrigin: 'border-box',
								backgroundRepeat: 'no-repeat',
								backgroundPosition: 'center',
								backgroundSize: 'contain',
							}}
						></Box>
					</Box>
				</Box>
				<Box sx={{ mr: '0.25rem' }}>
					<Box sx={{ display: 'flex', alignItems: 'baseline' }}>
						<Typography variant='subtitle1' sx={{ fontWeight: '700' }}>
							{userData ? userData.memberNm : '-'}
						</Typography>
						<Typography sx={{ marginLeft: '0.25rem', fontWeight: '600' }}>{userData ? userData.jobPosition?.jobPositionNm : '-'}</Typography>
					</Box>
					<Box>
						<Typography variant='body2'>{deptData?.deptNm}</Typography>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
