package org.easyc.common.constant;

public enum WorktimeRule {
    CAP_AT_40,	    // 주 40시간 상한, 초과해도 40시간 근무로 자름
    ALWAYS_40,	    // 실제 근로시간이 적어도 주 40시간 인정
    BY_WORK_DAYS	// 근무일 × 일일 소정근로시간 한 것을 전체 근로시간으로 인정, 주 52시간 이내로 관리가 필요
}
