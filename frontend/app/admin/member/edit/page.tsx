'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
	Box,
	Button,
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
import BaseDialog from '@/app/_component/baseElement/BaseDialog';
import { Add, ArrowBack, Delete } from '@mui/icons-material';
import { memberService } from '@/app/services/memberService';
import { useDialogStore } from '@/store/useDialogStore';

// ===== 타입 =====

type FieldDef = {
	key: string;
	label: string;
	wide?: boolean;
	required?: boolean;
	readOnly?: boolean;
	type?: 'text' | 'password' | 'date' | 'number' | 'select';
	options?: { label: string; value: string }[];
};

type ColDef = {
	key: string;
	label: string;
	type?: 'text' | 'password' | 'date' | 'number' | 'select';
	options?: { label: string; value: string }[];
};

// ===== 필드 정의 (loginId 읽기전용, 비밀번호 제외) =====

const editInfoSections: { title: string; fields: FieldDef[] }[] = [
	{
		title: '기본 정보',
		fields: [
			{ key: 'loginId', label: '로그인아이디', readOnly: true },
			{ key: 'memberNm', label: '이름', required: true },
			{ key: 'employeeId', label: '사번', required: true },
			{ key: 'extensionNumber', label: '대표전화' },
			{ key: 'departmentPosition', label: '부서/직책' },
			{ key: 'positionTitle', label: '직위' },
			{ key: 'jobTitle', label: '직무' },
			{ key: 'email', label: '이메일' },
			{
				key: 'employmentStatus',
				label: '근무상태',
				type: 'select',
				options: [
					{ label: '재직', value: 'ACTIVE' },
					{ label: '휴직', value: 'LEAVE' },
					{ label: '퇴직 예정', value: 'RETIRING_SOON' },
					{ label: '퇴사', value: 'RESIGNED' },
				],
			},
			{
				key: 'employmentType',
				label: '직원 구분',
				required: true,
				type: 'select',
				options: [
					{ label: '정규직', value: 'REGULAR' },
					{ label: '계약직', value: 'CONTRACT' },
					{ label: '인턴', value: 'INTERN' },
					{ label: '파견직', value: 'DISPATCH' },
					{ label: '프리랜서', value: 'FREELANCER' },
				],
			},
			{
				key: 'recruitmentType',
				label: '채용 구분',
				required: true,
				type: 'select',
				options: [
					{ label: '신입', value: 'NEW' },
					{ label: '경력', value: 'EXPERIENCED' },
					{ label: '공채', value: 'OPEN' },
					{ label: '특채', value: 'SPECIAL' },
					{ label: '수시채용', value: 'ROLLING' },
					{ label: '사내전보', value: 'INTERNAL_TRANSFER' },
				],
			},
			{
				key: 'salaryType',
				label: '급여 구분',
				required: true,
				type: 'select',
				options: [
					{ label: '연봉', value: 'ANNUAL' },
					{ label: '월급', value: 'MONTHLY' },
					{ label: '시급', value: 'HOURLY' },
				],
			},
			{ key: 'referredBy', label: '추천자' },
			{ key: 'hireDate', label: '입사일', type: 'date', required: true },
			{ key: 'resignationDate', label: '퇴사일', type: 'date' },
		],
	},
	{
		title: '개인 정보',
		fields: [
			{ key: 'memberNmEn', label: '영문 이름' },
			{ key: 'phoneNumber', label: '휴대전화' },
			{ key: 'externalEmail', label: '외부이메일' },
			{
				key: 'gender',
				label: '성별',
				required: true,
				type: 'select',
				options: [
					{ label: '남성', value: 'MALE' },
					{ label: '여성', value: 'FEMALE' },
				],
			},
			{
				key: 'nationality',
				label: '국적',
				type: 'select',
				options: [
					{ label: '한국', value: 'KR' },
					{ label: '미국', value: 'US' },
					{ label: '일본', value: 'JP' },
					{ label: '중국', value: 'CN' },
					{ label: '베트남', value: 'VN' },
					{ label: '필리핀', value: 'PH' },
					{ label: '태국', value: 'TH' },
					{ label: '인도네시아', value: 'ID' },
					{ label: '기타', value: 'ETC' },
				],
			},
			{ key: 'dateOfBirth', label: '생년월일', type: 'date' },
			{ key: 'address', label: '주소', wide: true },
			{ key: 'faxNumber', label: '자택번호' },
		],
	},
	{
		title: '보훈 정보',
		fields: [
			{ key: 'veteranNumber', label: '보훈번호' },
			{
				key: 'veteranType',
				label: '보훈 구분',
				type: 'select',
				options: [
					{ label: '국가유공자', value: 'NATIONAL_MERIT' },
					{ label: '보훈가족', value: 'VETERANS_FAMILY' },
					{ label: '독립유공자', value: 'INDEPENDENCE_MERIT' },
					{ label: '특수임무유공자', value: 'SPECIAL_MERIT' },
					{ label: '해당없음', value: 'NONE' },
				],
			},
			{ key: 'veteranFamily', label: '보훈 가족' },
		],
	},
	{
		title: '장애 정보',
		fields: [
			{ key: 'disabilityRegistrationNumber', label: '장애 등록번호' },
			{
				key: 'disabilityType',
				label: '장애 구분',
				type: 'select',
				options: [
					{ label: '지체', value: 'PHYSICAL' },
					{ label: '시각', value: 'VISUAL' },
					{ label: '청각', value: 'HEARING' },
					{ label: '지적', value: 'INTELLECTUAL' },
					{ label: '정신', value: 'MENTAL' },
					{ label: '내부기관', value: 'INTERNAL' },
					{ label: '해당없음', value: 'NONE' },
				],
			},
			{
				key: 'disabilityRecognition',
				label: '장애 인정 구분',
				type: 'select',
				options: [
					{ label: '인정', value: 'RECOGNIZED' },
					{ label: '미인정', value: 'NOT_RECOGNIZED' },
					{ label: '심사중', value: 'PENDING' },
					{ label: '해당없음', value: 'NONE' },
				],
			},
			{ key: 'disabilityGrade', label: '장애 등급' },
		],
	},
	{
		title: '계좌 정보',
		fields: [
			{ key: 'bankName', label: '은행 이름' },
			{ key: 'accountHolderName', label: '예금주' },
			{ key: 'accountNumber', label: '계좌번호' },
		],
	},
];

