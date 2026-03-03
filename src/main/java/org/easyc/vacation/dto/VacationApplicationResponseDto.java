package org.easyc.vacation.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.easyc.vacation.entity.VacationApplication;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class VacationApplicationResponseDto {
    List<VacationApplication> planVacation;
    List<VacationApplication> endVacation;
}
