package org.easyc.attendance.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AttendanceCompanyResponseDto {
    private Integer unNomalCount;

    private AttendanceDayResponseDto dayData = new AttendanceDayResponseDto();

}






