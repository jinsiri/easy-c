'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { TextField, Box, InputAdornment, alpha } from '@mui/material';
import theme from '@/theme/Theme';
import { AccountBox, Business, ChevronRight, ExpandMore, Person, Search } from '@mui/icons-material';
import { styled } from '@mui/system';

export type TreeData<T> = T & {
	id: string | number;
	label: string;
	treeParentId: string | number | null;
	treeSiblingOrder: number;
	treeChildCount: number;
};

export type TreeNode<T> = TreeData<T> & {
	children: TreeNode<T>[];
};

const getIconByDataType = (type: string) => {
	switch (type) {
		case 'dept':
			return <Business />;
		case 'deptMember':
			return <AccountBox />;
		default:
			return null;
	}
};

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
	color: theme.palette.grey[200],
	[`& .${treeItemClasses.content}`]: {
		borderRadius: theme.spacing(0.5),
		padding: theme.spacing(0.5, 1),
		margin: theme.spacing(0.2, 0),
		[`& .${treeItemClasses.label}`]: {
			fontSize: '0.8rem',
			fontWeight: 500,
		},
	},
	[`& .${treeItemClasses.iconContainer}`]: {
		borderRadius: '50%',
		backgroundColor: theme.palette.primary.dark,
		padding: theme.spacing(0, 1.2),
		...theme.applyStyles('light', {
			backgroundColor: alpha(theme.palette.primary.main, 0.25),
		}),
		...theme.applyStyles('dark', {
			color: theme.palette.primary.contrastText,
		}),
	},
	[`& .${treeItemClasses.groupTransition}`]: {
		marginLeft: 15,
		paddingLeft: 18,
		borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
	},
	...theme.applyStyles('light', {
		color: theme.palette.grey[800],
	}),
}));

export const buildTree = <T,>(data: TreeData<T>[]): TreeNode<T>[] => {
	const map: { [key: string]: TreeNode<T> } = {};
	const roots: TreeNode<T>[] = [];

	data.forEach((item) => {
		map[String(item.id)] = { ...item, children: [] };
	});

	data.forEach((item) => {
		const node = map[String(item.id)];
		if (item.treeParentId !== null && map[String(item.treeParentId)]) {
			map[String(item.treeParentId)].children.push(node);
		} else {
			roots.push(node);
		}
	});

	const sortTree = (nodes: TreeNode<T>[]) => {
		nodes.sort((a, b) => a.treeSiblingOrder - b.treeSiblingOrder);
		nodes.forEach((node) => {
			if (node.children.length > 0) sortTree(node.children);
		});
	};

	sortTree(roots);
	return roots;
};

const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
	if (!highlight.trim()) return <>{text}</>;
	const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
	return (
		<span>
			{parts.map((part, i) =>
				part.toLowerCase() === highlight.toLowerCase() ? (
					<mark key={i} style={{ backgroundColor: theme.palette.secondary.main, color: 'black' }}>
						{part}
					</mark>
				) : (
					part
				),
			)}
		</span>
	);
};

const RecursiveTreeItem = <T,>({ nodes, searchTerm }: { nodes: TreeNode<T>[]; searchTerm: string }) => {
	return (
		<>
			{nodes.map((node) => (
				<CustomTreeItem
					key={String(node.id)}
					itemId={String(node.id)}
					label={
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<Box sx={{ display: 'flex', mr: 1, '& svg': { fontSize: '1.125rem' } }}>{getIconByDataType((node as any).dataType)}</Box>
							<HighlightText text={`${node.label}${node.treeChildCount ? `(${node.treeChildCount})` : ''}`} highlight={searchTerm} />
						</Box>
					}
				>
					{node.children.length > 0 && <RecursiveTreeItem nodes={node.children} searchTerm={searchTerm} />}
				</CustomTreeItem>
			))}
		</>
	);
};

interface Props<T> {
	rawData: T[];
	mapEntityToTree: (item: T) => TreeData<T>;
	selectedId?: number | string;
	onNodeClick?: (node: TreeNode<T>) => void;
	expandedIds?: string[];
	onExpandedItemsChange?: (itemIds: string[]) => void;
	placeholder?: string;
}

export default function CommonTreeview<T>({
	rawData,
	mapEntityToTree,
	selectedId,
	onNodeClick,
	expandedIds,
	onExpandedItemsChange,
	placeholder = '검색어를 입력하세요.',
}: Props<T>) {
	const [searchTerm, setSearchTerm] = useState('');

	const treeStructure = useMemo(() => {
		const formattedData = rawData.map(mapEntityToTree);
		return buildTree(formattedData);
	}, [rawData, mapEntityToTree]);

	return (
		<Box sx={{ '& input': { fontSize: '.875rem' }, '& .MuiTreeItem-label ': { fontSize: '.875rem' } }}>
			<TextField
				fullWidth
				variant='outlined'
				hiddenLabel
				placeholder={placeholder}
				slotProps={{
					input: {
						startAdornment: (
							<InputAdornment position='start'>
								<Search className='svg-small' />
							</InputAdornment>
						),
					},
				}}
				onChange={(e) => setSearchTerm(e.target.value)}
				sx={{ mb: 2 }}
			/>

			<SimpleTreeView
				expansionTrigger='iconContainer'
				selectedItems={selectedId ? String(selectedId) : null}
				expandedItems={expandedIds}
				onExpandedItemsChange={(event, itemIds) => {
					if (onExpandedItemsChange) {
						onExpandedItemsChange(itemIds);
					}
				}}
				onSelectedItemsChange={(_, itemId) => {
					if (!itemId) return;

					if (onNodeClick) {
						const findNode = (nodes: TreeNode<T>[]): TreeNode<T> | undefined => {
							for (const n of nodes) {
								if (String(n.id) === itemId) return n;
								if (n.children) {
									const found = findNode(n.children);
									if (found) return found;
								}
							}
						};
						const clickedNode = findNode(treeStructure);
						if (clickedNode) onNodeClick(clickedNode);
					}
				}}
				slots={{
					collapseIcon: ExpandMore,
					expandIcon: ChevronRight,
				}}
			>
				<RecursiveTreeItem nodes={treeStructure} searchTerm={searchTerm} />
			</SimpleTreeView>
		</Box>
	);
}
