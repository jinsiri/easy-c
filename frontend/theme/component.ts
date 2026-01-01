import { Theme } from '@mui/material/styles';

import ButtonBase from './_override/ButtonBase';
import IconButton from './_override/IconButton';
import OutlinedInput from './_override/OutlinedInput';
import Tab from './_override/Tab';
import ListItemIcon from './_override/ListItemIcon';

const component = (theme: Theme) => ({
	...ButtonBase(theme),
	...IconButton(theme),
	...ListItemIcon(theme),
	...OutlinedInput(theme),
	...Tab(theme),
});

export default component;
