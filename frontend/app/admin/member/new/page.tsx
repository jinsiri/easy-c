'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	Box,
	Button,
	Checkbox,
	Grid,
	IconButton,
	InputBase,
	MenuItem,
	OutlinedInput,
	Select,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
	useTheme,
} from '@mui/material';
import { Add, ArrowBack, Delete } from '@mui/icons-material';
import { MemberBundleResponseDto, memberService } from '@/app/services/memberService';
import { useDialogStore } from '@/store/useDialogStore';
import { CAREER_COLS, REWARD_COLS, QUALIFICATION_COLS, LANGUAGE_COLS, MemberColDef, MemberFieldDef } from '@/app/admin/member/_constant/formConst';
import { getMemberFormSections, getOptions, makeEmptyRow } from '@/app/admin/member/_utils/formUtil';
import { z } from 'zod';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// ===== 필드 정의 =====
const createInfoSections = getMemberFormSections('create');

// ===== 유효성 검사 =====
const memberSchema = z
	.object({
		// 기본 정보
		loginId: z.string().min(4, '아이디는 4자 이상이어야 합니다.'),
		password: z
			.string()
			.min(8, '비밀번호는 8자 이상이어야 합니다.')
			.regex(/[A-Za-z]/, '영문을 포함해야 합니다.')
			.regex(/[0-9]/, '숫자를 포함해야 합니다.'),
		passwordCheck: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
		memberNm: z.string().min(1, '직원 이름은 필수입니다.'),
		employeeId: z.string().min(1, '사번은 필수입니다.'),
		extensionNumber: z.string().default(''),
		departmentPosition: z.string().default(''), //todo
		jobPosition: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
		jobGrade: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
		jobTitle: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
		jobRole: z.string().default(''),
		email: z
			.string()
			.refine((val) => val === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
				message: '이메일 형식이 올바르지 않습니다.',
			})
			.default(''),
		hireDate: z.string().min(1, '입사일은 필수입니다.'),
		employmentStatus: z.string().default('ACTIVE'),
		employmentType: z.string().min(1, '직원구분은 필수입니다.'),
		recruitmentType: z.string().min(1, '채용 구분은 필수입니다.'),
		salaryType: z.string().min(1, '급여 구분은 필수입니다.'),
		referredBy: z.string().default(''),
		resignationDate: z.string().default(''),
		memberNmEn: z.string().default(''),
		phoneNumber: z.string().default(''),
		externalEmail: z
			.string()
			.refine((val) => val === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
				message: '이메일 형식이 올바르지 않습니다.',
			})
			.default(''),
		gender: z.string().min(1, '성별은 필수입니다.'),
		nationality: z.string().default('KR'),
		dateOfBirth: z.string().default(''),
		address: z.string().default(''),
		faxNumber: z.string().default(''),
		// 보훈 정보
		veteranNumber: z.string().default(''),
		veteranType: z.string().default('NONE'),
		veteranFamily: z.string().default(''),
		// 장애 정보
		disabilityRegistrationNumber: z.string().default(''),
		disabilityType: z.string().default('NONE'),
		disabilityRecognition: z.string().default('NONE'),
		disabilityGrade: z.string().default(''),
		// 계좌 정보
		bankName: z.string().default(''),
		accountHolderName: z.string().default(''),
		accountNumber: z.string().default(''),
		// 리스트 데이터 (동적 테이블용)
		careerList: z.array(z.any()).default([]),
		rewardDisciplineList: z.array(z.any()).default([]),
		qualificationList: z.array(z.any()).default([]),
		languageList: z.array(z.any()).default([]),
	})
	.refine((data) => data.password === data.passwordCheck, {
		path: ['passwordCheck'],
		message: '비밀번호가 일치하지 않습니다.',
	});

export type MemberFormValues = z.infer<typeof memberSchema>;

