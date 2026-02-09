package org.easyc.attendance.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.easyc.attendance.entity.AttendanceChangeRequest;
import org.easyc.common.constant.WorkStatus;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
public class AttendanceChangeDataDto {
    private Long memberId;
    private String loginId;
    private String requestType;
    private LocalDate workDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private WorkStatus workStatus;
    private String violationReason;
    private String documentsAddress;

    public AttendanceChangeRequest returnAttendanceChangeEntity () {
        AttendanceChangeRequest entity = new AttendanceChangeRequest();
        entity.setWorkDate(this.workDate);
        entity.setStartTime(this.startTime);
        entity.setEndTime(this.endTime);
        entity.setWorkStatus(this.workStatus);
        entity.setViolationReason(this.violationReason);
        entity.setDocumentsAddress(this.documentsAddress);

        return entity;
    }
}
