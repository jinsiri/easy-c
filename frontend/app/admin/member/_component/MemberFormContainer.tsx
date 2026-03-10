import { z } from 'zod';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Checkbox, Grid, MenuItem, OutlinedInput, Select, Stack, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import MemberTableField from '@/app/admin/member/_component/MemberTableField';
import PasswordChangeDialog from '@/app/admin/member/_component/PasswordChangeDialog';
import { CAREER_COLS, LANGUAGE_COLS, MemberFieldDef, QUALIFICATION_COLS, REWARD_COLS } from '@/app/admin/member/_constant/formConst';
import { getMemberFormSections, getOptions } from '@/app/admin/member/_utils/formUtil';
import { MemberBundleResponseDto, memberService } from '@/app/services/memberService';
import { ArrowBack } from '@mui/icons-material';

const createMemberSchema = z
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
		jobRole: z.string().default(''), // todo: 이거 중앙관리할지 텍스트로 받을지 결정해야함
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

const updateMemberSchema = z.object({
	// 기본 정보
	loginId: z.string().min(4, '아이디는 4자 이상이어야 합니다.'),
	memberNm: z.string().min(1, '직원 이름은 필수입니다.'),
	employeeId: z.string().min(1, '사번은 필수입니다.'),
	extensionNumber: z.string().default(''),
	departmentPosition: z.string().default(''), //todo
	jobPosition: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
	jobGrade: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
	jobTitle: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
	jobRole: z.string().default(''), // todo: 이거 중앙관리할지 텍스트로 받을지 결정해야함
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
});

export type MemberCreateFormValues = z.infer<typeof createMemberSchema>;
export type MemberUpdateFormValues = z.infer<typeof updateMemberSchema>;
export type MemberFormValues = MemberCreateFormValues | MemberUpdateFormValues;

interface Props {
	isEdit?: boolean;
	initialData?: any;
	memberId?: number;
	onSubmit: (data: MemberFormValues) => Promise<void>;
}

export default function MemberFormContainer({ isEdit = false, initialData, memberId, onSubmit }: Props) {
	const router = useRouter();
	const theme = useTheme();

	const [saving, setSaving] = useState(false);
	const [pwDialogOpen, setPwDialogOpen] = useState(false);
	const [memberBundle, setMemberBundle] = useState<MemberBundleResponseDto>({});

	const currentSchema = isEdit ? updateMemberSchema : createMemberSchema;
	const formSections = useMemo(() => getMemberFormSections(isEdit ? 'edit' : 'create'), [isEdit]);

	const {
		reset,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<MemberFormValues>({
		resolver: zodResolver(currentSchema) as any,
		mode: 'onBlur',
		defaultValues: initialData || {},
	});

	useEffect(() => {
		const fetchBundle = async () => {
			const bundle = await memberService.getMemberBundle();
			setMemberBundle(bundle);
		};
		fetchBundle();

		if (initialData) {
			reset(initialData);
		}
	}, [initialData, reset]);

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
									<Checkbox checked={value === 'true' || value === true} onChange={(e) => onChange(e.target.checked ? 'true' : '')} />
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

	const onInternalSubmit = async (data: MemberFormValues) => {
		setSaving(true);
		try {
			await onSubmit(data);
		} finally {
			setSaving(false);
		}
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			{isEdit && memberId && pwDialogOpen && <PasswordChangeDialog onClose={() => setPwDialogOpen(false)} memberId={memberId} />}

			<Box sx={{ flexShrink: 0, width: '100%', padding: '0 1.5rem', my: '1rem' }}>
				<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
					<Button startIcon={<ArrowBack />} onClick={() => router.back()} disabled={saving}>
						뒤로가기
					</Button>
					<Button variant='contained' onClick={handleSubmit(onInternalSubmit)} disabled={saving}>
						{saving ? '저장 중...' : '저장'}
					</Button>
				</Box>
			</Box>

			<Grid container component='section' spacing={5} sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: '1rem' }}>
				{formSections.map((section, si) => (
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

							{isEdit && si === 0 && (
								<Box sx={{ display: 'flex', alignItems: 'center', flexBasis: '33.33%', padding: '0.5rem 1rem', minWidth: '18rem' }}>
									<Box sx={{ width: '8rem', flexShrink: 0 }}>비밀번호</Box>
									<Button variant='outlined' size='small' onClick={() => setPwDialogOpen(true)}>
										비밀번호 변경
									</Button>
								</Box>
							)}
						</Box>
					</Grid>
				))}
			</Grid>

			<Stack spacing={4} sx={{ width: '100%', p: '1rem' }}>
				<MemberTableField title='경력' name='careerList' control={control} cols={CAREER_COLS} />
				<MemberTableField title='포상/징계' name='rewardDisciplineList' control={control} cols={REWARD_COLS} />
				<MemberTableField title='자격' name='qualificationList' control={control} cols={QUALIFICATION_COLS} />
				<MemberTableField title='어학' name='languageList' control={control} cols={LANGUAGE_COLS} />
			</Stack>
		</Box>
	);
}
