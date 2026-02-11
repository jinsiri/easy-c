package org.easyc.attendance.entity;

import jakarta.persistence.*;
import lombok.*;
import org.easyc.attendance.constant.WorkType;
import org.easyc.attendance.constant.WorkStatus;
import org.easyc.attendance.constant.VacationType;
import org.easyc.common.entity.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Attendance extends BaseEntity {

    @Id
    @SequenceGenerator(name="attendance_seq", sequenceName="attendance_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="attendance_seq")
    @Column(name = "attendance_id")
    private Long attendanceId;

    /** 정상근로 처리 */
    @Column(name = "normalized", columnDefinition = "boolean default true")
    @Builder.Default
    private boolean normalized = true;


    /** 등록자 정보 추가 */
    @Column(name = "register_dept_nm")
    private String deptNm;

    @Column(name = "register_job_grade")
    private String jobGrade;

    @Column(name = "register_latitude")
    private BigDecimal registerLatitude;

    @Column(name = "register_longitude")
    private BigDecimal registerLongitude;


    /** 근로 시간 관련 */
    @Column(name = "work_date")
    private LocalDate workDate;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "total_work_minute")
    private Long totalWorkMinute;

    @Column(name = "overtime_minute")
    private Long overtimeMinute;

    @Enumerated(EnumType.STRING)
    @Column(name = "work_type")
    private WorkType workType;

    @Enumerated(EnumType.STRING)
    @Column(name = "work_status")
    private WorkStatus workStatus;

    @Column(name = "violation_reason")
    private String violationReason;

    @Column(name = "attachment_reason")
    private String attachmentReason;

    @Column(name = "detail")
    private String detail;


    /** 휴가 관련 */
    @Column(name = "remoted", columnDefinition = "boolean default false")
    @Builder.Default
    private boolean remoted = false;

    @Column(name = "vacationed", columnDefinition = "boolean default false")
    @Builder.Default
    private boolean vacationed = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "vacation_type")
    private VacationType vacationType;
}
