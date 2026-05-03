package org.easyc.schedule.constant;

import org.easyc.excel.dto.EnumInterface;

public enum ScheduleType implements EnumInterface {
    NORMAL,        //일반 일정
    OUTSIDE,        //외근
    BUSINESS_TRIP   //출장
    ;

    @Override
    public String formatViewText() {
        switch (this){
            case OUTSIDE: return "외근";
            case BUSINESS_TRIP: return "출장";
            default: return "일반 일정";
        }
    }
}
