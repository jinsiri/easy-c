package org.easyc.attendance.entity;

import jakarta.persistence.*;
import lombok.*;
import org.easyc.common.constant.BasicStatus;
import org.easyc.attendance.constant.WorkStatus;
import org.easyc.common.entity.BaseEntity;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceApplication extends BaseEntity {
    @Id
    @SequenceGenerator(name="attendance_application_seq", sequenceName="attendance_application_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="attendance_application_seq")
    private Long attendanceApplicationId;

    /** 근로자 정보 추가 */
    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "member_nm")
    private String memberNm;

    @Column(name = "dept_nm")
    private String deptNm;

    @Column(name = "job_grade")
    private String jobGrade;


    /** 요청서 내용 */
    @Column(name = "work_date")
    private LocalDate workDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "work_status")
    private WorkStatus workStatus;

    @Column(name="start_time")
    private LocalTime startTime;

    @Column(name="end_time")
    private LocalTime endTime;

    @Column(name="violation_reason")
    private String violationReason;

    @Column(name="documents_address")
    private String documentsAddress;

    //요청 상태
    @Column(name="status")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BasicStatus status = BasicStatus.PENDING;

    @Column(name="summary")
    private String summary;
}
