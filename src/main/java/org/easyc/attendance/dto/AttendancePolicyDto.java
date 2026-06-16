package org.easyc.attendance.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.easyc.attendance.constant.AttendanceType;
import org.easyc.attendance.constant.SettlementPeriod;
import org.easyc.attendance.constant.WorktimeRule;
import org.easyc.attendance.entity.AttendancePolicy;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class AttendancePolicyDto {
    private Long attendancePolicyId;
    private String attendancePolicyName;
    private String attendancePolicyDesc;

    @Enumerated(EnumType.STRING)
    private AttendanceType attendanceType;

    private List<String> workDayOfWeek;

    @Enumerated(EnumType.STRING)
    private SettlementPeriod settlementPeriod = SettlementPeriod.WEEK;

    @Enumerated(EnumType.STRING)
    private WorktimeRule worktimeRule = WorktimeRule.CAP_AT_40;

    private String targetHour;
    private String targetMinute;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime coreStartTime;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime coreEndTime;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime halfLeaveStartTime;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime halfLeaveEndTime;

    private Long allowMarginMinute;

    private Long mappingUserCount;

    public AttendancePolicyDto(AttendancePolicy entity) {
        this.attendancePolicyId = entity.getAttendancePolicyId();
        this.attendancePolicyName = entity.getAttendancePolicyName();
        this.attendancePolicyDesc = entity.getAttendancePolicyDesc();

        this.attendanceType = entity.getAttendanceType();
        this.workDayOfWeek = Arrays.stream(entity.getWorkingDayOfWeek().split(",")).toList();
        this.settlementPeriod = entity.getSettlementPeriod();
        this.worktimeRule = entity.getWorktimeRule();

        this.targetHour = entity.getWorkingTimeDay()  != null ? String.format("%02d", entity.getWorkingTimeDay() / 60) : "00";
        this.targetMinute = entity.getWorkingTimeDay() != null ? String.format("%02d", entity.getWorkingTimeDay() % 60) : "00";
        this.startTime = entity.getStartTime();
        this.endTime = entity.getEndTime();
        this.coreStartTime = entity.getCoreStartTime();
        this.coreEndTime = entity.getCoreEndTime();
        this.halfLeaveStartTime = entity.getHalfLeaveStartTime();
        this.halfLeaveEndTime = entity.getHalfLeaveEndTime();
        this.allowMarginMinute = entity.getAllowMarginMinute();

    }

    public AttendancePolicy makeEntity(){
        AttendancePolicy attendancePolicy = new AttendancePolicy();

        attendancePolicy.setAttendancePolicyId(this.attendancePolicyId);
        attendancePolicy.setAttendancePolicyName(this.attendancePolicyName);
        attendancePolicy.setAttendancePolicyDesc(this.attendancePolicyDesc);
        attendancePolicy.setAttendanceType(this.attendanceType);
        attendancePolicy.setSettlementPeriod(this.settlementPeriod);
        attendancePolicy.setWorktimeRule(this.worktimeRule);
        attendancePolicy.setWorkingTimeDay(Integer.parseInt(this.targetHour) * 60 + Integer.parseInt(this.targetMinute));
        attendancePolicy.setWorkingDayOfWeek(this.workDayOfWeek.stream().collect(Collectors.joining(",")));
        attendancePolicy.setStartTime(this.startTime);
        attendancePolicy.setEndTime(this.endTime);
        attendancePolicy.setCoreStartTime(this.coreStartTime);
        attendancePolicy.setCoreEndTime(this.coreEndTime);
        attendancePolicy.setHalfLeaveStartTime(this.halfLeaveStartTime);
        attendancePolicy.setHalfLeaveEndTime(this.halfLeaveEndTime);
        attendancePolicy.setAllowMarginMinute(this.allowMarginMinute);

        return attendancePolicy;
    }
}
