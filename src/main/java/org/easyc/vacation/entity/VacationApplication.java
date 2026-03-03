package org.easyc.vacation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.easyc.attendance.constant.VacationType;
import org.easyc.common.constant.BasicStatus;
import org.easyc.common.entity.BaseEntity;

import java.time.LocalDate;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VacationApplication extends BaseEntity {
    @Id
    @SequenceGenerator(name="vacation_application_seq", sequenceName="vacation_application_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="vacation_application_seq")
    private Long vacationApplicationId;

    /** 근로자 정보 추가 */
    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "dept_nm")
    private String deptNm;

    @Column(name = "job_grade")
    private String jobGrade;

    /** 요청서 내용 */
    @Enumerated(EnumType.STRING)
    @Column(name = "vacation_type")
    VacationType vacationType;

    @Column(name = "vacation_duration")
    Integer vacationDuration;

    @Column(name = "start_date")
    LocalDate startDate;

    @Column(name = "end_date")
    LocalDate endDate;

    @Column(name="violation_reason")
    private String violationReason;

    // 휴가 진행 상태
    @Column(name="status")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BasicStatus status = BasicStatus.PENDING;

}
