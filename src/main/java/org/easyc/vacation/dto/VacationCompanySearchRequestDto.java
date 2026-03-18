package org.easyc.vacation.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class VacationCompanySearchRequestDto {
    private Integer year = LocalDate.now().getYear();
    private String memberNm;
    private String deptNm;
    private String jobGrade;

}
