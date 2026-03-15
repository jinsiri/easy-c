package org.easyc.deptMemberMap.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.easyc.common.exception.CustomException;
import org.easyc.common.exception.CustomExceptionCode;
import org.easyc.deptMemberMap.constant.DeptRole;
import org.easyc.deptMemberMap.dto.DeptMemberMapRequestDto;
import org.easyc.deptMemberMap.dto.DeptMemberMapResponseDto;
import org.easyc.deptMemberMap.entity.DeptMemberMap;
import org.easyc.deptMemberMap.repository.DeptMemberMapRepository;
import org.easyc.member.entity.Member;
import org.easyc.member.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeptMemberMapService {
    private final DeptMemberMapRepository deptMemberMapRepository;
    private final MemberRepository memberRepository;

    public List<DeptMemberMapResponseDto> findByMemberId(Long memberId) {
        if (memberId == null) return null;

        Optional<Member> optionalUser = memberRepository.findById(memberId);
        optionalUser.orElseThrow(() -> new CustomException(CustomExceptionCode.MEMBER_NOT_FOUND));

        List<DeptMemberMap> deptMemberMaps = deptMemberMapRepository.findAllByMemberIdWithFetchJoin(memberId);

        return DeptMemberMapResponseDto.fromEntityList(deptMemberMaps);
    }

    @Transactional
    public void assignDeptsToMember(Long memberId, List<DeptMemberMapRequestDto> dtos) {
        for (DeptMemberMapRequestDto dto : dtos) {
            if (dto.getDeptMemberMapId() == null || dto.getDeptMemberMapId() < 0) {
                DeptMemberMap newMap = DeptMemberMap.builder()
                        .memberId(memberId)
                        .deptId(dto.getDeptId())
                        .jobTitleId(dto.getJobTitleId())
                        .build();
                deptMemberMapRepository.save(newMap);
            }
            else {
                DeptMemberMap map = deptMemberMapRepository.findById(dto.getDeptMemberMapId())
                        .orElseThrow(() -> new CustomException(CustomExceptionCode.SYSTEM_DATA_NOT_FOUND));

                if (dto.isDeleted()) {
                    map.delete();
                } else {
                    map.updateInfo(dto.getDeptId(), dto.getJobTitleId(), DeptRole.MEMBER);
                }
            }
        }
    }

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


    @Transactional
    public void assignDeptRole(DeptMemberMapRequestDto dto) {
        DeptMemberMap map = deptMemberMapRepository.findByDeptIdAndMemberId(dto.getDeptId(), dto.getMemberId())
                .orElseThrow(() -> new CustomException(CustomExceptionCode.SYSTEM_DATA_NOT_FOUND));

        Optional<DeptMemberMap> storedRoleOpt = deptMemberMapRepository.findByDeptIdAndDeptRole(dto.getDeptId(), dto.getDeptRole());

        storedRoleOpt.ifPresent(storedRole -> {
            if (!storedRole.getMemberId().equals(dto.getMemberId())) {
                storedRole.updateDeptRole(DeptRole.MEMBER);
            }
        });

        map.updateDeptRole(dto.getDeptRole());
    }
}
