package org.easyc.member.dto;

import lombok.Getter;
import lombok.Setter;
import org.easyc.member.constant.EmploymentStatus;
import org.easyc.member.constant.EmploymentType;
import org.easyc.member.constant.RecruitmentType;
import org.easyc.member.constant.SalaryType;

import java.time.LocalDate;

@Getter
@Setter
public class MemberProfileRequestDto {
    private Long memberId;

    private RecruitmentType recruitmentType;
    private EmploymentType employmentType;
    private SalaryType salaryType;
    private EmploymentStatus employmentStatus;

    private String employeeId;
    private String email;
    private String extensionNumber;
    private String referredBy;
    private LocalDate resignationDate;
    private LocalDate hireDate;

    public MemberProfileRequestDto(
            RecruitmentType recruitmentType,
            EmploymentType employmentType,
            SalaryType salaryType,
            EmploymentStatus employmentStatus,
            String employeeId,
            String email,
            String extensionNumber,
            String referredBy,
            LocalDate hireDate,
            LocalDate resignationDate
    ) {
        this.recruitmentType = recruitmentType;
        this.employmentType = employmentType;
        this.salaryType = salaryType;
        this.employmentStatus = employmentStatus;
        this.employeeId = employeeId;
        this.email = email;
        this.extensionNumber = extensionNumber;
        this.referredBy = referredBy;
        this.hireDate = hireDate;
        this.resignationDate = resignationDate;
    }

    //todo 연관관계 있어서 toEntity 사용 지양
}
