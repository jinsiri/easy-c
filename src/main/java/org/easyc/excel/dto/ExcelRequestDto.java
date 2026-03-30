package org.easyc.excel.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ExcelRequestDto<T> {
    private String fileName;
    private T request;
}
