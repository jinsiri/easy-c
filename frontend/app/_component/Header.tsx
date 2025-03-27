import { Dispatch, SetStateAction } from 'react';

/** MUI */
import { Box, IconButton, Paper, Stack } from '@mui/material';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';

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
			elevation={3}
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				width: '100%',
				height: headerHeight,
				padding: '0.5rem 1rem',
				borderRadius: 0,
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<IconButton onClick={onClickDrawerButton}>
					<FormatIndentIncreaseIcon />
				</IconButton>
			</Box>
			<Box>
				<Stack direction={'row'} spacing={'0.5rem'} sx={{ height: '100%', alignItems: 'center' }}>
					<IconButton>
						<FormatIndentIncreaseIcon />
					</IconButton>
					<IconButton>
						<FormatIndentIncreaseIcon />
					</IconButton>
					<IconButton>
						<FormatIndentIncreaseIcon />
					</IconButton>
					<IconButton>
						<FormatIndentIncreaseIcon />
					</IconButton>
				</Stack>

			</Box>
		</Paper>
	);
}