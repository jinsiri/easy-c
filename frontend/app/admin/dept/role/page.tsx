'use client';

/** MUI */
import { Box, useTheme } from '@mui/material';

/** Custom */
import PathBreadcrumbs from '@/app/_component/PathBreadcrumbs';
import CommonTabs from '@/app/_component/CommonTabs';
import DeptRoleLayoutElement from '@/app/admin/dept/_component/DeptRoleLayoutElement';

export default function AdminDeptRolePage() {
	const theme = useTheme();

	const roleTabs = [
		{
			label: '직위',
			type: 'grid',
			content: <DeptRoleLayoutElement category={'POSITION'} />,
		},
		{
			label: '직책',
			type: 'grid',
			content: <DeptRoleLayoutElement category={'TITLE'} />,
		},
		{
			label: '직급',
			type: 'grid',
			content: <DeptRoleLayoutElement category={'GRADE'} />,
		},
		{
			label: '직무',
			type: 'grid',
			content: <DeptRoleLayoutElement category={'ROLE'} />,
		},
	];

	return (
		<>
			<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '0 1.5rem', bgcolor: theme.palette.grey[50] }}>
				<PathBreadcrumbs />
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						flexGrow: 1,
						padding: '1.125rem 0',
						borderRadius: '1rem',
						bgcolor: '#fff',
					}}
				>
					<CommonTabs
						tabs={roleTabs}
						containerSx={{
							display: 'flex',
							flexDirection: 'column',
						}}
					/>
				</Box>
			</Box>
		</>
	);
}
