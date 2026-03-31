'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/** MUI */
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';

/** Custom */
import { menuType } from '@/type/types';
import MainMenuItem from './menuItem/MainMenuItem';
import AdminMenuItem from './menuItem/AdminMenuItem';

/** interface */
interface PathBreadcrumbsProps {
	sx?: any;
	children?: ReactNode;
}

// 메뉴 트리에서 url로 해당 메뉴 찾기
const findMenuById = (menuList: menuType[], targetId: string): any | null => {
	for (const menu of menuList) {
		if (menu.id === targetId) return menu;
		if (menu.children && menu.children.length > 0) {
			const found = findMenuById(menu.children, targetId);

			if (found) return found;
		} else {
			console.log('자식 없ㅇ음');
		}
	}
	return null;
};

export default function PathBreadcrumbs({ sx, children }: PathBreadcrumbsProps) {
	const pathname = usePathname();
	const [currentPathName, setCurrentPathName] = useState<string>('');
	const [breadcrumbs, setBreadcrumbs] = useState<menuType[]>([]);

	useEffect(() => {
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
					const splitList = [...pathSegments.slice(0, idx + 1)];
					if (pathSegments[0] !== 'admin') splitList.unshift('main');

					return findMenuById(_targetMenuItem, splitList.join('-'));
				})
				.filter(Boolean);
			setBreadcrumbs(_breadcrumbs);
		}
	}, [currentPathName]);

	const targetUrl = (targetIdx: number) => {
		let url = '';

		breadcrumbs.forEach((item: menuType, idx: number) => {
			if (targetIdx >= idx) {
				url += item.url;
			}
		});

		return url;
	};

	return (
		<Box component={'section'} sx={{ width: '100%', mb: '1.5rem', ...sx }}>
			<Box component={'article'} sx={{ width: '100%', padding: '1rem 0 0.25rem 0 ' }}>
				<Breadcrumbs aria-label='breadcrumb'>
					{breadcrumbs.length > 0 &&
						breadcrumbs.map((item: menuType, idx: number) => {
							return item.children ? (
								<Typography key={item.id} color={'text.secondary'}>
									{item.title}
								</Typography>
							) : (
								<Link
									key={item.id}
									href={targetUrl(idx)}
									color={breadcrumbs.length - 1 === idx ? 'primary.main' : 'text.secondary'}
									underline='hover'
								>
									{item.title}
								</Link>
							);
						})}
				</Breadcrumbs>
			</Box>
			<Box component={'article'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
				<Typography variant='h4' sx={{ fontWeight: '800' }}>
					{breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].title : ''}
				</Typography>
				{children}
			</Box>
		</Box>
	);
}
