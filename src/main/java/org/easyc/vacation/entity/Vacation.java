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
public class Vacation extends BaseEntity {
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
    String vacationPolicyName;

    @Column(name = "years_of_service")
    Long yearsOfService;

    @Column(name = "accrual_date")
    LocalDate accrualDate;

    @Column(name = "expire_date")
    LocalDate expireDate;

    @Column(name = "granted_day") //총 연차
    Double grantedDay;

    @Column(name = "used_date") //사용 연차
    Double usedDay = 0.0;

    @Column(name = "remain_date") //잔여 연차
    Double remainDay;

    @Column(name= "annual_vacation")
    Integer annualVacation;

    @Column(name="sick_vacation")
    Integer sickVacation = 0;

    @Column(name="holiday_vacation")
    Integer holidayVacation = 0;

    @Column(name="special_vacation")
    Integer specialVacation = 0;

    @Column(name = "carry_date")
    Integer carryOverDay = 0;

}
