package org.easyc.attendance.constant;

import org.easyc.excel.dto.EnumInterface;

public enum WorktimeRule implements EnumInterface {
    CAP_AT_40,	    // 주 40시간 상한, 초과해도 40시간 근무로 자름
    ALWAYS_40,	    // 실제 근로시간이 적어도 주 40시간 인정
    BY_WORK_DAYS;	// 근무일 × 일일 소정근로시간 한 것을 전체 근로시간으로 인정, 주 52시간 이내로 관리가 필요

    @Override
    public String formatViewText() {
        switch (this){
            case ALWAYS_40: return "법정근로시간 적용";
            case BY_WORK_DAYS: return "근무일x1일 소정근로시간";
            default: return "법정근로시간까지 제한";
        }
    }

}
