package org.easyc.vacation.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.easyc.attendance.dto.AttendancePolicyMemberRequestDto;
import org.easyc.attendance.entity.AttendancePolicyMap;
import org.easyc.member.repository.MemberRepositoryCustom;
import org.easyc.vacation.dto.VacationPolicyDto;
import org.easyc.vacation.dto.VacationPolicyMemberDto;
import org.easyc.vacation.dto.VacationPolicyMemberRequestDto;
import org.easyc.vacation.entity.VacationPolicy;
import org.easyc.vacation.entity.VacationPolicyMap;
import org.easyc.vacation.repository.VacationPolicyMapRepository;
import org.easyc.vacation.repository.VacationPolicyRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VacationPolicyService {

    private final VacationPolicyRepository vacationPolicyRepository;
    private final VacationPolicyMapRepository vacationPolicyMapRepository;
    private final MemberRepositoryCustom memberRepositoryCustom;

    public List<VacationPolicyDto> getAllPolicy (){
        List<VacationPolicy> policyList = vacationPolicyRepository.findAllByActiveTrueOrderByVacationPolicyIdAsc();
        List<Object[]> mapCountList = vacationPolicyMapRepository.countGroupByVacationPolicyId();

        Map<Long, Long> policyCount = mapCountList.stream().collect(Collectors.toMap(
                obj -> (Long) obj[0],
                obj -> (Long) obj[1]
        ));

        List<VacationPolicyDto> resultList = policyList.stream().map(entity -> {
            VacationPolicyDto dto = new VacationPolicyDto(entity);
            dto.setMappingUserCount(policyCount.get(dto.getVacationPolicyId()));
            return dto;
        }).collect(Collectors.toList());

        return resultList;
    }

    public void savePolicyData(VacationPolicyDto request){
       VacationPolicy policy = request.makeEntity();
        vacationPolicyRepository.save(policy);
    }

    public void deletePolicyData(Long id){
        VacationPolicy targetData = vacationPolicyRepository.findByVacationPolicyId(id).orElseThrow();
        targetData.delete();

        vacationPolicyRepository.save(targetData);
    }


    public List<VacationPolicyMemberDto> getPolicyMemberData() {
        return memberRepositoryCustom.findVacationPolicyMembers();

    }

    @Transactional
    public void savePolicyMemberMapping(VacationPolicyMemberRequestDto request) {
        Long policyId = request.getPolicyId();
        List<Long> memberIdList = request.getMemberIdList();

        //기존 데이터 삭제
        vacationPolicyMapRepository.deleteByVacationPolicyId(policyId);

        //선택한 멤버 데이터 수정
        List<VacationPolicyMap> mapList = vacationPolicyMapRepository.findAllByMemberIdIsIn(memberIdList);
        Map<Long, VacationPolicyMap> map = mapList.stream().collect(Collectors.toMap(VacationPolicyMap::getMemberId, g -> g));

        List<VacationPolicyMap> resultList = new ArrayList<>();
        for(Long id : memberIdList){
            VacationPolicyMap a = new VacationPolicyMap();

            if(map.containsKey(id)){
                a = map.get(id);
            }

            a.setVacationPolicyId(policyId);
            a.setMemberId(id);
            resultList.add(a);
        }

        vacationPolicyMapRepository.saveAll(resultList);
    }
}
