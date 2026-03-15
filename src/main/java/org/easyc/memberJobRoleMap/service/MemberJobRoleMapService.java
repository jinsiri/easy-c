package org.easyc.memberJobRoleMap.service;

import lombok.RequiredArgsConstructor;
import org.easyc.common.exception.CustomException;
import org.easyc.common.exception.CustomExceptionCode;
import org.easyc.jobRole.repository.JobRoleRepository;
import org.easyc.member.repository.MemberRepository;
import org.easyc.memberJobRoleMap.dto.MemberJobRoleMapRequestDto;
import org.easyc.memberJobRoleMap.dto.MemberJobRoleMapResponseDto;
import org.easyc.memberJobRoleMap.entity.MemberJobRoleMap;
import org.easyc.memberJobRoleMap.repository.MemberJobRoleMapRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberJobRoleMapService {
    private final MemberJobRoleMapRepository repository;
    private final MemberRepository memberRepository;
    private final JobRoleRepository jobRoleRepository;

    public MemberJobRoleMapResponseDto getJobRoleByMemberId(Long memberId) {
        return repository.findByMemberId(memberId)
                .map(mapping -> {
                    MemberJobRoleMapResponseDto dto = new MemberJobRoleMapResponseDto(mapping);

                    if (mapping.getJobRole() != null) {
                        dto.setJobRoleNm(mapping.getJobRole().getJobRoleNm());
                        dto.setJobRoleCategory(mapping.getJobRole().getJobRoleCategory());
                        dto.setJobRoleType(mapping.getJobRole().getJobRoleType());
                    }
                    return dto;
                })
                .orElse(null);
    }

    @Transactional
    public void assignJobRole(Long memberId, Long jobRoleId) {
        validateMemberAndRole(memberId, jobRoleId);

        Optional<MemberJobRoleMap> lastRole = repository.findByMemberId(memberId);

        if (lastRole.isPresent()) {
            if (Objects.equals(lastRole.get().getJobRoleId(), jobRoleId)) {
                return;
            }

            repository.softDeleteById(lastRole.get().getMemberJobRoleMapId());
        }

        MemberJobRoleMap newHistory = MemberJobRoleMap.builder()
                .memberId(memberId)
                .jobRoleId(jobRoleId)
                .build();

        repository.save(newHistory);
    }

    private void validateMemberAndRole(Long memberId, Long jobRoleId) {
        if (!memberRepository.existsById(memberId) || !jobRoleRepository.existsById(jobRoleId)) {
            throw new CustomException(CustomExceptionCode.SYSTEM_DATA_NOT_FOUND);
        }
    }

    @Transactional
    public void changeJobRoleBulk(MemberJobRoleMapRequestDto dto) {
        Set<Long> memberIds = dto.getMemberIds();
        repository.bulkDeleteByMemberIds(memberIds);

        List<MemberJobRoleMap> newMappings = memberIds.stream()
                .map(memberId -> MemberJobRoleMap.builder()
                        .memberId(memberId)
                        .jobRoleId(dto.getJobRoleId())
                        .deleted(false)
                        .build())
                .collect(Collectors.toList());

        repository.saveAll(newMappings);
    }
}
