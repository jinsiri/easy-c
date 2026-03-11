package org.easyc.vacation.constant;

import org.easyc.excel.dto.EnumInterface;

public enum VacationCategory implements EnumInterface {
    ANNUAL, SICK, SPECIAL, HOLIDAY, CARRYOVER;

    @Override
    public String formatViewText() {
        switch (this){
            case SICK: return "병가";
            case SPECIAL: return "특별휴가";
            case HOLIDAY: return "휴일 대체 휴가";
            case CARRYOVER: return "이월 휴가";
            default: return "연차";
        }
    }
}