const careerCols: ColDef[] = [
	{ key: 'startDate', label: '시작일', type: 'date' },
	{ key: 'endDate', label: '종료일', type: 'date' },
	{ key: 'companyName', label: '근무처', type: 'text' },
	{ key: 'positionTitle', label: '직위', type: 'text' },
	{ key: 'jobDescription', label: '담당업무', type: 'text' },
	{ key: 'workPeriod', label: '근속기간', type: 'text' },
	{ key: 'resignationReason', label: '퇴직사유', type: 'text' },
];

const rewardCols: ColDef[] = [
	{
		key: 'type',
		label: '구분',
		type: 'select',
		options: [
			{ label: '포상', value: 'REWARD' },
			{ label: '징계', value: 'DISCIPLINE' },
		],
	},
	{ key: 'actionDate', label: '일자', type: 'date' },
	{ key: 'title', label: '내용', type: 'text' },
	{ key: 'reason', label: '사유', type: 'text' },
	{ key: 'remark', label: '기타', type: 'text' },
];

const qualificationCols: ColDef[] = [
	{
		key: 'qualificationType',
		label: '구분',
		type: 'select',
		options: [
			{ label: '자격증', value: 'CERTIFICATE' },
			{ label: '면허', value: 'LICENSE' },
			{ label: '민간/국제인증', value: 'CERTIFICATION' },
			{ label: '기타', value: 'ETC' },
		],
	},
	{ key: 'qualificationName', label: '자격명', type: 'text' },
	{ key: 'qualificationNumber', label: '자격번호', type: 'text' },
	{ key: 'qualificationGrade', label: '자격등급', type: 'text' },
	{ key: 'issuingOrganization', label: '기관명', type: 'text' },
	{ key: 'acquiredDate', label: '취득일', type: 'date' },
	{ key: 'suspendedDate', label: '정지일', type: 'date' },
];

