import { Theme } from '@mui/material/styles';

import ButtonBase from './_override/ButtonBase';
import Dialog from './_override/Dialog';
import IconButton from './_override/IconButton';
import ListItemIcon from './_override/ListItemIcon';
import MuiCssBaseline from './_override/MuiCssBaseline';
import OutlinedInput from './_override/OutlinedInput';
import Tab from './_override/Tab';

const component = (theme: Theme) => ({
	...ButtonBase(theme),
	...Dialog(theme),
	...IconButton(theme),
	...ListItemIcon(theme),
	...MuiCssBaseline(theme),
	...OutlinedInput(theme),
	...Tab(theme),
});

export default component;
