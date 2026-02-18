package org.easyc.attendance.constant;

public enum WorkStatus {
    PRESENT,        //정상 출근
    LATE,	        //지각
    EARLY_LEAVE	,   //조퇴
    ABSENT,	        //결근
    VACATION,	    //휴가
    OUTSIDE,        //외근
    BUSINESS_TRIP,   //출장
    UNNORMAL_START,  //비정상출근 - 근로시간 외 출근
    UNNORMAL_END     //비정상퇴근 - 근로시간 외 퇴근
}
