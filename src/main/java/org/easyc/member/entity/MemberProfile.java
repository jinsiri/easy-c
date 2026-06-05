package org.easyc.member.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.easyc.common.entity.BaseEntity;
import org.easyc.member.constant.EmploymentStatus;
import org.easyc.member.constant.EmploymentType;
import org.easyc.member.constant.RecruitmentType;
import org.easyc.member.constant.SalaryType;
import org.easyc.member.dto.MemberProfileRequestDto;

import java.time.LocalDate;

@Entity
@SuperBuilder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
public class MemberProfile extends BaseEntity { //회원정보_회사 관련
    @Id
    private Long memberId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="member_id")
    private Member member;

    //채용구분
    @Enumerated(EnumType.STRING)
    private RecruitmentType recruitmentType;

    //직원구분
    @Enumerated(EnumType.STRING)
    private EmploymentType employmentType;

    //급여구분
    @Enumerated(EnumType.STRING)
    private SalaryType salaryType;

    //근무 상태
    @Enumerated(EnumType.STRING)
    private EmploymentStatus employmentStatus;

    // 사번
    private String employeeId;
    
    // 이메일 (사내)
    private String email;

    // 내선번호
    private String extensionNumber;

    // 추천자
    private String referredBy;
    // 입사일
    private LocalDate hireDate;

    // 퇴사일
    private LocalDate resignationDate;

    //직군
    //직종
    //직위
    //직책
    //직무

    private MemberProfile(Member member, MemberProfileRequestDto dto) {
        this.member = member;
        this.recruitmentType = dto.getRecruitmentType();
        this.employmentType = dto.getEmploymentType();
        this.salaryType = dto.getSalaryType();
        this.employmentStatus = dto.getEmploymentStatus();
        this.employeeId = dto.getEmployeeId();
        this.email = dto.getEmail();
        this.extensionNumber = dto.getExtensionNumber();
        this.referredBy = dto.getReferredBy();
        this.resignationDate = dto.getResignationDate();
        this.hireDate = dto.getHireDate();
    }

    public void update(MemberProfileRequestDto dto) {
        this.recruitmentType = dto.getRecruitmentType();
        this.employmentType = dto.getEmploymentType();
        this.salaryType = dto.getSalaryType();
        this.employmentStatus = dto.getEmploymentStatus();
        this.employeeId = dto.getEmployeeId();
        this.email = dto.getEmail();
        this.extensionNumber = dto.getExtensionNumber();
        this.referredBy = dto.getReferredBy();
        this.resignationDate = dto.getResignationDate();
        this.hireDate = dto.getHireDate();
    }

    public static MemberProfile of(Member member, MemberProfileRequestDto dto) {
        return new MemberProfile(member, dto);
    }
}
