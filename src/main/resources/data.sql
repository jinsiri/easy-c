INSERT INTO dept (dept_id, dept_nm, tree_level, tree_sibling_order, tree_parent_id, tree_child_count, tree_sort_code, delete, active)
VALUES (1, '부서', 1, 1, NULL, 0, '001', false, true)
    ON CONFLICT (dept_id) DO NOTHING;

-- 데이터가 없으면 1로, 있으면 그 최대값으로 시퀀스 설정
SELECT setval('dept_seq', COALESCE((SELECT MAX(dept_id) FROM dept), 1));
