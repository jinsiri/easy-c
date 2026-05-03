package org.easyc.attendance.constant;

import org.easyc.excel.dto.EnumInterface;

public enum WorkStatus implements EnumInterface {
    PRESENT,        //정상 출근
    LATE,	        //지각
    EARLY_LEAVE	,   //조퇴
    ABSENT,	        //결근
    VACATION,	    //휴가
    REMOTE,        //외근
    UNNORMAL_START,  //비정상출근 - 근로시간 외 출근
    UNNORMAL_END;   //비정상퇴근 - 근로시간 외 퇴근


    @Override
    public String formatViewText() {
        switch (this){
            case LATE: return "지각";
            case EARLY_LEAVE: return "조퇴";
            case ABSENT: return "결근";
            case VACATION: return "휴가";
            case REMOTE: return "외근";
            case UNNORMAL_START: return "비정상출근";
            case UNNORMAL_END: return "비정상퇴근";
            default: return "정상출근";
        }
    }
}
