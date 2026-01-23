import type { Metadata } from 'next';

/** MUI */
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme/Theme';

/** Custom */
import ClientLocalizationProvider from './_component/baseElement/ClientLocalizationProvider';

/** CSS */
import '@/style/globals.css';
import Loader from './_component/baseElement/Loader';

export const metadata: Metadata = {
	title: 'EASY-C',
	description: 'Make your work life easier than ever!',
};

export default function RootLayout({
	children,
	modal,
}: Readonly<{
	children: React.ReactNode;
	modal: React.ReactNode;
}>) {
	return (
		<html lang='ko' suppressHydrationWarning>
			<body>
				<AppRouterCacheProvider>
					<ThemeProvider theme={theme}>
						<ClientLocalizationProvider>
							<CssBaseline />
							{children}
							{modal}
							<Loader />
						</ClientLocalizationProvider>
					</ThemeProvider>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
