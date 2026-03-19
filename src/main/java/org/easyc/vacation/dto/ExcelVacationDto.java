package org.easyc.vacation.dto;

import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.format.DateTimeFormat;
import lombok.Data;
import org.easyc.common.constant.BasicStatus;
import org.easyc.excel.converter.EnumConverter;
import org.easyc.excel.dto.ExcelEnumDropdown;
import org.easyc.vacation.constant.VacationType;
import org.easyc.vacation.entity.Vacation;
import org.easyc.vacation.entity.VacationApplication;

import java.time.LocalDate;

@Data
public class ExcelVacationDto {
    @ExcelProperty(value = "근무자", index = 0)
    private String memberNm;

    @ExcelProperty(value = "부서명", index = 1)
    private String depthNm;

    @ExcelProperty(value = "직급", index = 2)
    private String jobGrade;

    @ExcelProperty(value = "전체 휴가", index = 3)
    private Double grantedDay;

    @ExcelProperty(value = "사용 휴가", index = 4)
    private Double usedDay;

    @ExcelProperty(value = "연차", index = 5)
    private Double annualVacation;

    @ExcelProperty(value = "병가", index = 6)
    private Double sickVacation;

    @ExcelProperty(value = "휴일연차", index = 7)
    private Double holidayVacation;

    @ExcelProperty(value = "특별연차", index = 8)
    private Double specialVacation;

    @ExcelProperty(value = "이월연차", index = 9)
    private Double carryOverVacation;


    public ExcelVacationDto(Vacation vacation) {
        this.memberNm = vacation.getMemberNm();
        this.depthNm = vacation.getDeptNm();
        this.jobGrade = vacation.getJobGrade();
        this.grantedDay = vacation.getGrantedDay();
        this.usedDay = vacation.getUsedDay();
        this.annualVacation = vacation.getAnnualVacation();
        this.sickVacation = vacation.getSickVacation();
        this.holidayVacation = vacation.getHolidayVacation();
        this.specialVacation = vacation.getSpecialVacation();
        this.carryOverVacation = vacation.getCarryOverVacation();
    }

}
