package org.easyc.attendance.service;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.constant.*;
import org.easyc.attendance.dto.*;
import org.easyc.attendance.entity.*;
import org.easyc.attendance.repository.*;
import org.easyc.common.dto.SearchRequestDto;
import org.easyc.common.exception.CustomException;
import org.easyc.common.exception.CustomExceptionCode;
import org.easyc.member.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class AttendanceCompanyService {

    private final AttendanceRepository attendanceRepository;
    private final AttendanceApplicationRepository attendanceApplicationRepository;

    public AttendanceCompanyResponseDto getAttendanceCompanyOnedayData (SearchRequestDto request){
        LocalDate workDate = request.getWorkDate();

        if(workDate == null){
            throw new CustomException(CustomExceptionCode.ATTENDANCE_NOT_FOUND);
        }

        List<Attendance> attendance = attendanceRepository.findAllByWorkDate(workDate);
        List<AttendanceApplication> requestList = attendanceApplicationRepository.findAllByWorkDateAndActiveTrueOrderByAttendanceApplicationIdAsc(request.getWorkDate());

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

    public List<AttendanceDayResponseDto> getAttendanceCompanySearch(SearchRequestDto request){
        LocalDate workDate = request.getWorkDate();
        String searchCategory = request.getSearchCategory();
        String searchValue = request.getSearchValue();

        List<Attendance> attendance = new ArrayList<>();
        if(searchValue== null || searchValue.equals("")){
            attendance = attendanceRepository.findAllByWorkDate(workDate);
        }else{
            switch (searchCategory){
                case "workStatus":
                    try{
                        WorkStatus targetSearchValue = WorkStatus.valueOf(searchValue);
                        attendance = attendanceRepository.findAllByWorkDateAndWorkStatus(workDate, targetSearchValue);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                    break;

                case "depthNm":
                    attendance = attendanceRepository.findAllByWorkDateAndDeptNm(workDate, searchValue);
                    break;

                default:
                    attendance = attendanceRepository.findAllByWorkDateAndMemberNmContains(workDate, searchValue);
                    break;
            }
        }

        List<AttendanceDayResponseDto> resultList = attendance.stream().map(entity -> new AttendanceDayResponseDto(entity)).collect(Collectors.toList());
        return resultList;
    }

}
