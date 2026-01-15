package org.easyc.attendance.entity;

import jakarta.persistence.*;
import lombok.*;
import org.easyc.common.constant.VACATION_TYPE;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {

    @Id
    @SequenceGenerator(name="attendance_seq", sequenceName="attendance_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="attendance_seq")
    @Column(name = "attendance_id")
    private Long attendanceId;

    /** 등록자 정보 */
    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "register_ip")
    private String registerIp;

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

    @Column(name = "work_status")
    private String workStatus;

    @Column(name = "violation_reason")
    private String violationReason;

    @Column(name = "attachment_reason")
    private String attachmentReason;

    @Column(name = "detail")
    private String detail;


    /** 휴가 관련 */

    @Column(name = "remoted", columnDefinition = "boolean default false")
    private Boolean remoted = false;;

    @Column(name = "vacationed", columnDefinition = "boolean default false")
    private Boolean vacationed = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "vacation_type")
    private VACATION_TYPE vacationType;


    /** 수정 정보 */
    @LastModifiedDate
    @Column(name = "last_update_date")
    private LocalDateTime lastUpdateDate;

    @Column(name = "last_update_ip")
    private String lastUpdateIp;

    @Column(name = "last_update_id")
    private String lastUpdateId;
}
