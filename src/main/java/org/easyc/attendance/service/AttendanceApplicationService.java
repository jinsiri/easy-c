package org.easyc.attendance.service;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.constant.WorkStatus;
import org.easyc.attendance.dto.*;
import org.easyc.attendance.entity.Attendance;
import org.easyc.attendance.entity.AttendanceApplication;
import org.easyc.attendance.repository.AttendanceApplicationRepository;
import org.easyc.attendance.repository.AttendanceRepository;
import org.easyc.common.dto.SearchRequestDto;
import org.easyc.common.exception.CustomException;
import org.easyc.common.exception.CustomExceptionCode;
import org.easyc.member.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AttendanceApplicationService {
    private final AttendanceApplicationRepository attendanceApplicationRepository;
    private final MemberRepository memberRepository;
    private final AttendanceRepository attendanceRepository;

    public List<AttendanceApplication> getAllAttendanceApplication (){
        return attendanceApplicationRepository.findAll();
    }

    public void saveAttendanceApplication (AttendanceApplicationDto req){
        AttendanceApplication prevRequest = attendanceApplicationRepository.findTopByWorkDateAndMemberId(req.getWorkDate(), req.getMemberId()).orElse(null);
        AttendanceApplication attendanceApplication = req.returnAttendanceApplicationEntity();
        Attendance targetAttendance = attendanceRepository.findByMemberIdAndWorkDate(req.getMemberId(), req.getWorkDate()).orElse(null);

        //attendace 없는 경우
        if(targetAttendance == null){
            throw new CustomException(CustomExceptionCode.ATTENDANCE_NOT_FOUND); 
        }

        //기존에 같은날 요청사항이 있는 경우 대체(update)
        if(prevRequest != null){
            attendanceApplication.setAttendanceApplicationId(prevRequest.getAttendanceApplicationId()); 
        }

        /** login id로 depthNm, RoleGrade추가 **/
        String memberNm = memberRepository.findMemberNmByMemberId(req.getMemberId()).orElse("");
        attendanceApplication.setMemberNm(memberNm);

        //summary 자동 계산
        String summary = makeSummary(targetAttendance, attendanceApplication);
        attendanceApplication.setSummary(summary);

        attendanceApplicationRepository.save(attendanceApplication);
    }

    public List<AttendanceApplication> searchAttendanceApplication(SearchRequestDto request){
        LocalDate workDate = request.getWorkDate();
        String searchCategory = request.getSearchCategory();
        String searchValue = request.getSearchValue();

        List<AttendanceApplication> applicationList = new ArrayList<>();

        if(searchValue== null || searchValue.equals("")){
            applicationList = attendanceApplicationRepository.findAllByActiveTrueOrderByAttendanceApplicationIdAsc();
        }else{
            switch (searchCategory){
                case "depthNm":
                    applicationList = attendanceApplicationRepository.findAllByDeptNmAndActiveTrueOrderByAttendanceApplicationIdAsc(searchValue);
                    break;

                default:
                    applicationList = attendanceApplicationRepository.findAllByMemberNmContainsAndActiveTrueOrderByAttendanceApplicationIdAsc(searchValue);
                    break;
            }
        }

        return applicationList;
    }

    private String makeSummary(Attendance origin, AttendanceApplication update) {

        List<String> changes = new ArrayList<>();

        LocalTime originStartTime = origin.getStartTime().toLocalTime();
        LocalTime originEndTime = origin.getEndTime().toLocalTime();
        LocalTime updateStartTime = update.getStartTime();
        LocalTime updateEndTime = update.getEndTime();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

        if (updateStartTime != null && !Objects.equals(originStartTime, updateStartTime)) {
            changes.add("출근시간: " + originStartTime.format(formatter) + " → " + updateStartTime.format(formatter));
        }

        if (updateEndTime != null && !Objects.equals(originEndTime, updateEndTime)) {
            changes.add("퇴근시간: " + originEndTime.format(formatter) + " → " + updateEndTime.format(formatter));
        }

        if (!Objects.equals(origin.getWorkStatus(), update.getWorkStatus())) {
            changes.add("근무상태: " + origin.getWorkStatus().formatViewText() + " → " + update.getWorkStatus().formatViewText());
        }

        return String.join(", ", changes);
    }

}
