package org.easyc.attendance.service;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.dto.AttendancePolicyDto;
import org.easyc.attendance.entity.AttendancePolicy;
import org.easyc.attendance.repository.AttendancePolicyMapRepository;
import org.easyc.attendance.repository.AttendancePolicyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendancePolicyService {

    private final AttendancePolicyRepository attendancePolicyRepository;
    private final AttendancePolicyMapRepository attendancePolicyMapRepository;

    public List<AttendancePolicyDto> getAllPolicy (){
        List<AttendancePolicy> policyList = attendancePolicyRepository.findAllByActiveTrueOrderByAttendancePolicyIdAsc();
        List<Object[]> mapCountList = attendancePolicyMapRepository.countGroupByAttendancePolicyId();

        Map<Long, Long> policyCount = mapCountList.stream().collect(Collectors.toMap(
                obj -> (Long) obj[0],
                obj -> (Long) obj[1]
        ));

        List<AttendancePolicyDto> resultList = policyList.stream().map(entity -> {
            AttendancePolicyDto dto = new AttendancePolicyDto(entity);
            dto.setMappingUserCount(policyCount.get(dto.getAttendancePolicyId()));
            return dto;
        }).collect(Collectors.toList());

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
