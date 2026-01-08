import { Theme } from '@mui/material/styles';

import ButtonBase from './_override/ButtonBase';
import IconButton from './_override/IconButton';
import ListItemIcon from './_override/ListItemIcon';
import MuiCssBaseline from './_override/MuiCssBaseline';
import OutlinedInput from './_override/OutlinedInput';
import Tab from './_override/Tab';

const component = (theme: Theme) => ({
	...ButtonBase(theme),
	...IconButton(theme),
	...ListItemIcon(theme),
	...MuiCssBaseline(theme),
	...OutlinedInput(theme),
	...Tab(theme),
});

export default component;
