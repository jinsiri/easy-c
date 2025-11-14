'use client';

import { usePathname } from 'next/navigation';

/** MUI */
import { Box, Breadcrumbs, Link } from '@mui/material';

/** Custom */
import { menuType } from '../_constant/Types';
import MainMenuItem from './menuItem/MainMenuItem';
import AdminMenuItem from './menuItem/AdminMenuItem';

// 메뉴 트리에서 url로 해당 메뉴 찾기
const findMenuByUrl = (menuList: menuType[], url: string): any | null => {
	for (const menu of menuList) {
		if (menu.url === '/' + url) return menu;
		if (menu.children && menu.children.length > 0) {
			const found = findMenuByUrl(menu.children, url);
			if (found) return found;
		}
	}
	return null;
};

export default function PathBreadcrumbs() {
	const pathname = usePathname();
	const pathSegments = pathname.split('/').filter(Boolean);

	// 각 경로에 맞는 메뉴 찾기
	const targetMenuItem: menuType[] = pathSegments[0] === 'admin' ? AdminMenuItem : MainMenuItem;
	const breadcrumbs: menuType[] = pathSegments.map((path) => findMenuByUrl(targetMenuItem, path)).filter(Boolean);

	return (
		<Box sx={{ width: '100%', padding: '1rem 0 0.125rem 0 ' }}>
			<Breadcrumbs aria-label='breadcrumb'>
				{breadcrumbs.length > 0 &&
					breadcrumbs.map((item: menuType) => {
						return (
							<Link key={item.id} href={item.url} color='text.primary' underline='hover' sx={{ fontSize: '0.875rem' }}>
								{item.title}
							</Link>
						);
					})}
			</Breadcrumbs>
		</Box>
	);
}
