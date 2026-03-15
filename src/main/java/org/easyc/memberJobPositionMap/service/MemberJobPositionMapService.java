package org.easyc.memberJobPositionMap.service;

import lombok.RequiredArgsConstructor;
import org.easyc.common.exception.CustomException;
import org.easyc.common.exception.CustomExceptionCode;
import org.easyc.jobPosition.repository.JobPositionRepository;
import org.easyc.member.repository.MemberRepository;
import org.easyc.memberJobPositionMap.dto.MemberJobPositionMapRequestDto;
import org.easyc.memberJobPositionMap.dto.MemberJobPositionMapResponseDto;
import org.easyc.memberJobPositionMap.entity.MemberJobPositionMap;
import org.easyc.memberJobPositionMap.repository.MemberJobPositionMapRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberJobPositionMapService {
    private final MemberJobPositionMapRepository repository;
    private final MemberRepository memberRepository;
    private final JobPositionRepository jobPositionRepository;

    public MemberJobPositionMapResponseDto getJobPositionByMemberId(Long memberId) {
        return repository.findByMemberId(memberId)
                .map(mapping -> {
                    MemberJobPositionMapResponseDto dto = new MemberJobPositionMapResponseDto(mapping);

                    if (mapping.getJobPosition() != null) {
                        dto.setJobPositionNm(mapping.getJobPosition().getJobPositionNm());
                    }
                    return dto;
                })
                .orElse(null);
    }

    @Transactional
    public void assignJobPosition(Long memberId, Long jobPositionId) {
        validateMemberAndPosition(memberId, jobPositionId);

        Optional<MemberJobPositionMap> lastPosition = repository.findByMemberId(memberId);

        if (lastPosition.isPresent()) {
            if (Objects.equals(lastPosition.get().getJobPositionId(), jobPositionId)) {
                return;
            }

            repository.softDeleteById(lastPosition.get().getMemberJobPositionMapId());
        }

        MemberJobPositionMap newHistory = MemberJobPositionMap.builder()
                .memberId(memberId)
                .jobPositionId(jobPositionId)
                .build();

        repository.save(newHistory);
    }

    private void validateMemberAndPosition(Long memberId, Long jobPositionId) {
        if (!memberRepository.existsById(memberId) || !jobPositionRepository.existsById(jobPositionId)) {
            throw new CustomException(CustomExceptionCode.SYSTEM_DATA_NOT_FOUND);
        }
    }

    @Transactional
    public void changeJobPositionBulk(MemberJobPositionMapRequestDto dto) {
        Set<Long> memberIds = dto.getMemberIds();
        repository.bulkDeleteByMemberIds(memberIds);

        List<MemberJobPositionMap> newMappings = memberIds.stream()
                .map(memberId -> MemberJobPositionMap.builder()
                        .memberId(memberId)
                        .jobPositionId(dto.getJobPositionId())
                        .deleted(false)
                        .build())
                .collect(Collectors.toList());

        repository.saveAll(newMappings);
    }
}
