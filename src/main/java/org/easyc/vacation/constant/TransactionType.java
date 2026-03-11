package org.easyc.vacation.constant;

import org.easyc.excel.dto.EnumInterface;

public enum TransactionType implements EnumInterface {
    GRANT, //지급
    USE, //사용
    CANCEL, //취소복구 - 반려처리되어서 사용취소됨
    EXPIRE; //만료 차감

    @Override
    public String formatViewText() {
        switch (this){
            case USE: return "사용";
            case CANCEL: return "취소";
            case EXPIRE: return "만료";
            default: return "지급";
        }
    }
}
