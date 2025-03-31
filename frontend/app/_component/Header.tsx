import { Dispatch, SetStateAction } from 'react';

/** MUI */
import { Box, IconButton, Paper, Stack } from '@mui/material';
import { FormatIndentIncrease, PersonOutlineRounded } from '@mui/icons-material';

interface propsType {
	drawerOpen: boolean;
	setDrawerOpen: Dispatch<SetStateAction<boolean>>;
	headerHeight: string;
}

export default function Header(props: propsType) {
	const { drawerOpen, setDrawerOpen, headerHeight } = props;

	const onClickDrawerButton = () => {
		setDrawerOpen(!drawerOpen);
	};

	return (
		<Paper
			elevation={2}
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				width: '100%',
				height: headerHeight,
				padding: '0 1rem',
				borderRadius: 0,
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<IconButton className="contained-primary " onClick={onClickDrawerButton}>
					<FormatIndentIncrease className="svg-small" />
				</IconButton>
			</Box>
			<Box>
				<Stack direction={'row'} spacing={'0.75rem'} sx={{ height: '100%', alignItems: 'center' }}>
					<IconButton className="contained-primary">
						<FormatIndentIncrease className="svg-small" />
					</IconButton>
					<IconButton className="contained-primary">
						<FormatIndentIncrease className="svg-small" />
					</IconButton>
					<IconButton className="contained-primary">
						<FormatIndentIncrease className="svg-small" />
					</IconButton>
					<IconButton className="circle-primary">
						<PersonOutlineRounded />
					</IconButton>
				</Stack>
			</Box>
		</Paper>
	);
}