package org.easyc.attendance.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
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
@SuperBuilder
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
    private String detail;
    private List<AttendanceApplication> applicationList;


    public static AttendanceDayResponseDto fromEntity(Attendance entity) {
        return AttendanceDayResponseDto.builder()
                .attendanceId(entity.getAttendanceId())
                .memberId(entity.getMemberId())
                .memberNm(entity.getMemberNm())
                .deptNm(entity.getDeptNm())
                .jobGrade(entity.getJobGrade())
                .attendancePolicyName(entity.getAttendancePolicyName())
                .workDate(entity.getWorkDate())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .fullTime(entity.getTotalWorkMinute())
                .overTime(entity.getOvertimeMinute())
                .workType(entity.getWorkType())
                .workStatus(entity.getWorkStatus())
                .build();
    }



}






