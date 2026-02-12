package org.easyc.attendance.service;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.dto.AttendanceCompanyRequestDto;
import org.easyc.attendance.entity.Attendance;
import org.easyc.attendance.entity.AttendancePolicy;
import org.easyc.attendance.repository.AttendancePolicyRepository;
import org.easyc.attendance.repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendancePolicyService {

    private final AttendancePolicyRepository attendancePolicyRepository;

    public List<AttendancePolicy> getAllPolicy (){
        List<AttendancePolicy> policyList = attendancePolicyRepository.findAll();
        return policyList;
    }

}
