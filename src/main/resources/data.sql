INSERT INTO dept (dept_id, dept_nm, tree_level, tree_sibling_order, tree_parent_id, tree_child_count, tree_sort_code, deleted, active)
VALUES (1, '부서', 1, 1, NULL, 0, '001', false, true)
    ON CONFLICT (dept_id) DO NOTHING;

-- 데이터가 없으면 1로, 있으면 그 최대값으로 시퀀스 설정
SELECT setval('dept_seq', COALESCE((SELECT MAX(dept_id) FROM dept), 1));


--근태 정책 초기
INSERT INTO attendance_policy (
    deleted,
    active,
    attendance_policy_id,
    attendance_policy_name,
    attendance_policy_desc,
    attendance_type,
    settlement_period,
    worktime_rule,
    working_time_day,
    working_day_of_week,
    start_time,
    end_time,
    half_leave_start_time,
    half_leave_end_time,
    core_start_time,
    core_end_time,
    allow_margin_minute
)
VALUES (
    false,
    true,
    1,
    '기본 정책',
    null,
    'FIXED',
    'WEEK',
    'ALWAYS_40',
    480,
    '1,2,3,4,5',
    '09:00:00',
    '18:00:00',
    '13:00:00',
    '13:00:00',
    '11:00:00',
    '15:00:00',
    5
)
ON CONFLICT (attendance_policy_id) DO NOTHING;

-- 시퀀스 설정 수정
SELECT setval(
    'attendance_policy_seq',
    COALESCE((SELECT MAX(attendance_policy_id) FROM attendance_policy), 1),
    true -- 차후 NEXTVAL 호출 시 MAX+1이 나오도록 설정
);

--근태 맵핑 데이터 세팅
INSERT INTO mapping_attendance_policy ( mapping_id, attendance_policy_id, member_id, login_id)
VALUES (1,1,1,'admin')
    ON CONFLICT (mapping_id) DO NOTHING;

-- 시퀀스 설정 수정
SELECT setval(
    'mapping_attendance_policy_seq',
    COALESCE((SELECT MAX(mapping_id) FROM mapping_attendance_policy), 1),
    true
);
