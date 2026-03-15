package org.easyc.attendance.service;

import lombok.RequiredArgsConstructor;
import org.easyc.attendance.dto.AttendancePolicyDto;
import org.easyc.attendance.dto.AttendancePolicyMemberDto;
import org.easyc.attendance.dto.AttendancePolicyMemberRequestDto;
import org.easyc.attendance.entity.AttendancePolicy;
import org.easyc.attendance.entity.AttendancePolicyMap;
import org.easyc.attendance.repository.AttendancePolicyMapRepository;
import org.easyc.attendance.repository.AttendancePolicyRepository;
import org.easyc.jobPosition.entity.JobPosition;
import org.easyc.member.dto.MemberLightResponseDto;
import org.easyc.member.repository.MemberRepositoryCustom;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendancePolicyService {

    private final AttendancePolicyRepository attendancePolicyRepository;
    private final AttendancePolicyMapRepository attendancePolicyMapRepository;
    private final MemberRepositoryCustom memberRepositoryCustom;

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


    public List<AttendancePolicyMemberDto> getPolicyMemberData() {
        return memberRepositoryCustom.findApplicationPolicyMembers();
    }

    public void savePolicyMemberMapping(AttendancePolicyMemberRequestDto request) {
        Long policyId = request.getPolicyId();
        List<Long> memberIdList = request.getMemberIdList();

        List<AttendancePolicyMap> mapList = attendancePolicyMapRepository.findAllByMemberIdIsIn(memberIdList);
        Map<Long, AttendancePolicyMap> map = mapList.stream().collect(Collectors.toMap(AttendancePolicyMap::getMemberId, g -> g));

        List<AttendancePolicyMap> resultList = new ArrayList<>();
        for(Long id : memberIdList){
            AttendancePolicyMap a = new AttendancePolicyMap();

            if(map.containsKey(id)){
                a = map.get(id);
            }

            a.setAttendancePolicyId(policyId);
            a.setMemberId(id);
            resultList.add(a);
        }

        attendancePolicyMapRepository.saveAll(resultList);

    }
}
