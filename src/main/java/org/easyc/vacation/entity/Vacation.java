package org.easyc.vacation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.easyc.common.entity.BaseEntity;
import org.easyc.vacation.constant.VacationPolicyType;

import java.time.LocalDate;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vacation {
    @Id
    @SequenceGenerator(name="vacation_seq", sequenceName="vacation_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="vacation_seq")
    private Long vacationId;

    /** 근로자 정보 추가 */
    @Column(name="member_id")
    private Long memberId;

    @Column(name="member_nm")
    private String memberNm;

    @Column(name ="dept_nm")
    private String deptNm;

    @Column(name = "job_grade")
    private String jobGrade;

    @Column(name = "vacation_policy_name")
    private String vacationPolicyName;

    @Enumerated(EnumType.STRING)
    @Column(name = "vacation_policy_type")
    private VacationPolicyType vacationPolicyType;

    @Column(name = "year")
    private Integer year; //연차 해당 연도

    @Column(name = "accrual_date")
    private LocalDate accrualDate; //연차부여일-삭제할지 고민중

    @Column(name = "expire_date")
    private LocalDate expireDate; //만료일-삭제할지 고민중

    @Column(name = "years_of_service") //근속 년수
    private Long yearsOfService;

    @Column(name = "granted_day") //총 연차
    private Double grantedDay;

    @Builder.Default
    @Column(name = "used_day") //사용 연차
    private Double usedDay = 0.0;

    @Column(name = "remain_day") //잔여 연차
    private Double remainDay;

    @Builder.Default
    @Column(name= "annual_vacation")
    private Double annualVacation = 0.0;

    @Builder.Default
    @Column(name="sick_vacation")
    private Double sickVacation = 0.0;

    @Builder.Default
    @Column(name="holiday_vacation")
    private Double holidayVacation = 0.0;

    @Builder.Default
    @Column(name="special_vacation")
    private Double specialVacation = 0.0;

    @Builder.Default
    @Column(name = "carry_over_vacation")
    private Double carryOverVacation = 0.0;

}
