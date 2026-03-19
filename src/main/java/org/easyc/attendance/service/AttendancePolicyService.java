package org.easyc.attendance.service;

import jakarta.transaction.Transactional;
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
import org.easyc.member.entity.MemberProfile;
import org.easyc.member.repository.MemberProfileRepository;
import org.easyc.member.repository.MemberRepositoryCustom;
import org.easyc.vacation.entity.VacationPolicy;
import org.easyc.vacation.entity.VacationPolicyMap;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
    private final MemberProfileRepository memberProfileRepository;

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
        AttendancePolicy targetData = attendancePolicyRepository.findByAttendancePolicyIdAndActiveTrue(id).orElseThrow();
        targetData.delete();

        attendancePolicyRepository.save(targetData);
    }

    public List<AttendancePolicyMemberDto> getPolicyMemberData() {
        return memberRepositoryCustom.findApplicationPolicyMembers();
    }

    public void savePolicyMemberMapping(AttendancePolicyMemberRequestDto request) {
        Long policyId = request.getPolicyId();
        List<Long> memberIdList = request.getMemberIdList();
        List<AttendancePolicyMap> saveList = new ArrayList<>();

        // 1. 기존에 이 정책이었으나 리스트에서 제외된 사람들 처리 - 기본 정책(1L)으로 변경
        List<AttendancePolicyMap> currentMemberMapList = attendancePolicyMapRepository.findAllByAttendancePolicyIdAndActivedTrue(policyId);
        for (AttendancePolicyMap map : currentMemberMapList) {
            if (!memberIdList.contains(map.getMemberId())) {
                map.deactivate();
                saveList.add(map);
                saveList.add(saveNewMapping(map.getMemberId(), 1L));
            }
        }

        // 2. 새 리스트에 담겨온 사람들 처리
        List<Long> currentMemberList = currentMemberMapList.stream().map(AttendancePolicyMap::getMemberId).collect(Collectors.toList());
        List<Long> updateList = memberIdList.stream().filter(id -> !currentMemberList.contains(id)).collect(Collectors.toList());

        List<AttendancePolicyMap> updateMemberPrevList = attendancePolicyMapRepository.findAllByMemberIdIsInAndActivedTrue(updateList);
        Map<Long, AttendancePolicyMap> updateMemberPrevMap = updateMemberPrevList.stream().collect(Collectors.toMap(AttendancePolicyMap::getMemberId, v -> v));

        for(Long updateMemberId : updateList){
            AttendancePolicyMap prevMap = updateMemberPrevMap.get(updateMemberId);
            if(prevMap != null){
                prevMap.deactivate();
                saveList.add(prevMap);
            }
            saveList.add(saveNewMapping(updateMemberId, policyId));
        }

        attendancePolicyMapRepository.saveAll(saveList);
    }

    private AttendancePolicyMap saveNewMapping(Long memberId, Long policyId) {
        AttendancePolicyMap newMapping = AttendancePolicyMap.builder()
                .memberId(memberId)
                .attendancePolicyId(policyId)
                .applyStart(LocalDate.now())
                .applyEnd(null)
                .actived(true)
                .build();

        return newMapping;
    }
}
