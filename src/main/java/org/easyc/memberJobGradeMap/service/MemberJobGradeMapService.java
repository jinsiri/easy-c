package org.easyc.memberJobGradeMap.service;

import lombok.RequiredArgsConstructor;
import org.easyc.common.exception.CustomException;
import org.easyc.common.exception.CustomExceptionCode;
import org.easyc.jobGrade.repository.JobGradeRepository;
import org.easyc.member.repository.MemberRepository;
import org.easyc.memberJobGradeMap.dto.MemberJobGradeMapRequestDto;
import org.easyc.memberJobGradeMap.dto.MemberJobGradeMapResponseDto;
import org.easyc.memberJobGradeMap.entity.MemberJobGradeMap;
import org.easyc.memberJobGradeMap.repository.MemberJobGradeMapRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

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
        validateMemberAndGrade(memberId, jobGradeId);

        Optional<MemberJobGradeMap> lastGrade = repository.findByMemberId(memberId);

        if(lastGrade.isPresent()) {
            if(Objects.equals(lastGrade.get().getJobGradeId(), jobGradeId)) {
                return;
            }

            repository.softDeleteById(lastGrade.get().getMemberJobGradeMapId());
        }

        MemberJobGradeMap mappingData = MemberJobGradeMap.builder()
                .memberId(memberId)
                .jobGradeId(jobGradeId)
                .build();
        repository.save(mappingData);
    }

    private void validateMemberAndGrade(Long memberId, Long jobGradeId) {
        if (!memberRepository.existsById(memberId) || !jobGradeRepository.existsById(jobGradeId)) {
            throw new CustomException(CustomExceptionCode.SYSTEM_DATA_NOT_FOUND);
        }
    }

    @Transactional
    public void changeJobGradeBulk(MemberJobGradeMapRequestDto dto) {
        Set<Long> memberIds = dto.getMemberIds();
        repository.bulkDeleteByMemberIds(memberIds);

        List<MemberJobGradeMap> newMappings = memberIds.stream()
                .map(memberId -> MemberJobGradeMap.builder()
                        .memberId(memberId)
                        .jobGradeId(dto.getJobGradeId())
                        .deleted(false)
                        .build())
                .collect(Collectors.toList());

        repository.saveAll(newMappings);
    }
}
