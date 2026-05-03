package org.easyc.vacation.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.easyc.attendance.entity.AttendancePolicy;
import org.easyc.vacation.constant.VacationPolicyType;
import org.easyc.vacation.entity.VacationPolicy;

import java.util.stream.Collectors;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class VacationPolicyDto {
    private Long vacationPolicyId;
    private String vacationPolicyName;
    private String vacationPolicyDesc;

    @Enumerated(EnumType.STRING)
    private VacationPolicyType vacationPolicyType;

    private String vacationPolicyUnit;

    @Builder.Default
    private boolean annualLeaveExpired = true;
    @Builder.Default
    private boolean monthLeaveExpired = true;
    @Builder.Default
    private boolean nextYearLeaveUsed = true;

    private Long mappingUserCount;

    public VacationPolicyDto(VacationPolicy entity) {
        this.vacationPolicyId = entity.getVacationPolicyId();
        this.vacationPolicyName = entity.getVacationPolicyName();
        this.vacationPolicyDesc = entity.getVacationPolicyDesc();
        this.vacationPolicyType = entity.getVacationPolicyType();
        this.vacationPolicyUnit = entity.getVacationPolicyUnit();
        this.annualLeaveExpired = entity.isAnnualLeaveExpiredremoted();
        this.monthLeaveExpired = entity.isMonthLeaveExpired();
        this.nextYearLeaveUsed = entity.isNextYearLeaveUsed();
    }

    public VacationPolicy toEntity(){
        return VacationPolicy.builder()
                .vacationPolicyId(this.vacationPolicyId)
                .vacationPolicyName(this.vacationPolicyName)
                .vacationPolicyDesc(this.vacationPolicyDesc)
                .vacationPolicyType(this.vacationPolicyType)
                .vacationPolicyUnit(this.vacationPolicyUnit)
                .annualLeaveExpiredremoted(this.annualLeaveExpired)
                .monthLeaveExpired(this.monthLeaveExpired)
                .nextYearLeaveUsed(this.nextYearLeaveUsed)
                .build();
    }
}
