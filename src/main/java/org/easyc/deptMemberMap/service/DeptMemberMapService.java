package org.easyc.deptMemberMap.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.easyc.deptMemberMap.dto.DeptMemberMapRequestDto;
import org.easyc.deptMemberMap.entity.DeptMemberMap;
import org.easyc.deptMemberMap.repository.DeptMemberMapRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeptMemberMapService {
    private final DeptMemberMapRepository deptMemberMapRepository;

    @Transactional
    public void assignMembersToDept(DeptMemberMapRequestDto dto) {
        if (dto.getMemberIds() != null && !dto.getMemberIds().isEmpty()) {
            List<DeptMemberMap> newMappings = dto.getMemberIds().stream()
                    .map(memberId -> DeptMemberMap.builder()
                            .deptId(dto.getDeptId())
                            .memberId(memberId)
                            .build())
                    .collect(Collectors.toList());

            deptMemberMapRepository.saveAll(newMappings);
        }
    }
}
