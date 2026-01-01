'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { usePageTitleStore } from '@/store/store';

/** MUI */
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';

/** Custom */
import { menuType } from '../_constant/Types';
import MainMenuItem from './menuItem/MainMenuItem';
import AdminMenuItem from './menuItem/AdminMenuItem';

/** interface */
interface PathBreadcrumbsProps {
	children?: ReactNode;
}

// 메뉴 트리에서 url로 해당 메뉴 찾기
const findMenuById = (menuList: menuType[], targetId: string): any | null => {
	for (const menu of menuList) {
		if (menu.id === targetId) return menu;
		if (menu.children && menu.children.length > 0) {
			const found = findMenuById(menu.children, targetId);

			if (found) return found;
		}
	}
	return null;
};

export default function PathBreadcrumbs({ children }: PathBreadcrumbsProps) {
	const pathname = usePathname();
	const [currentPathName, setCurrentPathName] = useState<string>('');
	const [breadcrumbs, setBreadcrumbs] = useState<menuType[]>([]);

	useEffect(() => {
		console.log(pathname);
		console.log(currentPathName);
		if (pathname && pathname !== currentPathName) {
			setCurrentPathName(pathname);
		}
	}, [pathname]);

	useEffect(() => {
		if (currentPathName !== '') {
			const pathSegments = currentPathName.split('/').filter(Boolean);

			// 각 경로에 맞는 메뉴 찾기
			const _targetMenuItem: menuType[] = pathSegments[0] === 'admin' ? AdminMenuItem : MainMenuItem;
			const _breadcrumbs: menuType[] = pathSegments
				.map((path, idx) => {
					const currentId = [pathSegments[0] === 'admin' ? 'admin' : 'main', ...pathSegments.slice(0, idx + 1)].join('-');
					return findMenuById(_targetMenuItem, currentId);
				})
				.filter(Boolean);
			setBreadcrumbs(_breadcrumbs);
		}
	}, [currentPathName]);

	return (
		<Box component={'section'} sx={{ width: '100%', mb: '1.5rem' }}>
			<Box component={'article'} sx={{ width: '100%', padding: '1rem 0 0.25rem 0 ' }}>
				<Breadcrumbs aria-label='breadcrumb'>
					{breadcrumbs.length > 0 &&
						breadcrumbs.map((item: menuType, idx: number) => {
							return item.children ? (
								<Typography key={item.id} color={'text.secondary'} sx={{ fontSize: '0.875rem' }}>
									{item.title}
								</Typography>
							) : (
								<Link
									key={item.id}
									href={item.url}
									color={breadcrumbs.length - 1 === idx ? 'primary.main' : 'text.secondary'}
									underline='hover'
									sx={{ fontSize: '0.875rem' }}
								>
									{item.title}
								</Link>
							);
						})}
				</Breadcrumbs>
			</Box>
			<Box component={'article'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
				<Typography variant='h5' sx={{ fontWeight: '800' }}>
					{breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].title : ''}
				</Typography>
				{children}
			</Box>
		</Box>
	);
}
