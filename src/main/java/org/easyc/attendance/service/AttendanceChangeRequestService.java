package org.easyc.attendance.service;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.dto.*;
import org.easyc.attendance.entity.*;
import org.easyc.attendance.repository.*;
import org.easyc.common.constant.*;
import org.easyc.member.entity.Member;
import org.easyc.member.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import static org.easyc.common.util.utilFunc.parseDate;
import static org.easyc.common.util.utilFunc.parseDateTime;

@Service
@RequiredArgsConstructor
public class AttendanceChangeRequestService {
    private final AttendanceChangeRequestRepository attendanceChangeRequestRepository;
    private final MemberRepository memberRepository;

    public List<AttendanceChangeRequest> getAllAttendanceChangeRequest (){
        return attendanceChangeRequestRepository.findAll();
    }

    public void saveAttendanceChangeRequest (AttendanceChangeDataDto req){
        String type = "근무상태 수정";

        if(req.getStartTime() != null || req.getEndTime() != null){
            type = "근무시간 수정";
        }

        AttendanceChangeRequest attendanceChangeRequest = req.returnAttendanceChangeEntity();
        attendanceChangeRequest.setType(type);
        attendanceChangeRequestRepository.save(attendanceChangeRequest);
    }

}
