'use client'

import type {} from '@mui/material/themeCssVarsAugmentation';
import {createTheme} from "@mui/material/styles";
import colorSchemes from "@/theme/colorSchemes";
import typography from "@/theme/typography";

const theme = createTheme({
    cssVariables: true,
    colorSchemes: colorSchemes,
    typography: typography
})

export default theme;