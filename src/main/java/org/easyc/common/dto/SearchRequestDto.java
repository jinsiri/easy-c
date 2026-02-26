package org.easyc.common.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class SearchRequestDto {
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate workDate;
    private String searchCategory;
    private String searchValue;
}
