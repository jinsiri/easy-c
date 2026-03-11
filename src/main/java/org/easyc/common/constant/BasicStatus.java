package org.easyc.common.constant;

import org.easyc.excel.dto.EnumInterface;

public enum BasicStatus implements EnumInterface {
    PENDING,        // 대기
    APPROVED,       // 승인
    REJECTED;        // 반려

    @Override
    public String formatViewText() {
        switch (this){
            case APPROVED: return "승인";
            case REJECTED: return "반려";
            default: return "대기";
        }
    }
}
