package org.easyc.attendance.service;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.constant.*;
import org.easyc.attendance.dto.*;
import org.easyc.attendance.entity.Attendance;
import org.easyc.attendance.entity.AttendancePolicy;
import org.easyc.attendance.entity.HolidayCalendar;
import org.easyc.attendance.entity.MappingAttendancePolicy;
import org.easyc.attendance.repository.AttendancePolicyRepository;
import org.easyc.attendance.repository.AttendanceRepository;
import org.easyc.attendance.repository.HolidayCalendarRepository;
import org.easyc.attendance.repository.MappingAttendancePolicyRepository;
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

    public List<Attendance> getAttendanceCompanyOnedayData (AttendanceCompanyRequestDto request){
        List<Attendance> attendance = attendanceRepository.findAllByWorkDate(request.getWorkDate());



        return attendance;
    }

}
