'use client';

import { Box, Stack, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, InputBase, Select, MenuItem, useTheme } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { MemberColDef } from '@/app/admin/member/_constant/formConst';
import { makeEmptyRow } from '@/app/admin/member/_utils/formUtil';

interface Props {
	title: string;
	name: 'careerList' | 'rewardDisciplineList' | 'qualificationList' | 'languageList';
	control: Control<any>;
	cols: MemberColDef[];
}

export default function MemberTableField({ title, name, control, cols }: Props) {
	const theme = useTheme();
	const { fields, append, remove } = useFieldArray({ control, name });

	return (
		<Box component='article' sx={{ mb: 4 }}>
			<Box sx={{ display: 'flex', alignItems: 'center', py: '0.5rem' }}>
				<Box sx={{ fontWeight: 600 }}>{title}</Box>
				<Box sx={{ flexGrow: 1, height: '1px', ml: '1rem', backgroundColor: theme.palette.divider }} />
			</Box>
			<Stack direction='row' justifyContent='flex-end' sx={{ mb: 1 }}>
				<Button size='small' variant='outlined' startIcon={<Add />} onClick={() => append(makeEmptyRow(cols))}>
					행 추가
				</Button>
			</Stack>
			<Table size='small' sx={{ border: `1px solid ${theme.palette.divider}` }}>
				<TableHead>
					<TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
						{cols.map((col) => (
							<TableCell key={col.key} sx={{ fontWeight: 600, borderRight: `1px solid ${theme.palette.divider}` }}>
								{col.label}
							</TableCell>
						))}
						<TableCell sx={{ width: 50 }} />
					</TableRow>
				</TableHead>
				<TableBody>
					{fields.length === 0 ? (
						<TableRow>
							<TableCell colSpan={cols.length + 1} align='center' sx={{ py: 3, color: 'text.secondary' }}>
								데이터가 없습니다.
							</TableCell>
						</TableRow>
					) : (
						fields.map((field, idx) => (
							<TableRow key={field.id}>
								{cols.map((col) => (
									<TableCell key={col.key} sx={{ p: 0, borderRight: `1px solid ${theme.palette.divider}` }}>
										<Controller
											name={`${name}.${idx}.${col.key}`}
											control={control}
											render={({ field: { onChange, value } }) => (
												<InputBase
													fullWidth
													value={value ?? ''}
													onChange={onChange}
													type={col.type ?? 'text'}
													sx={{ px: 1, fontSize: '0.875rem' }}
												/>
											)}
										/>
									</TableCell>
								))}
								<TableCell align='center'>
									<IconButton size='small' color='error' onClick={() => remove(idx)}>
										<Delete fontSize='small' />
									</IconButton>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</Box>
	);
}
