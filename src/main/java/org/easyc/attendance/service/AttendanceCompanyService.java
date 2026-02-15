package org.easyc.attendance.service;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.constant.*;
import org.easyc.attendance.dto.*;
import org.easyc.attendance.entity.*;
import org.easyc.attendance.repository.*;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import static org.easyc.common.util.utilFunc.parseDate;
import static org.easyc.common.util.utilFunc.parseDateTime;

@Service
@RequiredArgsConstructor
public class AttendanceCompanyService {

    private final AttendanceRepository attendanceRepository;
    private final AttendanceChangeRequestRepository attendanceChangeRequestRepository;

    public AttendanceCompanyResponseDto getAttendanceCompanyOnedayData (AttendanceCompanyRequestDto request){
        List<Attendance> attendance = new ArrayList<>();
        attendance = attendanceRepository.findAllByWorkDate(request.getWorkDate());

        List<AttendanceChangeRequest> requestList = attendanceChangeRequestRepository.findAllByWorkDateAndActiveTrueOrderByWorkRequestIdAsc(request.getWorkDate());

        Integer lateCount = 0;
        Integer earlyLeaveCount = 0;
        Integer absentCount = 0;
        List<AttendanceDayResponseDto> data = new ArrayList<>();
        for(Attendance attendanceItem : attendance){
            if(attendanceItem.getWorkStatus().equals(WorkStatus.LATE.name())){
                lateCount++;
            }else if(attendanceItem.getWorkStatus().equals(WorkStatus.EARLY_LEAVE.name())){
                earlyLeaveCount++;
            } else if (attendanceItem.getWorkStatus().equals(WorkStatus.ABSENT.name())) {
                absentCount++;
            }

            data.add(new AttendanceDayResponseDto(attendanceItem));
        }

        AttendanceCompanyResponseDto result = new AttendanceCompanyResponseDto();
        result.setAllCount(attendance.size());
        result.setLateCount(lateCount);
        result.setEarlyLeaveCount(earlyLeaveCount);
        result.setAbsentCount(absentCount);
        result.setChangeRequestCount(requestList.size());
        result.setDayData(data);

        return result;
    }

}
