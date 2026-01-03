'use client';

import React, { useMemo, useState } from 'react';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { TextField, Box, InputAdornment } from '@mui/material';
import theme from '@/theme/Theme';
import { Search } from '@mui/icons-material';

export interface FlatData {
	id: number;
	upperNo: number | null;
	label: string;
	sortOrder: number;
}

export interface TreeNode extends FlatData {
	children: TreeNode[];
}

export const buildTree = (data: FlatData[]): TreeNode[] => {
	const map: { [key: number]: TreeNode } = {};
	const roots: TreeNode[] = [];

	data.forEach((item) => {
		map[item.id] = { ...item, children: [] };
	});

	data.forEach((item) => {
		const node = map[item.id];
		if (item.upperNo !== null && map[item.upperNo]) {
			map[item.upperNo].children.push(node);
		} else {
			roots.push(node);
		}
	});

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

const RecursiveTreeItem = ({ nodes, searchTerm }: { nodes: TreeNode[]; searchTerm: string }) => {
	return (
		<>
			{nodes.map((node) => (
				<TreeItem key={node.id} itemId={String(node.id)} label={<HighlightText text={node.label} highlight={searchTerm} />}>
					{node.children.length > 0 && <RecursiveTreeItem nodes={node.children} searchTerm={searchTerm} />}
				</TreeItem>
			))}
		</>
	);
};

export default function MyTreeView({ dbData }: { dbData: FlatData[] }) {
	const [searchTerm, setSearchTerm] = useState('');

	const treeStructure = useMemo(() => buildTree(dbData), [dbData]);

	return (
		<Box sx={{ '& input': { fontSize: '.875rem' }, '& .MuiTreeItem-label ': { fontSize: '.875rem' } }}>
			<TextField
				fullWidth
				variant='outlined'
				hiddenLabel
				placeholder='부서/부서원을 검색하세요.'
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

			<SimpleTreeView>
				<RecursiveTreeItem nodes={treeStructure} searchTerm={searchTerm} />
			</SimpleTreeView>
		</Box>
	);
}
