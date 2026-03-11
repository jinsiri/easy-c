package org.easyc.attendance.constant;

import org.easyc.excel.dto.EnumInterface;

public enum AttendanceType implements EnumInterface {
    FIXED,          // 고정근로
    FLEXTIME,       // 시차출퇴근
    SELECTIVE,      // 선택근로
    FLEXIBLE,       // 탄력근로
    SHIFT;           // 교대근무

    @Override
    public String formatViewText() {
        switch (this){
            case FLEXTIME: return "시차출퇴근";
            case SELECTIVE: return "선택근로";
            case FLEXIBLE: return "탄력근로";
            case SHIFT: return "교대근무";
            default: return "고정근로";
        }
    }
}
