package org.easyc.excel.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.easyc.common.dto.SearchRequestDto;

@Getter
@NoArgsConstructor
public class ExcelRequestDto<T> {
    private String fileName;
    private T request;
}
