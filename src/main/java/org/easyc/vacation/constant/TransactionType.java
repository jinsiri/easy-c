package org.easyc.vacation.constant;

public enum TransactionType {
    GRANT, //지급
    USE, //사용
    CANCEL, //취소복구 - 반려처리되어서 사용취소됨
    EXPIRE //만료 차감
}
