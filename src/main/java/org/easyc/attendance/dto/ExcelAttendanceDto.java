package org.easyc.attendance.dto;

import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.format.DateTimeFormat;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.easyc.attendance.constant.WorkStatus;
import org.easyc.attendance.constant.WorkType;
import org.easyc.attendance.entity.Attendance;
import org.easyc.attendance.entity.AttendanceApplication;
import org.easyc.excel.converter.EnumConverter;
import org.easyc.excel.converter.LocalTimeConverter;
import org.easyc.excel.dto.ExcelEnumDropdown;
import org.easyc.vacation.constant.VacationType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ExcelAttendanceDto {
    @ExcelProperty(value = "근무일", index = 0)
    @DateTimeFormat("yyyy-MM-dd")
    private LocalDate workDate;

    @ExcelProperty(value = "근무자", index = 1)
    private String memberNm;

    @ExcelProperty(value = "부서명", index = 2)
    private String deptNm;

    @ExcelProperty(value = "직급", index = 3)
    private String jobGrade;

    @ExcelProperty(value = "근태 정책명", index = 4)
    private String attendancePolicyName;

    @ExcelProperty(value = "출근시간", index = 5)
    @DateTimeFormat("yyyy-MM-dd HH:mm")
    private LocalDateTime startTime;

    @ExcelProperty(value = "퇴근시간", index = 6)
    @DateTimeFormat("yyyy-MM-dd HH:mm")
    private LocalDateTime endTime;

    @ExcelProperty(value = "일일 근로시간(분)", index = 7)
    private Long fullTime;

    @ExcelProperty(value = "초과 근로시간(분)", index = 8)
    private Long overTime;

    @ExcelProperty(value = "근로 타입", index = 9, converter = EnumConverter.class)
    @ExcelEnumDropdown(WorkType.class)
    private WorkType workType;

    @ExcelProperty(value = "근로 상태", index = 10, converter = EnumConverter.class)
    @ExcelEnumDropdown(WorkStatus.class)
    private WorkStatus workStatus;

    @ExcelProperty(value = "상세", index = 12)
    private String detail;

    public ExcelAttendanceDto(AttendanceDayResponseDto entity) {
        this.memberNm = entity.getMemberNm();
        this.deptNm = entity.getDeptNm();
        this.jobGrade = entity.getJobGrade();
        this.attendancePolicyName =  entity.getAttendancePolicyName();
        this.workDate = entity.getWorkDate();
        this.startTime = entity.getStartTime();
        this.endTime = entity.getEndTime();
        this.fullTime = entity.getFullTime();
        this.overTime = entity.getOverTime();
        this.workType = entity.getWorkType();
        this.workStatus = entity.getWorkStatus();
        this.detail = entity.getDetail();
    }

}






