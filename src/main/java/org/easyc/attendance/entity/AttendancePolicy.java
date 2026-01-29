package org.easyc.attendance.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.easyc.common.constant.AttendanceType;
import org.easyc.common.constant.SettlementPeriod;
import org.easyc.common.constant.WorktimeRule;

import java.time.LocalTime;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AttendancePolicy {

    @Id
    @SequenceGenerator(name="attendance_policy_seq", sequenceName="attendance_policy_seq", allocationSize=1)
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator="attendance_policy_seq")
    private Long attendancePolicyId;

    @Column(name = "attendance_policy_name")
    private String attendancePolicyName;

    @Column(name = "attendance_policy_desc")
    private String attendancePolicyDesc;

    @Enumerated(EnumType.STRING)
    @Column(name = "attendance_type")
    private AttendanceType attendanceType;

    @Enumerated(EnumType.STRING)
    @Column(name = "settlement_period",
            columnDefinition = "varchar default 'WEEK'",
            nullable = false)
    @Builder.Default
    private SettlementPeriod settlementPeriod = SettlementPeriod.WEEK;

    @Enumerated(EnumType.STRING)
    @Column(name = "worktime_rule")
    private WorktimeRule worktimeRule;

    @Column(name = "working_time_day")
    private Integer workingTimeDay;

    @Column(name = "working_day")
    private String workingDay;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "half_leave_start_time")
    private LocalTime halfLeaveStartTime;

    @Column(name = "half_leave_end_time")
    private LocalTime halfLeaveEndTime;

    @Column(name = "core_start_time")
    private LocalTime coreStartTime;

    @Column(name = "core_end_time")
    private LocalTime coreEndTime;

    @Column(name = "allow_margin_minute")
    private Long allowMarginMinute;
}
