package org.easyc.vacation.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.easyc.vacation.constant.VacationType;
import org.easyc.vacation.entity.VacationApplication;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class VacationApplicationDto {
    @JsonProperty("vacationApplicationId")
    private Long vacationApplicationId;

    @JsonProperty("memberId")
    private Long memberId;

    @Enumerated(EnumType.STRING)
    @JsonProperty("vacationType")
    private VacationType vacationType;

    @JsonProperty("vacationDuration")
    private Double vacationDuration;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @JsonProperty("startDate")
    private LocalDate startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @JsonProperty("endDate")
    private LocalDate endDate;

    @JsonProperty("violationReason")
    private String violationReason;

    public static VacationApplicationDto fromEntity(VacationApplication entity) {
        return VacationApplicationDto.builder()
                .vacationApplicationId(entity.getVacationApplicationId())
                .memberId(entity.getMemberId())
                .vacationType(entity.getVacationType())
                .vacationDuration(entity.getVacationDuration())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .violationReason(entity.getViolationReason())
                .build();
    }

    public VacationApplication toEntity () {
        return VacationApplication.builder()
                .vacationApplicationId(this.vacationApplicationId)
                .memberId(this.memberId)
                .vacationType(this.vacationType)
                .vacationDuration(this.vacationType.equals(VacationType.HALF_AM) || this.vacationType.equals(VacationType.HALF_PM) ? 0.5 : this.vacationDuration)
                .startDate(this.startDate)
                .endDate(this.endDate)
                .violationReason(this.violationReason)
                .build();
    }

}
