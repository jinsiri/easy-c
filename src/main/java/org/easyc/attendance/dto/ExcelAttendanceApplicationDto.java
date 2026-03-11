package org.easyc.attendance.dto;

import com.alibaba.excel.annotation.format.DateTimeFormat;
import lombok.Data;
import com.alibaba.excel.annotation.ExcelProperty;
import org.easyc.attendance.constant.WorkStatus;
import org.easyc.attendance.entity.AttendanceApplication;
import org.easyc.common.constant.BasicStatus;
import org.easyc.excel.converter.EnumConverter;
import org.easyc.excel.converter.LocalTimeConverter;
import org.easyc.excel.dto.ExcelEnumDropdown;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ExcelAttendanceApplicationDto {
    @ExcelProperty(value = "상태", index = 0, converter = EnumConverter.class)
    @ExcelEnumDropdown(BasicStatus.class)
    private BasicStatus status;

    @ExcelProperty(value = "수정 근무일", index = 1)
    @DateTimeFormat("yyyy-MM-dd")
    private LocalDate workDate;

    @ExcelProperty(value = "수정 근무자", index = 2)
    private String memberNm;

    @ExcelProperty(value = "부서명", index = 3)
    private String depthNm;

    @ExcelProperty(value = "직급", index = 4)
    private String jobGrade;

    @ExcelProperty(value = "수정 출근시간", index = 5, converter = LocalTimeConverter.class)
    private LocalTime startTime;

    @ExcelProperty(value = "수정 퇴근시간", index = 6, converter = LocalTimeConverter.class)
    private LocalTime endTime;

    @ExcelProperty(value = "수정 근무상태", index = 7, converter = EnumConverter.class)
    @ExcelEnumDropdown(WorkStatus.class)
    private WorkStatus workStatus;

    @ExcelProperty(value = "수정 사유", index = 8)
    private String violationReason;


    public ExcelAttendanceApplicationDto(AttendanceApplication attendanceApplication) {
        this.status = attendanceApplication.getStatus();
        this.workDate = attendanceApplication.getWorkDate();
        this.memberNm = attendanceApplication.getMemberNm();
        this.depthNm = attendanceApplication.getDeptNm();
        this.jobGrade = attendanceApplication.getJobGrade();
        this.startTime = attendanceApplication.getStartTime();
        this.endTime = attendanceApplication.getEndTime();
        this.workStatus = attendanceApplication.getWorkStatus();
        this.violationReason = attendanceApplication.getViolationReason();
    }

}
