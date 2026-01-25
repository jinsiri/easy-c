'use client';

import React, { useMemo, useState } from 'react';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { TextField, Box, InputAdornment } from '@mui/material';
import theme from '@/theme/Theme';
import { Search } from '@mui/icons-material';

export type TreeData<T> = T & {
	id: string | number;
	label: string;
	treeParentId: string | number | null;
	treeSiblingOrder: number;
};

export type TreeNode<T> = TreeData<T> & {
	children: TreeNode<T>[];
};

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
				<TreeItem key={String(node.id)} itemId={String(node.id)} label={<HighlightText text={node.label} highlight={searchTerm} />}>
					{node.children.length > 0 && <RecursiveTreeItem nodes={node.children} searchTerm={searchTerm} />}
				</TreeItem>
			))}
		</>
	);
};

interface Props<T> {
	rawData: T[];
	mapEntityToTree: (item: T) => TreeData<T>;
	onNodeClick?: (node: TreeNode<T>) => void;
	placeholder?: string;
}

export default function CommonTreeview<T>({ rawData, mapEntityToTree, onNodeClick, placeholder = '검색어를 입력하세요.' }: Props<T>) {
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
				onSelectedItemsChange={(_, itemId) => {
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
			>
				<RecursiveTreeItem nodes={treeStructure} searchTerm={searchTerm} />
			</SimpleTreeView>
		</Box>
	);
}