const languageCols: ColDef[] = [
	{ key: 'languageType', label: '구분', type: 'text' },
	{ key: 'languageName', label: '어학명', type: 'text' },
	{ key: 'evaluationDate', label: '평가일', type: 'date' },
	{ key: 'evaluationAgency', label: '평가기관', type: 'text' },
	{ key: 'score', label: '점수', type: 'number' },
	{ key: 'grade', label: '등급', type: 'text' },
	{ key: 'etc', label: '기타', type: 'text' },
];

const makeEmptyRow = (cols: ColDef[]): Record<string, string> => ({
	_rowId: Math.random().toString(36).slice(2),
	...cols.reduce((acc, c) => ({ ...acc, [c.key]: '' }), {}),
});

// API 응답 값에서 폼 state 용 string 추출 (EnumOption: { code, label })
const toFormValue = (value: any): string => {
	if (value === null || value === undefined) return '';
	if (typeof value === 'object' && 'code' in value) return String(value.code);
	if (typeof value === 'boolean') return value ? 'true' : '';
	return String(value);
};

// 리스트 응답 행을 폼 행으로 변환 (EnumOption → value string)
const toFormRow = (item: Record<string, any>, cols: ColDef[]): Record<string, string> => ({
	_rowId: Math.random().toString(36).slice(2),
	...cols.reduce(
		(acc, col) => ({
			...acc,
			[col.key]: toFormValue(item[col.key]),
		}),
		{},
	),
});

// ===== 컴포넌트 =====

