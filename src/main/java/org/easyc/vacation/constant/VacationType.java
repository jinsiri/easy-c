package org.easyc.vacation.constant;

import org.easyc.excel.dto.EnumInterface;

public enum VacationType implements EnumInterface {
    FULL, HALF_AM, HALF_PM, SICK_LEAVE, SPECIAL_LEAVE, HOLIDAY;

    @Override
    public String formatViewText() {
        switch (this){
            case HALF_AM: return "오전 반차";
            case HALF_PM: return "오후 반차";
            case SICK_LEAVE: return "병가";
            case SPECIAL_LEAVE: return "특별휴가";
            case HOLIDAY: return "휴일 대체 휴가";
            default: return "연차";
        }
    }
}
