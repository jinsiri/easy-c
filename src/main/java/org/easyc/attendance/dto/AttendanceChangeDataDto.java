package org.easyc.attendance.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.easyc.attendance.entity.AttendanceChangeRequest;
import org.easyc.attendance.constant.WorkStatus;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
public class AttendanceChangeDataDto {
    private Long memberId;
    private String loginId;
    private String requestType;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate workDate;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;
    @JsonFormat(pattern = "HH:mm")
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