export default function MemberEditPage() {
	const router = useRouter();
	const theme = useTheme();
	const searchParams = useSearchParams();
	const memberId = Number(searchParams.get('memberId'));
	const { alert, success } = useDialogStore();
	const [saving, setSaving] = useState(false);
	const [loading, setLoading] = useState(true);
	const [pwDialog, setPwDialog] = useState(false);
	const [pwForm, setPwForm] = useState({ password: '', passwordCheck: '' });

	const [formData, setFormData] = useState<Record<string, string>>({
		loginId: '',
		memberNm: '',
		employeeId: '',
		extensionNumber: '',
		departmentPosition: '',
		positionTitle: '',
		jobTitle: '',
		email: '',
		employmentStatus: 'ACTIVE',
		employmentType: '',
		recruitmentType: '',
		salaryType: '',
		referredBy: '',
		hireDate: '',
		resignationDate: '',
		memberNmEn: '',
		phoneNumber: '',
		externalEmail: '',
		gender: '',
		nationality: 'KR',
		dateOfBirth: '',
		address: '',
		faxNumber: '',
		veteranNumber: '',
		veteranType: 'NONE',
		veteranFamily: '',
		disabilityRegistrationNumber: '',
		disabilityType: 'NONE',
		disabilityRecognition: 'NONE',
		disabilityGrade: '',
		bankName: '',
		accountHolderName: '',
		accountNumber: '',
	});

	const [careerList, setCareerList] = useState<Record<string, string>[]>([]);
	const [rewardList, setRewardList] = useState<Record<string, string>[]>([]);
	const [qualificationList, setQualificationList] = useState<Record<string, string>[]>([]);
	const [languageList, setLanguageList] = useState<Record<string, string>[]>([]);

	// ===== 기존 데이터 로드 =====
	useEffect(() => {
		if (!memberId) return;

		const fetchData = async () => {
			setLoading(true);
			try {
				const [memberRes, careerRes, rewardRes, qualRes, langRes] = await Promise.all([
					memberService.getMember(memberId),
					memberService.getMemberCareerInfo(memberId),
					memberService.getMemberRewardDisciplineInfo(memberId),
					memberService.getMemberQualificationInfo(memberId),
					memberService.getMemberLanguageInfo(memberId),
				]);

				const m = memberRes as Record<string, any>;
				setFormData({
					loginId: toFormValue(m.loginId),
					memberNm: toFormValue(m.memberNm),
					employeeId: toFormValue(m.employeeId),
					extensionNumber: toFormValue(m.extensionNumber),
					departmentPosition: toFormValue(m.departmentPosition),
					positionTitle: toFormValue(m.positionTitle),
					jobTitle: toFormValue(m.jobTitle),
					email: toFormValue(m.email),
					employmentStatus: toFormValue(m.employmentStatus) || 'ACTIVE',
					employmentType: toFormValue(m.employmentType),
					recruitmentType: toFormValue(m.recruitmentType),
					salaryType: toFormValue(m.salaryType),
					referredBy: toFormValue(m.referredBy),
					hireDate: toFormValue(m.hireDate),
					resignationDate: toFormValue(m.resignationDate),
					memberNmEn: toFormValue(m.memberNmEn),
					phoneNumber: toFormValue(m.phoneNumber),
					externalEmail: toFormValue(m.externalEmail),
					gender: toFormValue(m.gender),
					nationality: toFormValue(m.nationality) || 'KR',
					dateOfBirth: toFormValue(m.dateOfBirth),
					address: toFormValue(m.address),
					faxNumber: toFormValue(m.faxNumber),
					veteranNumber: toFormValue(m.veteranNumber),
					veteranType: toFormValue(m.veteranType) || 'NONE',
					veteranFamily: toFormValue(m.veteranFamily),
					disabilityRegistrationNumber: toFormValue(m.disabilityRegistrationNumber),
					disabilityType: toFormValue(m.disabilityType) || 'NONE',
					disabilityRecognition: toFormValue(m.disabilityRecognition) || 'NONE',
					disabilityGrade: toFormValue(m.disabilityGrade),
					bankName: toFormValue(m.bankName),
					accountHolderName: toFormValue(m.accountHolderName),
					accountNumber: toFormValue(m.accountNumber),
				});

				setCareerList((careerRes as any[]).map((item) => toFormRow(item, careerCols)));
				setRewardList((rewardRes as any[]).map((item) => toFormRow(item, rewardCols)));
				setQualificationList((qualRes as any[]).map((item) => toFormRow(item, qualificationCols)));
				setLanguageList((langRes as any[]).map((item) => toFormRow(item, languageCols)));
			} catch (e: any) {
				await alert(e?.message ?? '데이터를 불러오지 못했습니다.');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [memberId]);

	const updateRow = useCallback(
		(setter: React.Dispatch<React.SetStateAction<Record<string, string>[]>>, idx: number, key: string, val: string) =>
			setter((prev) => prev.map((row, i) => (i === idx ? { ...row, [key]: val } : row))),
		[],
	);

	const validate = (): string | null => {
		const { memberNm, employeeId, email, hireDate, employmentType, recruitmentType, salaryType, gender } = formData;

		if (!memberNm?.trim()) return '직원 이름은 필수입니다.';
		if (!employeeId?.trim()) return '사번은 필수입니다.';
		if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return '이메일 형식이 올바르지 않습니다.';
		if (!hireDate) return '입사일은 필수입니다.';
		if (!employmentType) return '직원구분은 필수입니다.';
		if (!recruitmentType) return '채용 구분은 필수입니다.';
		if (!salaryType) return '급여 구분은 필수입니다.';
		if (!gender) return '성별은 필수입니다.';

		return null;
	};

	// ===== 비밀번호 변경 =====
	const handlePasswordSave = async () => {
		const { password, passwordCheck } = pwForm;
		if (!password.trim()) {
			await alert('비밀번호를 입력해주세요.');
			return;
		}
		if (password.length < 8) {
			await alert('비밀번호는 8자 이상이어야 합니다.');
			return;
		}
		if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
			await alert('비밀번호는 영문과 숫자를 포함해야 합니다.');
			return;
		}
		if (password !== passwordCheck) {
			await alert('비밀번호가 일치하지 않습니다.');
			return;
		}

		try {
			await memberService.updatePassword(memberId, password);
			await success('비밀번호가 변경되었습니다.');
			setPwDialog(false);
			setPwForm({ password: '', passwordCheck: '' });
		} catch (e: any) {
			await alert(e?.message ?? '비밀번호 변경에 실패했습니다.');
		}
	};

	// ===== handleSave =====
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

			const sendData = formData;

			const payload = {
				...sendData,
				careerList: careerList.map(strip),
				rewardDisciplineList: rewardList.map(strip),
				qualificationList: qualificationList.map(strip),
				languageList: languageList.map(strip),
			};

			await memberService.updateMember(memberId, payload);
			await success('멤버 정보가 수정되었습니다.');
			router.push('/admin/dept/member');
		} finally {
			setSaving(false);
		}
	};

	// ===== 필드 렌더링 =====
	const renderField = useCallback(
		(field: FieldDef) => {
			const value = formData[field.key] ?? '';
			const onChange = (val: string) => setFormData((prev) => ({ ...prev, [field.key]: val }));

			if (field.readOnly) {
				return <OutlinedInput size='small' value={value} readOnly sx={{ width: '100%', minWidth: '10rem', backgroundColor: 'action.hover' }} />;
			}

			if (field.type === 'select' && field.options) {
				return (
					<Select size='small' displayEmpty value={value} onChange={(e) => onChange(e.target.value)} sx={{ width: '100%', minWidth: '10rem' }}>
						<MenuItem value=''>
							<em style={{ color: '#aaa' }}>선택</em>
						</MenuItem>
						{field.options.map((opt) => (
							<MenuItem key={opt.value} value={opt.value}>
								{opt.label}
							</MenuItem>
						))}
					</Select>
				);
			}

			return (
				<OutlinedInput
					size='small'
					type={field.type ?? 'text'}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					sx={{ width: '100%', minWidth: '10rem' }}
				/>
			);
		},
		[formData],
	);

	// ===== 섹션 렌더링 =====
	const tabTotalContent = useMemo(
		() => (
			<Grid container component='section' spacing={5} sx={{ display: 'flex', flexDirection: 'column', width: '100%', p: '1rem' }}>
				{editInfoSections.map((section, si) => (
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
							{/* 기본 정보 섹션에만 비밀번호 변경 버튼 추가 */}
							{si === 0 && (
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										flexBasis: '33.33%',
										padding: '0.5rem 1rem',
										minWidth: '18rem',
									}}
								>
									<Box sx={{ width: '8rem', flexShrink: 0 }}>비밀번호</Box>
									<Button variant='outlined' size='small' onClick={() => setPwDialog(true)}>
										비밀번호 변경
									</Button>
								</Box>
							)}
						</Box>
					</Grid>
				))}
			</Grid>
		),
		[formData, theme, renderField],
	);

	// ===== 리스트 탭 =====
	const renderListTab = useCallback(
		(cols: ColDef[], rows: Record<string, string>[], setter: React.Dispatch<React.SetStateAction<Record<string, string>[]>>) => {
			const renderCell = (col: ColDef, row: Record<string, string>, idx: number) => {
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

	const tabCareerContent = useMemo(() => renderListTab(careerCols, careerList, setCareerList), [careerList, renderListTab]);
	const tabRewardContent = useMemo(() => renderListTab(rewardCols, rewardList, setRewardList), [rewardList, renderListTab]);
	const tabQualContent = useMemo(() => renderListTab(qualificationCols, qualificationList, setQualificationList), [qualificationList, renderListTab]);
	const tabLangContent = useMemo(() => renderListTab(languageCols, languageList, setLanguageList), [languageList, renderListTab]);

	if (loading) return null;

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			{/* 비밀번호 변경 모달 */}
			{pwDialog && (
				<BaseDialog
					title='비밀번호 변경'
					confirmLabel='변경'
					onConfirm={handlePasswordSave}
					onClose={() => {
						setPwDialog(false);
						setPwForm({ password: '', passwordCheck: '' });
					}}
					maxWidth='xs'
					fullWidth
				>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '0.5rem' }}>
						<OutlinedInput
							size='small'
							type='password'
							placeholder='새 비밀번호'
							value={pwForm.password}
							onChange={(e) => setPwForm((p) => ({ ...p, password: e.target.value }))}
						/>
						<OutlinedInput
							size='small'
							type='password'
							placeholder='비밀번호 확인'
							value={pwForm.passwordCheck}
							onChange={(e) => setPwForm((p) => ({ ...p, passwordCheck: e.target.value }))}
						/>
					</Box>
				</BaseDialog>
			)}
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
