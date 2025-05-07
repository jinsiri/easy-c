import { Theme } from '@mui/material/styles';

import IconButton from './_override/IconButton';

const component = (theme: Theme) => ({
        ...IconButton(theme),

});

export default component;