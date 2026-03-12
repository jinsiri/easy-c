package org.easyc.deptMemberMap.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.easyc.common.exception.CustomException;
import org.easyc.common.exception.CustomExceptionCode;
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
