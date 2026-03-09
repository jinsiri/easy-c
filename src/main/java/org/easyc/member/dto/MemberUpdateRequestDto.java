package org.easyc.member.dto;

import lombok.Getter;
import lombok.Setter;
import org.easyc.deptMemberMap.dto.DeptMemberMapRequestDto;
import org.easyc.member.constant.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class MemberUpdateRequestDto {

    // ── Member 필드 (password 선택) ──
    private String loginId;           // 기존 값과 비교용, 변경 불가
    private String password;          // null 또는 빈 문자열이면 비밀번호 변경 안 함
    private String memberNm;
    private String memberNmEn;

    // ── MemberProfileRequestDto 필드 ──
    private String employeeId;
    private String email;
    private String extensionNumber;
    private String referredBy;
    private LocalDate hireDate;
    private LocalDate resignationDate;
    private RecruitmentType recruitmentType;
    private EmploymentType employmentType;
    private SalaryType salaryType;
    private EmploymentStatus employmentStatus;

    // ── MemberPersonalRequestDto 필드 ──
    private LocalDate dateOfBirth;
    private Gender gender;
    private String phoneNumber;
    private String externalEmail;
    private Nationality nationality;
    private String address;
    private String faxNumber;
    private VeteranType veteranType;
    private String veteranNumber;
    private Boolean veteranFamily;
    private String disabilityRegistrationNumber;
    private DisabilityType disabilityType;
    private String disabilityGrade;
    private DisabilityRecognition disabilityRecognition;
    private String bankName;
    private String accountNumber;
    private String accountHolderName;

    // ── 조직 관련 ──
    private Long jobPositionId;
    private Long jobGradeId;
    private Long jobRoleId;
    private List<DeptMemberMapRequestDto> deptMemberMapDto;

    // ── 리스트 ──
    private List<MemberCareerRequestDto>           careerList;
    private List<MemberRewardDisciplineRequestDto> rewardDisciplineList;
    private List<MemberQualificationRequestDto>    qualificationList;
    private List<MemberLanguageRequestDto>         languageList;

    public boolean hasNewPassword() {
        return password != null && !password.isBlank();
    }

    public MemberProfileRequestDto toProfileDto() {
        return new MemberProfileRequestDto(
                this.recruitmentType, this.employmentType,
                this.salaryType, this.employmentStatus,
                this.employeeId, this.email,
                this.extensionNumber, this.referredBy,
                this.hireDate, this.resignationDate
        );
    }

    public MemberPersonalRequestDto toPersonalDto() {
        return new MemberPersonalRequestDto(
                this.dateOfBirth, this.gender,
                this.phoneNumber, this.externalEmail,
                this.nationality, this.address,
                this.faxNumber, this.veteranType,
                this.veteranNumber, this.veteranFamily,
                this.disabilityRegistrationNumber, this.disabilityType,
                this.disabilityGrade, this.disabilityRecognition,
                this.bankName, this.accountNumber, this.accountHolderName
        );
    }

    public List<MemberCareerRequestDto> getCareerListOrEmpty() {
        return careerList != null ? careerList : List.of();
    }

    public List<MemberRewardDisciplineRequestDto> getRewardDisciplineListOrEmpty() {
        return rewardDisciplineList != null ? rewardDisciplineList : List.of();
    }

    public List<MemberQualificationRequestDto> getQualificationListOrEmpty() {
        return qualificationList != null ? qualificationList : List.of();
    }

    public List<MemberLanguageRequestDto> getLanguageListOrEmpty() {
        return languageList != null ? languageList : List.of();
    }
}
