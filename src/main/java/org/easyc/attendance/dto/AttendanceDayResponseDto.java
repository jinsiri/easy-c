package org.easyc.attendance.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.easyc.attendance.entity.Attendance;
import org.easyc.attendance.constant.WorkType;
import org.easyc.attendance.constant.WorkStatus;
import org.easyc.attendance.entity.AttendanceApplication;
import org.easyc.vacation.constant.VacationType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class AttendanceDayResponseDto {
    private Long attendanceId;
    private Long memberId;
    private String memberNm;
    private String deptNm;
    private String jobGrade;
    private String attendancePolicyName;

    private LocalDate workDate;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long fullTime;
    private Long overTime;
    private WorkType workType;
    private WorkStatus workStatus;
    private VacationType vacationType;
    //private Long changeRequestId; todo 없어진 거 맞는지 확인
    private String detail;
    private List<AttendanceApplication> applicationList;

    public AttendanceDayResponseDto(Attendance entity) {
        this.attendanceId = entity.getAttendanceId();
        this.memberId = entity.getMemberId();
        this.memberNm = entity.getMemberNm();
        this.deptNm = entity.getDeptNm();
        this.jobGrade = entity.getJobGrade();
        this.attendancePolicyName =  entity.getAttendancePolicyName();
        this.workDate = entity.getWorkDate();
        this.startTime = entity.getStartTime();
        this.endTime = entity.getEndTime();
        this.fullTime = entity.getTotalWorkMinute();
        this.overTime = entity.getOvertimeMinute();
        this.workType = entity.getWorkType();
        this.workStatus = entity.getWorkStatus();
        this.vacationType = entity.getVacationType();
    }

}