// ===== 컴포넌트 =====
export default function MemberNewPage() {
	const router = useRouter();
	const theme = useTheme();
	const { alert, success } = useDialogStore();
	const [saving, setSaving] = useState(false);
	const [memberBundle, setMemberBundle] = useState<MemberBundleResponseDto>({});
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<MemberFormValues>({
		resolver: zodResolver(memberSchema) as any,
		mode: 'onBlur',
		reValidateMode: 'onBlur',
		defaultValues: {
			loginId: '',
			password: '',
			passwordCheck: '',
			memberNm: '',
			employeeId: '',
			extensionNumber: '',
			departmentPosition: '',
			jobPosition: '' as any,
			jobGrade: '' as any,
			jobTitle: '' as any,
			jobRole: '',
			email: '',
			hireDate: '',
			employmentStatus: 'ACTIVE',
			employmentType: '',
			recruitmentType: '',
			salaryType: '',
			referredBy: '',
			resignationDate: '',
			// 개인 정보
			memberNmEn: '',
			phoneNumber: '',
			externalEmail: '',
			gender: '',
			nationality: 'KR',
			dateOfBirth: '',
			address: '',
			faxNumber: '',
			// 보훈 정보
			veteranNumber: '',
			veteranType: 'NONE',
			veteranFamily: '',
			// 장애 정보
			disabilityRegistrationNumber: '',
			disabilityType: 'NONE',
			disabilityRecognition: 'NONE',
			disabilityGrade: '',
			// 계좌 정보
			bankName: '',
			accountHolderName: '',
			accountNumber: '',
			careerList: [],
			rewardDisciplineList: [],
			qualificationList: [],
			languageList: [],
		},
	});
	const career = useFieldArray({ control, name: 'careerList' });
	const reward = useFieldArray({ control, name: 'rewardDisciplineList' });
	const qual = useFieldArray({ control, name: 'qualificationList' });
	const lang = useFieldArray({ control, name: 'languageList' });

	const fetchMemberBundle = async () => {
		return await memberService.getMemberBundle();
	};

	useEffect(() => {
		fetchMemberBundle().then((data) => setMemberBundle(data));
	}, []);

	const onValid: SubmitHandler<MemberFormValues> = async (data) => {
		setSaving(true);
		try {
			const { passwordCheck, ...payload } = data;

			await memberService.createMember(payload);
			await success('멤버가 등록되었습니다.');
			router.push('/admin/dept/member');
		} catch (err) {
			await alert('등록 중 오류가 발생했습니다.');
		} finally {
			setSaving(false);
		}
	};

	// ===== 필드형 렌더링 (date/select/text 분기) =====
	const renderField = useCallback(
		(field: MemberFieldDef) => {
			return (
				<Controller
					name={field.key as any}
					control={control}
					render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => {
						const commonProps = {
							size: 'small' as const,
							sx: { width: '100%' },
							error: !!error,
							onBlur,
						};

						return (
							<Box sx={{ width: '100%' }}>
								{field.type === 'checkbox' ? (
									<Checkbox {...commonProps} checked={value === 'true'} onChange={(e) => onChange(e.target.checked ? 'true' : '')} />
								) : field.type === 'select' ? (
									<Select {...commonProps} displayEmpty value={value ?? ''} onChange={onChange}>
										<MenuItem value=''>
											<em style={{ color: '#aaa' }}>선택</em>
										</MenuItem>
										{getOptions(field, memberBundle).map((opt) => (
											<MenuItem key={opt.value} value={opt.value}>
												{opt.label}
											</MenuItem>
										))}
									</Select>
								) : (
									<OutlinedInput {...commonProps} type={field.type ?? 'text'} value={value ?? ''} onChange={onChange} />
								)}
								{error && (
									<Typography variant='caption' color='error' sx={{ mt: 0.5, display: 'block' }}>
										{error.message}
									</Typography>
								)}
							</Box>
						);
					}}
				/>
			);
		},
		[control, memberBundle],
	);

	// ===== 필드 섹션 렌더링 =====
	const tabTotalContent = useMemo(
		() => (
			<Grid container component='section' spacing={5} sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: '1rem' }}>
				{createInfoSections.map((section, si) => (
					<Grid component='article' key={si}>
						<Box sx={{ display: 'flex', alignItems: 'center', py: '0.5rem' }}>
							<Typography sx={{ fontWeight: 600 }}>{section.title}</Typography>
							<Box sx={{ flexGrow: 1, height: '1px', ml: '1rem', backgroundColor: theme.palette.divider }} />
						</Box>
						<Box
							sx={{
								display: 'flex',
								flexWrap: 'wrap',
								width: '100%',
								backgroundColor: theme.palette.grey[50],
								padding: '1rem',
								borderRadius: '1rem',
							}}
						>
							{section.fields.map((field) => (
								<Box
									key={field.key}
									sx={{
										display: 'flex',
										alignItems: 'center',
										flexBasis: field.wide ? '66.66%' : '33.33%',
										padding: '0.5rem 1rem',
										minWidth: '18rem',
										whiteSpace: 'nowrap',
									}}
								>
									<Box sx={{ width: '8rem', flexShrink: 0 }}>
										{field.label}
										{field.required && (
											<Box component='span' sx={{ color: 'error.main', ml: '2px' }}>
												*
											</Box>
										)}
									</Box>
									<Box sx={{ width: 'calc(100% - 8rem)' }}>{renderField(field)}</Box>
								</Box>
							))}
						</Box>
					</Grid>
				))}
			</Grid>
		),
		[theme, renderField],
	);

	// ===== 리스트 탭 =====
	const renderListTab = useCallback(
		(cols: MemberColDef[], name: string, arrayHelper: any) => {
			const { fields, append, remove } = arrayHelper;

			return (
				<Box>
					<Stack direction='row' justifyContent='flex-end' sx={{ mb: 1 }}>
						<Button size='small' variant='outlined' startIcon={<Add />} onClick={() => append(makeEmptyRow(cols))}>
							행 추가
						</Button>
					</Stack>
					<Table size='small' sx={{ border: `1px solid ${theme.palette.divider}`, borderCollapse: 'collapse' }}>
						<TableHead>
							<TableRow
								sx={{
									'& th': {
										fontWeight: 600,
										backgroundColor: theme.palette.grey[50],
										py: '0.625rem',
										px: '0.75rem',
										borderBottom: `2px solid ${theme.palette.divider}`,
										borderRight: `1px solid ${theme.palette.divider}`,
										'&:last-of-type': { borderRight: 'none' },
									},
								}}
							>
								{cols.map((col) => (
									<TableCell key={col.key}>{col.label}</TableCell>
								))}
								<TableCell />
							</TableRow>
						</TableHead>

						<TableBody>
							{fields.length === 0 ? (
								<TableRow>
									<TableCell colSpan={cols.length + 1} align='center' sx={{ py: 2, color: theme.palette.grey[400] }}>
										데이터가 없습니다. 행 추가 버튼을 클릭하여 추가하세요.
									</TableCell>
								</TableRow>
							) : (
								fields.map((field: any, idx: number) => (
									<TableRow key={field.id} sx={{ '&:hover': { backgroundColor: theme.palette.grey[50] } }}>
										{cols.map((col) => (
											<TableCell
												key={col.key}
												sx={{ p: 0, borderRight: `1px solid ${theme.palette.divider}`, ...(col.type === 'date' && { minWidth: 140 }) }}
											>
												<Controller
													name={`${name}.${idx}.${col.key}` as any}
													control={control}
													render={({ field: { onChange, value } }) => {
														if (col.type === 'select' && col.options) {
															return (
																<Select
																	size='small'
																	displayEmpty
																	value={value ?? ''}
																	onChange={onChange}
																	sx={{
																		width: '100%',
																		fontSize: '0.875rem',
																		'& .MuiOutlinedInput-notchedOutline': { border: 'none' },
																	}}
																>
																	<MenuItem value=''>
																		<em style={{ color: '#aaa' }}>선택</em>
																	</MenuItem>
																	{col.options.map((opt) => (
																		<MenuItem key={opt.value} value={opt.value.toString()}>
																			{opt.label}
																		</MenuItem>
																	))}
																</Select>
															);
														}

														return (
															<InputBase
																type={col.type ?? 'text'}
																value={value ?? ''}
																onChange={onChange}
																sx={{
																	px: '0.625rem',
																	width: '100%',
																	fontSize: '0.875rem',
																	'& input': { py: '0.5rem' },
																	'&.Mui-focused': { backgroundColor: 'primary.50' },
																}}
															/>
														);
													}}
												/>
											</TableCell>
										))}
										<TableCell sx={{ p: '4px', textAlign: 'center' }}>
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
		},
		[theme],
	);

	const FORM_SECTIONS = [
		{ title: '경력', name: 'careerList', cols: CAREER_COLS, helper: career },
		{ title: '포상/징계', name: 'rewardDisciplineList', cols: REWARD_COLS, helper: reward },
		{ title: '자격', name: 'qualificationList', cols: QUALIFICATION_COLS, helper: qual },
		{ title: '어학', name: 'languageList', cols: LANGUAGE_COLS, helper: lang },
	];

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			<Box sx={{ flexShrink: 0, width: '100%', padding: '0 1.5rem', my: '1rem' }}>
				<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
					<Button startIcon={<ArrowBack />} onClick={() => router.back()} disabled={saving}>
						뒤로가기
					</Button>
					<Button variant='contained' onClick={handleSubmit(onValid)} disabled={saving}>
						{saving ? '저장 중...' : '저장'}
					</Button>
				</Box>
			</Box>

			<Box>{tabTotalContent}</Box>

			<Stack spacing={4} sx={{ width: '100%', p: '1rem' }}>
				{FORM_SECTIONS.map((section) => (
					<Box key={section.name} component='article'>
						<Box sx={{ display: 'flex', alignItems: 'center', py: '0.5rem' }}>
							<Typography sx={{ fontWeight: 600 }}>{section.title}</Typography>
							<Box sx={{ flexGrow: 1, height: '1px', ml: '1rem', backgroundColor: theme.palette.divider }} />
						</Box>
						{renderListTab(section.cols, section.name, section.helper)}
					</Box>
				))}
			</Stack>
		</Box>
	);
}
