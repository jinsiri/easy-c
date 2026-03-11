package org.easyc.attendance.constant;

import org.easyc.excel.dto.EnumInterface;

public enum WorkType implements EnumInterface {
    NORMAL, // 평일 근무
    WEEKEND,   //주말 근무
    HOLIDAY;    //휴일 근무

    @Override
    public String formatViewText() {
        switch (this){
            case WEEKEND: return "주말 근무";
            case HOLIDAY: return "휴일 근무";
            default: return "평일 근무";
        }
    }
}
