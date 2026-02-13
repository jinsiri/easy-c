package org.easyc.attendance.service;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.dto.AttendancePolicyDto;
import org.easyc.attendance.entity.AttendancePolicy;
import org.easyc.attendance.repository.AttendancePolicyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendancePolicyService {

    private final AttendancePolicyRepository attendancePolicyRepository;

    public List<AttendancePolicyDto> getAllPolicy (){
        List<AttendancePolicy> policyList = attendancePolicyRepository.findAllByActiveTrueOrderByAttendancePolicyIdAsc();
        List<AttendancePolicyDto> resultList = policyList.stream().map(entity -> new AttendancePolicyDto(entity)).collect(Collectors.toList());

        return resultList;
    }

    public void savePolicyData(AttendancePolicyDto request){
       AttendancePolicy policy = request.makeEntity();
       attendancePolicyRepository.save(policy);
    }

    public void deletePolicyData(Long id){
        AttendancePolicy targetData = attendancePolicyRepository.findByAttendancePolicyId(id).orElseThrow();
        targetData.delete();

        attendancePolicyRepository.save(targetData);
    }



}
