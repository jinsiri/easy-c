package org.easyc.vacation.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.easyc.attendance.constant.VacationType;
import org.easyc.vacation.entity.VacationApplication;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class VacationApplicationDto {
    private Long vacationApplicationId;
    private Long memberId;

    private String vacationType;
    private Integer vacationDuration;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    private String vacationReason;

    public VacationApplication returnEntity () {
        VacationApplication entity = new VacationApplication();
        entity.setVacationApplicationId(this.vacationApplicationId);
        entity.setMemberId(this.memberId);
        entity.setVacationType(VacationType.valueOf(this.vacationType));
        entity.setVacationDuration(this.vacationDuration);
        entity.setStartDate(this.startDate);
        entity.setEndDate(this.endDate);
        entity.setViolationReason(this.vacationReason);

        return entity;
    }

}
