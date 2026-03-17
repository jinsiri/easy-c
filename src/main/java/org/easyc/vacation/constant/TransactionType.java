package org.easyc.vacation.constant;

import org.easyc.excel.dto.EnumInterface;

public enum TransactionType implements EnumInterface {
    GRANT, //지급
    USE, //사용
    CANCEL, //취소 - 사용된 거 취소해서 다시 연차 복구
    EXPIRE; //만료 차감

    @Override
    public String formatViewText() {
        switch (this){
            case USE: return "사용";
            case CANCEL: return "사용취소";
            case EXPIRE: return "만료";
            default: return "지급";
        }
    }

}
