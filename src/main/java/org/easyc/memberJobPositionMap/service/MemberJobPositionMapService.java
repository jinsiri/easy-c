package org.easyc.memberJobPositionMap.service;

import lombok.RequiredArgsConstructor;
import org.easyc.common.exception.CustomException;
import org.easyc.common.exception.CustomExceptionCode;
import org.easyc.jobPosition.repository.JobPositionRepository;
import org.easyc.member.repository.MemberRepository;
import org.easyc.memberJobPositionMap.dto.MemberJobPositionMapResponseDto;
import org.easyc.memberJobPositionMap.entity.MemberJobPositionMap;
import org.easyc.memberJobPositionMap.repository.MemberJobPositionMapRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.SYSTEM_DATA_NOT_FOUND));

        jobPositionRepository.findById(jobPositionId)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.SYSTEM_DATA_NOT_FOUND));

        MemberJobPositionMap mappingData = MemberJobPositionMap.builder()
                .memberId(memberId)
                .jobPositionId(jobPositionId)
                .build();

        repository.save(mappingData);
    }
}
