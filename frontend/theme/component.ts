import { Theme } from '@mui/material/styles';

import IconButton from './_override/IconButton';
import OutlinedInput from './_override/OutlinedInput';

const component = (theme: Theme) => ({
	...IconButton(theme),
	...OutlinedInput(theme),
});

export default component;
