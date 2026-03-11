package org.easyc.excel.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.easyc.common.dto.SearchRequestDto;

@Getter
@NoArgsConstructor
public class ExcelRequestDto {
    private String fileName;
    private SearchRequestDto search;
}
