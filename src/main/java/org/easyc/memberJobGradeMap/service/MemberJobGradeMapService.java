package org.easyc.memberJobGradeMap.service;

import lombok.RequiredArgsConstructor;
import org.easyc.common.exception.CustomException;
import org.easyc.common.exception.CustomExceptionCode;
import org.easyc.jobGrade.repository.JobGradeRepository;
import org.easyc.member.repository.MemberRepository;
import org.easyc.memberJobGradeMap.entity.MemberJobGradeMap;
import org.easyc.memberJobGradeMap.repository.MemberJobGradeMapRepository;
import org.easyc.memberJobGradeMap.dto.MemberJobGradeMapResponseDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberJobGradeMapService {
    private final MemberJobGradeMapRepository repository;
    private final MemberRepository memberRepository;
    private final JobGradeRepository jobGradeRepository;

    public MemberJobGradeMapResponseDto getJobGradeByMemberId(Long memberId) {
        return repository.findByMemberId(memberId)
                .map(mapping -> {
                    MemberJobGradeMapResponseDto dto = new MemberJobGradeMapResponseDto(mapping);

                    if (mapping.getJobGrade() != null) {
                        dto.setJobGradeNm(mapping.getJobGrade().getJobGradeNm());
                    }
                    return dto;
                })
                .orElse(null);
    }

    @Transactional
    public void assignJobGrade(Long memberId, Long jobGradeId) {
        memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.SYSTEM_DATA_NOT_FOUND));

        jobGradeRepository.findById(jobGradeId)
                .orElseThrow(() -> new CustomException(CustomExceptionCode.SYSTEM_DATA_NOT_FOUND));

        MemberJobGradeMap mappingData = MemberJobGradeMap.builder()
                .memberId(memberId)
                .jobGradeId(jobGradeId)
                .build();

        repository.save(mappingData);
    }
}
