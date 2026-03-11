package org.easyc.vacation.constant;

import org.easyc.excel.dto.EnumInterface;

public enum VacationPolicyType implements EnumInterface {
    WORKING_DAY,          // 입사일
    FINANCIAL_DAY;       // 회계기준일

    @Override
    public String formatViewText() {
        switch (this){
            case FINANCIAL_DAY: return "회계기준일";
            default: return "입사일";
        }
    }
}
