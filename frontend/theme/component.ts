import { Theme } from '@mui/material/styles';

import Accordion from './_override/Accordion';
import Alert from './_override/Alert';
import Button from './_override/Button';
import Dialog from './_override/Dialog';
import IconButton from './_override/IconButton';
import InputLabel from './_override/InputLabel';
import ListItemIcon from './_override/ListItemIcon';
import MuiCssBaseline from './_override/MuiCssBaseline';
import OutlinedInput from './_override/OutlinedInput';
import PickersTextField from './_override/PickersTextField';
import Tab from './_override/Tab';

const component = (theme: Theme) => ({
	...Alert(theme),
	...Accordion(theme),
	...Button(theme),
	...Dialog(theme),
	...IconButton(theme),
	...InputLabel(theme),
	...ListItemIcon(theme),
	...MuiCssBaseline(theme),
	...OutlinedInput(theme),
	...PickersTextField(theme),
	...Tab(theme),
});

export default component;
