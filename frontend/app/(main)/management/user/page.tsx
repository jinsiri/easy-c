'use client';

/** MUI */
import {Box, Grid, useTheme} from '@mui/material';

/** Custom */
import PathBreadcrumbs from '../../../_component/PathBreadcrumbs';
import MemberDetail from "@/app/admin/member/_component/MemberDetail";
import secureLocalStorage from "react-secure-storage";

export default function ManagementUserPage() {
	const theme = useTheme();
	const loginedMemberId = secureLocalStorage.getItem('memberId') as number;
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem' }}>
			<PathBreadcrumbs />
			<Grid container spacing={4} sx={{ flexGrow: 1, width: '100%', height: '100%' }}>
				<MemberDetail selectedId={loginedMemberId} />
			</Grid>
		</Box>
	);
}
