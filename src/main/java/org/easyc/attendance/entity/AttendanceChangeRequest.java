package org.easyc.attendance.entity;

import jakarta.persistence.*;
import lombok.*;
import org.easyc.common.constant.BasicStatus;
import org.easyc.common.constant.WorkStatus;
import org.easyc.common.entity.BaseEntity;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceChangeRequest extends BaseEntity {
    @Id
    @SequenceGenerator(name="attendance_change_request_seq", sequenceName="attendance_change_request_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="attendance_change_request_seq")
    private Long workRequestId;

    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "member_Nm")
    private String memberNm;

    @Column(name="status")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BasicStatus status = BasicStatus.PENDING;

    @Column(name="type")
    private String type;

    @Column(name="summary")
    private String summary;


    //요청서 내용
    @Column(name = "work_date")
    private LocalDate workDate;

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
}
