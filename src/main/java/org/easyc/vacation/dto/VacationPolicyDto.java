package org.easyc.vacation.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.easyc.attendance.entity.AttendancePolicy;
import org.easyc.vacation.constant.VacationPolicyType;
import org.easyc.vacation.entity.VacationPolicy;

import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class VacationPolicyDto {
    private Long vacationPolicyId;
    private String vacationPolicyName;
    private String vacationPolicyDesc;

    @Enumerated(EnumType.STRING)
    private VacationPolicyType vacationPolicyType;

    private String vacationPolicyUnit;

    private boolean annualLeaveExpired = true;
    private boolean monthLeaveExpired = true;
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

    public VacationPolicy makeEntity(){
        VacationPolicy vacationPolicy = new VacationPolicy();

        vacationPolicy.setVacationPolicyId(this.vacationPolicyId);
        vacationPolicy.setVacationPolicyName(this.vacationPolicyName);
        vacationPolicy.setVacationPolicyDesc(this.vacationPolicyDesc);
        vacationPolicy.setVacationPolicyType(this.vacationPolicyType);
        vacationPolicy.setVacationPolicyUnit(this.vacationPolicyUnit);
        vacationPolicy.setAnnualLeaveExpiredremoted(this.annualLeaveExpired);
        vacationPolicy.setMonthLeaveExpired(this.monthLeaveExpired);
        vacationPolicy.setNextYearLeaveUsed(this.nextYearLeaveUsed);

        return vacationPolicy;
    }
}
