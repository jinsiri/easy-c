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

// ===== 필드 정의 =====
const createInfoSections = getMemberFormSections('create');

// ===== 컴포넌트 =====
export default function MemberNewPage() {
	const router = useRouter();
	const theme = useTheme();
	const { alert, success } = useDialogStore();
	const [saving, setSaving] = useState(false);
	const [memberBundle, setMemberBundle] = useState<MemberBundleResponseDto>({});

	const fecthMemberBundle = async () => {
		const data = await memberService.getMemberBundle();
		setMemberBundle(data);
	};

	useEffect(() => {
		fecthMemberBundle();
	}, []);

	// createInfoSections의 모든 필드를 하나의 state로 관리
	const [formData, setFormData] = useState<Record<string, string>>({
		// 기본 정보
		loginId: '',
		password: '',
		passwordCheck: '',
		memberNm: '',
		employeeId: '',
		extensionNumber: '',
		departmentPosition: '',
		jobPosition: '',
		jobGrade: '',
		jobTitle: '',
		jobRole: '',
		email: '',
		employmentStatus: 'ACTIVE',
		employmentType: '',
		recruitmentType: '',
		salaryType: '',
		referredBy: '',
		hireDate: '',
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
	});

	const [careerList, setCareerList] = useState<Record<string, string>[]>([]);
	const [rewardList, setRewardList] = useState<Record<string, string>[]>([]);
	const [qualificationList, setQualificationList] = useState<Record<string, string>[]>([]);
	const [languageList, setLanguageList] = useState<Record<string, string>[]>([]);

	const updateRow = useCallback(
		(setter: React.Dispatch<React.SetStateAction<Record<string, string>[]>>, idx: number, key: string, val: string) =>
			setter((prev) => prev.map((row, i) => (i === idx ? { ...row, [key]: val } : row))),
		[],
	);

	const validate = (): string | null => {
		const { loginId, password, passwordCheck, memberNm, employeeId, email, hireDate, employmentType, recruitmentType, salaryType, gender } = formData;

		if (!loginId.trim()) return '로그인 아이디는 필수입니다.';
		if (loginId.length < 4) return '로그인 아이디는 4자 이상이어야 합니다.';
		if (!password.trim()) return '비밀번호는 필수입니다.';
		if (password.length < 8) return '비밀번호는 8자 이상이어야 합니다.';
		if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) return '비밀번호는 영문과 숫자를 포함해야 합니다.';
		if (password !== passwordCheck) return '비밀번호가 일치하지 않습니다.';
		if (!memberNm?.trim()) return '직원 이름은 필수입니다.';
		if (!employeeId?.trim()) return '사번은 필수입니다.';
		if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return '이메일 형식이 올바르지 않습니다.';
		if (!hireDate) return '입사일은 필수입니다.';
		if (!employmentType) return '직원구분은 필수입니다.';
		if (!recruitmentType) return '채용 구분은 필수입니다.';
		if (!salaryType) return '급여 구분 필수입니다.';
		if (!gender) return '성별은 필수입니다.';

		return null;
	};

	// ===== handleSave: 단일 API 호출 =====
	const handleSave = async () => {
		const errorMsg = validate();
		if (errorMsg) {
			await alert(errorMsg);
			return;
		}
		setSaving(true);
		try {
			const strip = (row: Record<string, string>) => {
				const { _rowId: _, ...rest } = row as any;
				return rest;
			};

			// passwordCheck는 서버로 보내지 않음
			const { passwordCheck: _, ...sendData } = formData;

			const payload = {
				...sendData, // MemberJoinRequestDto + MemberProfileRequestDto + MemberPersonalRequestDto 필드
				careerList: careerList.map(strip),
				rewardDisciplineList: rewardList.map(strip),
				qualificationList: qualificationList.map(strip),
				languageList: languageList.map(strip),
			};

			await memberService.createMember(payload);
			await success('멤버가 등록되었습니다.');
			router.push('/admin/dept/member');
		} finally {
			setSaving(false);
		}
	};

	// ===== 필드형 렌더링 (date/select/text 분기) =====
	const renderField = useCallback(
		(field: MemberFieldDef) => {
			const value = formData[field.key] ?? '';
			const handleChange = (val: string) => setFormData((prev) => ({ ...prev, [field.key]: val }));

			const commonProps = {
				size: 'small' as const,
				sx: { width: '100%', minWidth: '10rem' },
			};

			switch (field.type) {
				case 'checkbox':
					return <Checkbox {...commonProps} checked={value === 'true'} onChange={(e) => handleChange(e.target.checked ? 'true' : '')} />;

				case 'select':
					const options = getOptions(field, memberBundle);
					return (
						<Select {...commonProps} displayEmpty value={value} onChange={(e) => handleChange(e.target.value as string)}>
							<MenuItem value=''>
								<em style={{ color: '#aaa' }}>{field.options ? '선택' : '미선택'}</em>
							</MenuItem>
							{options.map((opt) => (
								<MenuItem key={opt.value} value={opt.value}>
									{opt.label}
								</MenuItem>
							))}
						</Select>
					);

				default:
					return <OutlinedInput {...commonProps} type={field.type ?? 'text'} value={value} onChange={(e) => handleChange(e.target.value)} />;
			}
		},
		[formData, memberBundle],
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
		[formData, theme, renderField],
	);

	// ===== 리스트 탭 =====
	const renderListTab = useCallback(
		(cols: MemberColDef[], rows: Record<string, string>[], setter: React.Dispatch<React.SetStateAction<Record<string, string>[]>>) => {
			const renderCell = (col: MemberColDef, row: Record<string, string>, idx: number) => {
				if (col.type === 'select' && col.options) {
					return (
						<Select
							size='small'
							displayEmpty
							value={row[col.key] ?? ''}
							onChange={(e) => updateRow(setter, idx, col.key, e.target.value)}
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
								<MenuItem key={opt.value} value={opt.value}>
									{opt.label}
								</MenuItem>
							))}
						</Select>
					);
				}

				return (
					<InputBase
						type={col.type ?? 'text'}
						value={row[col.key] ?? ''}
						onChange={(e) => updateRow(setter, idx, col.key, e.target.value)}
						sx={{
							px: '0.625rem',
							width: '100%',
							fontSize: '0.875rem',
							'& input': {
								py: '0.5rem',
								...(col.type === 'date' && { cursor: 'pointer' }),
							},
							'&.Mui-focused': { backgroundColor: 'primary.50' },
						}}
					/>
				);
			};

			return (
				<Box>
					<Stack direction='row' justifyContent='flex-end' sx={{ mb: 1 }}>
						<Button size='small' variant='outlined' startIcon={<Add />} onClick={() => setter((prev) => [...prev, makeEmptyRow(cols)])}>
							행 추가
						</Button>
					</Stack>
					<Table size='small' sx={{ border: `1px solid ${theme.palette.divider}`, borderCollapse: 'collapse' }}>
						<TableHead>
							<TableRow>
								{cols.map((col) => (
									<TableCell
										key={col.key}
										sx={{
											fontWeight: 600,
											backgroundColor: theme.palette.grey[50],
											py: '0.625rem',
											px: '0.75rem',
											borderBottom: `2px solid ${theme.palette.divider}`,
											borderRight: `1px solid ${theme.palette.divider}`,
											'&:last-of-type': { borderRight: 'none' },
										}}
									>
										{col.label}
									</TableCell>
								))}
								<TableCell
									sx={{
										width: 48,
										backgroundColor: theme.palette.grey[50],
										borderBottom: `2px solid ${theme.palette.divider}`,
									}}
								/>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.length === 0 ? (
								<TableRow>
									<TableCell colSpan={cols.length + 1} align='center' sx={{ py: 2, color: theme.palette.grey[400] }}>
										데이터가 없습니다. 행 추가 버튼을 클릭하여 추가하세요.
									</TableCell>
								</TableRow>
							) : (
								rows.map((row, idx) => (
									<TableRow key={row._rowId} sx={{ '&:hover': { backgroundColor: theme.palette.grey[50] } }}>
										{cols.map((col) => (
											<TableCell
												key={col.key}
												sx={{
													p: 0,
													borderRight: `1px solid ${theme.palette.divider}`,
													...(col.type === 'date' && { minWidth: 140 }),
													...(col.type === 'number' && { maxWidth: 80 }),
												}}
											>
												{renderCell(col, row, idx)}
											</TableCell>
										))}
										<TableCell sx={{ p: '4px', textAlign: 'center' }}>
											<IconButton size='small' color='error' onClick={() => setter((prev) => prev.filter((_, i) => i !== idx))}>
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
		[theme, updateRow],
	);

	const tabCareerContent = useMemo(() => renderListTab(CAREER_COLS, careerList, setCareerList), [careerList, renderListTab]);
	const tabRewardContent = useMemo(() => renderListTab(REWARD_COLS, rewardList, setRewardList), [rewardList, renderListTab]);
	const tabQualContent = useMemo(() => renderListTab(QUALIFICATION_COLS, qualificationList, setQualificationList), [qualificationList, renderListTab]);
	const tabLangContent = useMemo(() => renderListTab(LANGUAGE_COLS, languageList, setLanguageList), [languageList, renderListTab]);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			<Box sx={{ flexShrink: 0, width: '100%', padding: '0 1.5rem', my: '1rem' }}>
				<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
					<Button startIcon={<ArrowBack />} onClick={() => router.back()} disabled={saving}>
						뒤로가기
					</Button>
					<Button variant='contained' onClick={handleSave} disabled={saving}>
						{saving ? '저장 중...' : '저장'}
					</Button>
				</Box>
			</Box>

			<Box>{tabTotalContent}</Box>

			<Grid container component='section' spacing={5} sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: '1rem' }}>
				<Grid component='article'>
					<Box sx={{ display: 'flex', alignItems: 'center', py: '0.5rem' }}>
						<Typography sx={{ fontWeight: 600 }}>경력</Typography>
						<Box sx={{ flexGrow: 1, height: '1px', ml: '1rem', backgroundColor: theme.palette.divider }} />
					</Box>
					<Box>{tabCareerContent}</Box>

					<Box sx={{ display: 'flex', alignItems: 'center', py: '0.5rem', mt: '1rem' }}>
						<Typography sx={{ fontWeight: 600 }}>포상/징계</Typography>
						<Box sx={{ flexGrow: 1, height: '1px', ml: '1rem', backgroundColor: theme.palette.divider }} />
					</Box>
					<Box>{tabRewardContent}</Box>

					<Box sx={{ display: 'flex', alignItems: 'center', py: '0.5rem', mt: '1rem' }}>
						<Typography sx={{ fontWeight: 600 }}>자격</Typography>
						<Box sx={{ flexGrow: 1, height: '1px', ml: '1rem', backgroundColor: theme.palette.divider }} />
					</Box>
					<Box>{tabQualContent}</Box>

					<Box sx={{ display: 'flex', alignItems: 'center', py: '0.5rem', mt: '1rem' }}>
						<Typography sx={{ fontWeight: 600 }}>어학</Typography>
						<Box sx={{ flexGrow: 1, height: '1px', ml: '1rem', backgroundColor: theme.palette.divider }} />
					</Box>
					<Box>{tabLangContent}</Box>
				</Grid>
			</Grid>
		</Box>
	);
}
