import type { Metadata } from 'next';

/** MUI */
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme/Theme';

/** Custom */
import ClientLocalizationProvider from './_component/baseElement/ClientLocalizationProvider';
import Loader from './_component/baseElement/Loader';

/** CSS */
import '@/style/globals.css';
import { SystemDialog } from '@/app/_component/baseElement/SystemDialog';

export const metadata: Metadata = {
	title: 'EASY-C',
	description: 'Make your work life easier than ever!',
	icons: {
		icon: [
			{ url: '/images/favicon/favicon.ico', type: 'image/x-icon' },
			{ url: '/images/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
			{ url: '/images/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
			{
				url: '/images/favicon/android-chrome-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				url: '/images/favicon/android-chrome-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
		apple: [{ url: '/images/favicon/apple-touch-icon.png', sizes: '180x180' }],
	},
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
							<SystemDialog />
							<Loader />
						</ClientLocalizationProvider>
					</ThemeProvider>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
