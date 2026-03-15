package org.easyc.vacation.service;

import lombok.RequiredArgsConstructor;

import org.easyc.vacation.dto.VacationPolicyDto;
import org.easyc.vacation.entity.VacationPolicy;
import org.easyc.vacation.repository.VacationPolicyMapRepository;
import org.easyc.vacation.repository.VacationPolicyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VacationPolicyService {

    private final VacationPolicyRepository vacationPolicyRepository;
    private final VacationPolicyMapRepository vacationPolicyMapRepository;

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



}
