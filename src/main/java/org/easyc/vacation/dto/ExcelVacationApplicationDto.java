package org.easyc.vacation.dto;

import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.format.DateTimeFormat;
import lombok.Data;
import org.easyc.attendance.constant.WorkStatus;
import org.easyc.attendance.entity.AttendanceApplication;
import org.easyc.common.constant.BasicStatus;
import org.easyc.excel.converter.EnumConverter;
import org.easyc.excel.converter.LocalTimeConverter;
import org.easyc.excel.dto.ExcelEnumDropdown;
import org.easyc.vacation.constant.VacationType;
import org.easyc.vacation.entity.VacationApplication;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ExcelVacationApplicationDto {
    @ExcelProperty(value = "상태", index = 0, converter = EnumConverter.class)
    @ExcelEnumDropdown(BasicStatus.class)
    private BasicStatus status;

    @ExcelProperty(value = "근무자", index = 1)
    private String memberNm;

    @ExcelProperty(value = "부서명", index = 2)
    private String depthNm;

    @ExcelProperty(value = "직급", index = 3)
    private String jobGrade;

    @ExcelProperty(value = "휴가타입", index = 4, converter = EnumConverter.class)
    @ExcelEnumDropdown(VacationType.class)
    private VacationType vacationType;

    @ExcelProperty(value = "휴가기간(일)", index = 5)
    private Integer vacationDuration;

    @ExcelProperty(value = "휴가 시작일", index = 6)
    @DateTimeFormat("yyyy-MM-dd")
    private LocalDate startDate;

    @ExcelProperty(value = "휴가 종료일", index = 7)
    @DateTimeFormat("yyyy-MM-dd")
    private LocalDate endDate;

    @ExcelProperty(value = "휴가 사유", index = 8)
    private String violationReason;


    public ExcelVacationApplicationDto(VacationApplication vacationApplication) {
        this.status = vacationApplication.getStatus();
        this.memberNm = vacationApplication.getMemberNm();
        this.depthNm = vacationApplication.getDeptNm();
        this.jobGrade = vacationApplication.getJobGrade();
        this.vacationType = vacationApplication.getVacationType();
        this.vacationDuration = vacationApplication.getVacationDuration();
        this.startDate = vacationApplication.getStartDate();
        this.endDate = vacationApplication.getEndDate();
        this.violationReason = vacationApplication.getViolationReason();
    }

}
